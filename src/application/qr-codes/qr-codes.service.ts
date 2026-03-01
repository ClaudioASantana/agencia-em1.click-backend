import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
      include: {
        slots: { orderBy: { position: 'asc' } },
        location: true,
        establishment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneTemplate(id: number) {
    const template = await this.prisma.qrTemplate.findUnique({
      where: { id },
      include: {
        slots: { orderBy: { position: 'asc' } },
        location: true,
        establishment: true,
      },
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

    return this.prisma.qrSlot.create({
      data: {
        templateId,
        position: dto.position,
        label: dto.label,
        targetType: dto.targetType,
        segmentId: dto.segmentId,
        establishmentId: dto.establishmentId,
      },
    });
  }

  async removeSlot(slotId: number) {
    return this.prisma.qrSlot.delete({ where: { id: slotId } });
  }

  // ── Impulses ───────────────────────────────────────────────────────────────

  async createImpulse(dto: CreateImpulseDto) {
    const template = await this.findOneTemplate(dto.templateId);

    const locationId = dto.locationId ?? template.locationId;
    const establishmentId =
      dto.establishmentId ?? (template as any).establishmentId;
    const segmentIds = dto.segmentIds?.length
      ? dto.segmentIds
      : (template as any).segmentIds;

    if (template.mode === 'CITY_SEGMENT') {
      if (!locationId) {
        throw new BadRequestException(
          'Selecione uma cidade para este template.',
        );
      }
      if (!segmentIds || segmentIds.length === 0) {
        throw new BadRequestException('Selecione ao menos um segmento.');
      }
      return this.prisma.qrImpulse.create({
        data: {
          templateId: dto.templateId,
          locationId: locationId,
          segmentIds: segmentIds,
        },
        include: {
          template: { include: { slots: { orderBy: { position: 'asc' } } } },
          location: true,
        },
      });
    }

    if (template.mode === 'STORES') {
      return this.prisma.qrImpulse.create({
        data: {
          templateId: dto.templateId,
        },
        include: {
          template: { include: { slots: { orderBy: { position: 'asc' } } } },
        },
      });
    }

    // Modo STORE
    if (!establishmentId) {
      throw new BadRequestException(
        'Selecione um estabelecimento para este template.',
      );
    }
    return this.prisma.qrImpulse.create({
      data: {
        templateId: dto.templateId,
        establishmentId: establishmentId,
      },
      include: {
        template: { include: { slots: { orderBy: { position: 'asc' } } } },
        establishment: true,
      },
    });
  }

  async findAllImpulses() {
    return this.prisma.qrImpulse.findMany({
      include: { template: true, establishment: true, location: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findImpulsesByEstablishment(establishmentId: number) {
    return this.prisma.qrImpulse.findMany({
      where: { establishmentId },
      include: {
        template: { include: { slots: { orderBy: { position: 'asc' } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateImages(impulseId: number) {
    const impulse = await this.prisma.qrImpulse.findUnique({
      where: { id: impulseId },
      include: {
        template: {
          include: {
            slots: { orderBy: { position: 'asc' }, include: { segment: true } },
          },
        },
        establishment: { include: { location: true, segment: true } },
        location: true,
      },
    });

    if (!impulse) throw new NotFoundException('Impulso não encontrado');

    const vitrineUrl = this.config.get<string>(
      'VITRINE_URL',
      'https://vitrine.agenciaem1click.com',
    );

    const images: Record<string, string> = {};

    if (impulse.template.mode === 'CITY_SEGMENT') {
      await this.generateCitySegmentImages(impulse, vitrineUrl, images);
    } else if (impulse.template.mode === 'STORES') {
      await this.generateStoresImages(impulse, vitrineUrl, images);
    } else {
      await this.generateStoreImages(impulse, vitrineUrl, images);
    }

    const updated = await this.prisma.qrImpulse.update({
      where: { id: impulseId },
      data: { images, generatedAt: new Date() },
    });

    return { impulseId, generatedAt: updated.generatedAt, images };
  }

  async generateEncarte(dto: any) {
    let {
      templateId,
      establishmentId,
      locationId,
      segmentIds,
      titulo,
      descricao,
    } = dto;

    const template = await this.findOneTemplate(templateId);
    if (!template) throw new NotFoundException('Template não encontrado');

    // Usar defaults do template se não fornecidos no dto
    if (!locationId && template.locationId) locationId = template.locationId;
    if (!establishmentId && (template as any).establishmentId)
      establishmentId = (template as any).establishmentId;
    if (!segmentIds?.length && (template as any).segmentIds)
      segmentIds = (template as any).segmentIds;

    const vitrineUrl = this.config.get<string>(
      'VITRINE_URL',
      'https://vitrine.agenciaem1click.com',
    );
    const images: Record<string, string> = {};

    if (template.mode === 'STORE') {
      if (!establishmentId)
        throw new BadRequestException(
          'ID do estabelecimento é obrigatório no modo STORE',
        );

      const establishment = await this.prisma.establishment.findUnique({
        where: { id: establishmentId },
        include: { location: true },
      });
      if (!establishment)
        throw new NotFoundException('Estabelecimento não encontrado');

      await this.generateStoreImages(
        { ...dto, template, establishment, establishmentId },
        vitrineUrl,
        images,
      );
    } else if (template.mode === 'STORES') {
      // No modo STORES, usamos os estabelecimentos vinculados aos slots
      await this.generateStoresImages({ template }, vitrineUrl, images);
    } else {
      if (!locationId)
        throw new BadRequestException(
          'ID da localidade é obrigatório no modo CITY_SEGMENT',
        );

      await this.generateCitySegmentImages(
        { ...dto, template, locationId, segmentIds },
        vitrineUrl,
        images,
      );
    }

    // Usar "any" para acessar o modelo que ainda não está no client
    return (this.prisma as any).encarte.create({
      data: {
        titulo,
        descricao,
        templateId,
        establishmentId,
        locationId,
        qrCodes: images,
      },
    });
  }

  async findAllEncartes() {
    return (this.prisma as any).encarte.findMany({
      include: {
        template: {
          include: { slots: { orderBy: { position: 'asc' } } },
        },
        establishment: true,
        location: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteEncarte(id: number) {
    return (this.prisma as any).encarte.delete({
      where: { id },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async generateStoreImages(
    impulse: any,
    vitrineUrl: string,
    images: Record<string, string>,
  ) {
    for (const slot of impulse.template.slots) {
      const url = await this.resolveStoreUrl(
        slot,
        impulse.establishment,
        vitrineUrl,
      );
      images[slot.position.toString()] = await this.makeQr(url);
    }
  }

  private async generateStoresImages(
    impulse: any,
    vitrineUrl: string,
    images: Record<string, string>,
  ) {
    for (const slot of impulse.template.slots) {
      if (!slot.establishmentId) continue;

      const establishment = await this.prisma.establishment.findUnique({
        where: { id: slot.establishmentId },
        include: { location: true },
      });

      if (!establishment) continue;

      const url = await this.resolveStoreUrl(slot, establishment, vitrineUrl);
      images[slot.position.toString()] = await this.makeQr(url);
    }
  }

  private async generateCitySegmentImages(
    impulse: any,
    vitrineUrl: string,
    images: Record<string, string>,
  ) {
    const segmentIds: number[] = impulse.segmentIds ?? [];
    if (segmentIds.length === 0) return;

    // Get location slug
    const locationId = impulse.locationId || impulse.template?.locationId;
    const locations = await this.prisma.$queryRaw<
      any[]
    >`SELECT slug, name FROM "Location" WHERE id = ${locationId}`;
    const locationSlug = encodeURIComponent(locations[0]?.name || '');

    // Get segments with slugs
    const segments = await this.prisma.$queryRaw<
      any[]
    >`SELECT id, name, slug FROM "Segment" WHERE id IN (${Prisma.join(segmentIds)})`;

    const orderedSegments = segmentIds
      .map((id) => segments.find((s) => s.id === id))
      .filter(Boolean);

    for (const slot of impulse.template.slots) {
      const segment = orderedSegments[slot.position - 1];
      if (!segment) continue;

      const segSlug = encodeURIComponent(segment.name);
      const url = `${vitrineUrl.replace(/\/$/, '')}/?location=${locationSlug}&segment=${segSlug}`;
      images[slot.position.toString()] = await this.makeQr(url);
    }
  }

  private async resolveStoreUrl(
    slot: any,
    establishment: any,
    baseUrl: string,
  ): Promise<string> {
    const targetType = slot.targetType;
    const slug = establishment.slug;

    // Get location slug
    const locationId = establishment.locationId;
    const locations = await this.prisma.$queryRaw<
      any[]
    >`SELECT slug, name FROM "Location" WHERE id = ${locationId}`;
    const locationSlug = encodeURIComponent(
      locations[0]?.name || establishment.city || 'cidade',
    );

    switch (targetType) {
      case 'STORE':
        return `${baseUrl}/loja/${slug}`;
      case 'PROMOTIONS':
        return `${baseUrl}/loja/${slug}/ofertas`;
      case 'PUBLICATIONS':
        return `${baseUrl}/loja/${slug}/publicacoes`;
      case 'CITY':
        return `${baseUrl.replace(/\/$/, '')}/?location=${locationSlug}`;
      case 'SEGMENT': {
        const segmentId = slot.segmentId || establishment.segmentId;
        const segments = await this.prisma.$queryRaw<
          any[]
        >`SELECT slug, name FROM "Segment" WHERE id = ${segmentId}`;
        const segmentSlug = encodeURIComponent(segments[0]?.name || '');
        return `${baseUrl.replace(/\/$/, '')}/?location=${locationSlug}&segment=${segmentSlug}`;
      }
      default:
        return `${baseUrl}/loja/${slug}`;
    }
  }

  private async makeQr(url: string): Promise<string> {
    return QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
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
