import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    const existing = await this.prisma.lead.findUnique({
      where: {
        phone_establishmentId: {
          phone: dto.phone,
          establishmentId: dto.establishmentId,
        },
      },
    });

    if (existing) {
      if (existing.active) {
        throw new ConflictException('Você já está inscrito para receber ofertas desta loja.');
      }
      // Reativar lead que havia cancelado
      return this.prisma.lead.update({
        where: { id: existing.id },
        data: {
          active: true,
          unsubscribedAt: null,
          consentAt: new Date(),
          consentText: dto.consentText,
          shareTokenId: dto.shareTokenId ?? existing.shareTokenId,
        },
        select: { id: true, phone: true, active: true },
      });
    }

    return this.prisma.lead.create({
      data: {
        phone: dto.phone,
        establishmentId: dto.establishmentId,
        shareTokenId: dto.shareTokenId,
        consentText: dto.consentText,
      },
      select: { id: true, phone: true, active: true },
    });
  }

  async unsubscribe(phone: string, establishmentId: number) {
    await this.prisma.lead.updateMany({
      where: { phone, establishmentId, active: true },
      data: { active: false, unsubscribedAt: new Date() },
    });
  }

  async getByEstablishment(establishmentId: number) {
    const leads = await this.prisma.lead.findMany({
      where: { establishmentId, active: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        phone: true,
        consentAt: true,
        createdAt: true,
        shareToken: { select: { token: true, clickCount: true } },
      },
    });

    return { total: leads.length, leads };
  }

  // Usado pelo PublicationService para notificar leads (Fase 3)
  async getActivePhones(establishmentId: number): Promise<string[]> {
    const leads = await this.prisma.lead.findMany({
      where: { establishmentId, active: true },
      select: { phone: true },
    });
    return leads.map((l) => l.phone);
  }
}
