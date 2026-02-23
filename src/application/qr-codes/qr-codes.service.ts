import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateTemplateDto } from './dto/create-template.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { CreateImpulseDto } from './dto/create-impulse.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // ── Templates ──────────────────────────────────────────────────────────────

  async createTemplate(dto: CreateTemplateDto) {
    return this.prisma.qrTemplate.create({ data: dto });
  }

  async findAllTemplates() {
    return this.prisma.qrTemplate.findMany({
      include: { slots: { orderBy: { position: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneTemplate(id: number) {
    const template = await this.prisma.qrTemplate.findUnique({
      where: { id },
      include: { slots: { orderBy: { position: 'asc' } } },
    });
    if (!template) throw new NotFoundException('Template não encontrado');
    return template;
  }

  async updateTemplate(id: number, dto: Partial<CreateTemplateDto>) {
    await this.findOneTemplate(id);
    return this.prisma.qrTemplate.update({ where: { id }, data: dto });
  }

  async deleteTemplate(id: number) {
    await this.findOneTemplate(id);
    return this.prisma.qrTemplate.delete({ where: { id } });
  }

  // ── Slots ──────────────────────────────────────────────────────────────────

  async addSlot(templateId: number, dto: CreateSlotDto) {
    const template = await this.findOneTemplate(templateId);

    if (template.slots.length >= template.totalSlots) {
      throw new BadRequestException(
        `Template já possui ${template.totalSlots} slot(s) — máximo atingido`,
      );
    }

    const exists = template.slots.find((s) => s.position === dto.position);
    if (exists) {
      throw new BadRequestException(
        `Já existe um slot na posição ${dto.position}`,
      );
    }

    return this.prisma.qrSlot.create({ data: { ...dto, templateId } });
  }

  async removeSlot(slotId: number) {
    return this.prisma.qrSlot.delete({ where: { id: slotId } });
  }

  // ── Impulses ───────────────────────────────────────────────────────────────

  async createImpulse(dto: CreateImpulseDto) {
    return this.prisma.qrImpulse.create({
      data: dto,
      include: {
        template: { include: { slots: { orderBy: { position: 'asc' } } } },
        establishment: true,
      },
    });
  }

  async findAllImpulses() {
    return this.prisma.qrImpulse.findMany({
      include: { template: true, establishment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findImpulsesByEstablishment(establishmentId: number) {
    return this.prisma.qrImpulse.findMany({
      where: { establishmentId },
      include: { template: { include: { slots: { orderBy: { position: 'asc' } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateImages(impulseId: number) {
    const impulse = await this.prisma.qrImpulse.findUnique({
      where: { id: impulseId },
      include: {
        template: { include: { slots: { orderBy: { position: 'asc' } } } },
        establishment: { include: { location: true } },
      },
    });

    if (!impulse) throw new NotFoundException('Impulso não encontrado');

    const vitrineUrl = this.config.get<string>(
      'VITRINE_URL',
      'https://vitrine.agenciaem1click.com',
    );

    const images: Record<string, string> = {};

    for (const slot of impulse.template.slots) {
      const url = this.resolveUrl(
        slot.targetType,
        impulse.establishment,
        vitrineUrl,
      );
      images[slot.position.toString()] = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
    }

    const updated = await this.prisma.qrImpulse.update({
      where: { id: impulseId },
      data: { images, generatedAt: new Date() },
    });

    return { impulseId, generatedAt: updated.generatedAt, images };
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private resolveUrl(
    targetType: string,
    establishment: any,
    baseUrl: string,
  ): string {
    const slug = establishment.slug;
    const locationName =
      establishment.location?.name ?? establishment.city ?? 'cidade';
    const citySlug = this.toSlug(locationName);

    switch (targetType) {
      case 'STORE':        return `${baseUrl}/loja/${slug}`;
      case 'PROMOTIONS':   return `${baseUrl}/loja/${slug}/ofertas`;
      case 'PUBLICATIONS': return `${baseUrl}/loja/${slug}/publicacoes`;
      case 'CITY':         return `${baseUrl}/cidade/${citySlug}`;
      default:             return `${baseUrl}/loja/${slug}`;
    }
  }

  private toSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
