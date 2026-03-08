import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OfferService {
  constructor(private prisma: PrismaService) {}

  async create(createOfferDto: CreateOfferDto) {
    const { establishmentId, publicationId, ...data } = createOfferDto;

    // Generate slug
    const slug = this.generateSlug(data.title);

    return this.prisma.offer.create({
      data: {
        ...data,
        slug,
        establishment: { connect: { id: establishmentId } },
        ...(publicationId
          ? { publication: { connect: { id: publicationId } } }
          : {}),
      },
    });
  }

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD') // Decompose combined chars (accents)
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
      .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens

    // Append random string to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${randomSuffix}`;
  }

  private filterOffers(offers: any[]) {
    const now = new Date();

    // 1. Filter out invalid active offers (expired or not started)
    const validOffers = offers.filter((o) => {
      if (o.publication?.status === 'ACTIVE') {
        if (!o.publication.startDate || !o.publication.endDate) return true;
        const start = new Date(o.publication.startDate);
        const end = new Date(o.publication.endDate);
        return now >= start && now <= end;
      }
      return true; // PADRAO or others
    });

    // 2. Check if we have any valid ACTIVE offers
    const hasActive = validOffers.some(
      (o) => o.publication?.status === 'ACTIVE',
    );

    if (hasActive) {
      return validOffers.filter((o) => o.publication?.status === 'ACTIVE');
    }

    // 3. Fallback to PADRAO
    return validOffers.filter((o) => o.publication?.status === 'PADRAO');
  }

  async findBySlug(slug: string) {
    const offer = await this.prisma.offer.findFirst({
      where: { slug } as any,
      include: {
        establishment: {
          include: {
            offers: {
              where: {
                active: true,
                publication: {
                  status: { in: ['ACTIVE', 'PADRAO'] },
                },
              },
              include: { publication: true },
              // Removed 'take: 4' to allow proper filtering in memory first
            },
          },
        },
      },
    });
    if (!offer) {
      throw new NotFoundException(`Offer with slug ${slug} not found`);
    }

    // Apply filtering to related offers
    if (offer.establishment && offer.establishment.offers) {
      const filtered = this.filterOffers(offer.establishment.offers);
      // Remove the current offer itself from related list if desired, or keep logic simple.
      // Usually "Related" implies "Other" offers. Let's filter out current ID.
      const others = filtered.filter((o) => o.id !== offer.id);
      offer.establishment.offers = others.slice(0, 4);
    }

    return offer;
  }

  async findAll(establishmentId?: number, publicationId?: number) {
    const where: any = {};
    if (establishmentId) {
      where.establishmentId = establishmentId;
    }
    if (publicationId) {
      where.publicationId = publicationId;
    }
    return this.prisma.offer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { establishment: true },
    });
  }

  async findOne(id: number) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: {
        establishment: {
          include: {
            offers: {
              where: {
                active: true,
                publication: { status: { in: ['ACTIVE', 'PADRAO'] } },
              },
              include: { publication: true },
            },
          },
        },
      },
    });
    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    if (offer.establishment && offer.establishment.offers) {
      const filtered = this.filterOffers(offer.establishment.offers);
      const others = filtered.filter((o) => o.id !== offer.id);
      offer.establishment.offers = others.slice(0, 4);
    }

    return offer;
  }

  async update(id: number, updateOfferDto: UpdateOfferDto, userId?: number) {
    const { establishmentId, ...data } = updateOfferDto;

    if (userId) {
      const offer = await this.prisma.offer.findUnique({
        where: { id },
        select: { establishmentId: true },
      });
      if (!offer) throw new NotFoundException(`Offer with ID ${id} not found`);

      const owns = await this.prisma.establishment.findFirst({
        where: { id: offer.establishmentId, users: { some: { id: userId } } },
        select: { id: true },
      });
      if (!owns) throw new ForbiddenException('Sem permissão para editar esta oferta');
    }

    return this.prisma.offer.update({ where: { id }, data });
  }

  async remove(id: number, userId?: number) {
    if (userId) {
      const offer = await this.prisma.offer.findUnique({
        where: { id },
        select: { establishmentId: true },
      });
      if (!offer) throw new NotFoundException(`Offer with ID ${id} not found`);

      const owns = await this.prisma.establishment.findFirst({
        where: { id: offer.establishmentId, users: { some: { id: userId } } },
        select: { id: true },
      });
      if (!owns) throw new ForbiddenException('Sem permissão para excluir esta oferta');
    }

    return this.prisma.offer.delete({ where: { id } });
  }
}
