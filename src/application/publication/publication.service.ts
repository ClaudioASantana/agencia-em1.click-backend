import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MailService } from '../../infrastructure/mail/mail.service';
import { WhatsappService } from '../../infrastructure/whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PublicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly whatsappService: WhatsappService,
    private readonly config: ConfigService,
  ) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const { offerIds, establishmentId, status, ...data } = createPublicationDto;

    if (status === 'PADRAO') {
      await this.prisma.publication.updateMany({
        where: { establishmentId, status: 'PADRAO' },
        data: { status: 'ARCHIVED' },
      });
    }

    const pub = await this.prisma.publication.create({
      data: {
        ...data,
        status: status || 'DRAFT',
        establishmentId,
        offers:
          offerIds && offerIds.length > 0
            ? { connect: offerIds.map((id) => ({ id })) }
            : undefined,
      },
      include: { establishment: true },
    });

    // Disparar alertas se criado diretamente como ACTIVE
    if (status === 'ACTIVE') {
      this.notifyFollowers(pub);
      this.notifyLeads(pub);
    }

    return pub;
  }

  findAll(establishmentId: number) {
    return this.prisma.publication.findMany({
      where: { establishmentId },
      orderBy: { createdAt: 'desc' },
      include: {
        establishment: true,
        _count: { select: { offers: true } },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.publication.findMany({
      where: {
        establishment: { users: { some: { id: userId } } },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        establishment: true,
        _count: { select: { offers: true } },
      },
    });
  }

  async findOne(id: number) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: { offers: true },
    });
    if (!publication) throw new NotFoundException('Publication not found');
    return publication;
  }

  async getWebStorePublication(establishmentId: number) {
    const now = new Date();

    const activeCampaign = await this.prisma.publication.findFirst({
      where: {
        establishmentId,
        status: 'ACTIVE',
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      include: { offers: true },
    });

    if (activeCampaign) return activeCampaign;

    const standardPub = await this.prisma.publication.findFirst({
      where: { establishmentId, status: 'PADRAO' },
      include: { offers: true },
    });

    return standardPub || null;
  }

  async update(
    id: number,
    updatePublicationDto: UpdatePublicationDto,
    userId?: number,
  ) {
    const { offerIds, status, ...data } = updatePublicationDto;

    // Buscar status anterior para detectar transição para ACTIVE
    const existing = await this.prisma.publication.findUnique({
      where: { id },
      select: { status: true, establishmentId: true },
    });

    if (!existing) throw new NotFoundException('Publication not found');

    // Verificar propriedade quando userId fornecido (não-admin)
    if (userId) {
      const owns = await this.prisma.establishment.findFirst({
        where: {
          id: existing.establishmentId,
          users: { some: { id: userId } },
        },
        select: { id: true },
      });
      if (!owns)
        throw new ForbiddenException(
          'Sem permissão para editar esta publicação',
        );
    }

    if (status === 'PADRAO' && existing) {
      await this.prisma.publication.updateMany({
        where: {
          establishmentId: existing.establishmentId,
          status: 'PADRAO',
          id: { not: id },
        },
        data: { status: 'ARCHIVED' },
      });
    }

    const updated = await this.prisma.publication.update({
      where: { id },
      data: {
        ...data,
        status,
        offers: offerIds ? { set: offerIds.map((id) => ({ id })) } : undefined,
      },
      include: { establishment: true },
    });

    // Disparar alertas apenas na transição DRAFT/PADRAO → ACTIVE
    if (status === 'ACTIVE' && existing?.status !== 'ACTIVE') {
      this.notifyFollowers(updated);
      this.notifyLeads(updated);
    }

    return updated;
  }

  async remove(id: number, userId?: number) {
    if (userId) {
      const existing = await this.prisma.publication.findUnique({
        where: { id },
        select: { establishmentId: true },
      });
      if (!existing) throw new NotFoundException('Publication not found');

      const owns = await this.prisma.establishment.findFirst({
        where: {
          id: existing.establishmentId,
          users: { some: { id: userId } },
        },
        select: { id: true },
      });
      if (!owns)
        throw new ForbiddenException(
          'Sem permissão para excluir esta publicação',
        );
    }
    return this.prisma.publication.delete({ where: { id } });
  }

  // --- Helpers ---

  private notifyFollowers(pub: {
    id: number;
    title: string;
    description?: string | null;
    establishmentId: number;
    establishment: { name: string; slug: string };
  }) {
    // Fire-and-forget: não bloqueia a resposta HTTP
    setImmediate(async () => {
      try {
        const followers = await this.prisma.follow.findMany({
          where: { establishmentId: pub.establishmentId },
          include: { user: true },
        });

        const emails = followers
          .filter(
            (f) =>
              f.user.emailVerified &&
              !f.user.notificationOptOut &&
              f.user.email,
          )
          .map((f) => f.user.email);

        if (emails.length > 0) {
          await this.mailService.sendNewCampaignAlert(
            emails,
            { title: pub.title, description: pub.description },
            { name: pub.establishment.name, slug: pub.establishment.slug },
          );
        }
      } catch (err) {
        console.error('[PublicationService] notifyFollowers error:', err);
      }
    });
  }

  private notifyLeads(pub: {
    id: number;
    title: string;
    description?: string | null;
    establishmentId: number;
    establishment: { name: string; slug: string };
  }) {
    // Fire-and-forget: não bloqueia a resposta HTTP
    setImmediate(async () => {
      try {
        // Busca leads ativos que ainda não receberam notificação desta publicação
        const leads = await this.prisma.lead.findMany({
          where: {
            establishmentId: pub.establishmentId,
            active: true,
            notifications: { none: { publicationId: pub.id } },
          },
          select: { id: true, phone: true },
        });

        if (leads.length === 0) return;

        const vitrineUrl =
          this.config.get<string>('VITRINE_URL') ??
          'https://vitrine.amorimdev.cloud';
        const storeUrl = `${vitrineUrl}/loja/${pub.establishment.slug}`;

        const message =
          `🎉 *${pub.establishment.name}* tem uma nova campanha!\n\n` +
          `*${pub.title}*${pub.description ? `\n${pub.description}` : ''}\n\n` +
          `Confira as ofertas: ${storeUrl}\n\n` +
          `_Para cancelar, responda SAIR._`;

        for (const lead of leads) {
          const status = await this.whatsappService.send(lead.phone, message);

          // Registra a notificação para evitar reenvios
          await this.prisma.leadNotification.create({
            data: {
              leadId: lead.id,
              publicationId: pub.id,
              status: status.toUpperCase(),
            },
          });
        }

        console.log(
          `[PublicationService] notifyLeads: ${leads.length} lead(s) notificados para publicação #${pub.id}`,
        );
      } catch (err) {
        console.error('[PublicationService] notifyLeads error:', err);
      }
    });
  }
}
