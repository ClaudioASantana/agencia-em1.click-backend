import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PublicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const { offerIds, establishmentId, status, ...data } = createPublicationDto;

    // If creating a PADRAO, ensure no other PADRAO exists (or unset previous)
    if (status === 'PADRAO') {
      await this.prisma.publication.updateMany({
        where: { establishmentId, status: 'PADRAO' },
        data: { status: 'ARCHIVED' },
      });
    }

    return this.prisma.publication.create({
      data: {
        ...data,
        status: status || 'DRAFT',
        establishmentId,
        offers:
          offerIds && offerIds.length > 0
            ? {
                connect: offerIds.map((id) => ({ id })),
              }
            : undefined,
      },
    });
  }

  findAll(establishmentId: number) {
    return this.prisma.publication.findMany({
      where: { establishmentId },
      orderBy: { createdAt: 'desc' },
      include: {
        establishment: true, // Added to show establishment info in cards
        _count: {
          select: { offers: true },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.publication.findMany({
      where: {
        establishment: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        establishment: true,
        _count: {
          select: { offers: true },
        },
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

  // New Method: Fallback Logic for Vitrine
  async getWebStorePublication(establishmentId: number) {
    const now = new Date();

    // 1. Try to find an ACTIVE campaign within date range
    const activeCampaign = await this.prisma.publication.findFirst({
      where: {
        establishmentId,
        status: 'ACTIVE',
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: { offers: true },
    });

    if (activeCampaign) return activeCampaign;

    // 2. Fallback to PADRAO
    const standardPub = await this.prisma.publication.findFirst({
      where: {
        establishmentId,
        status: 'PADRAO',
      },
      include: { offers: true },
    });

    return standardPub || null;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const { offerIds, status, ...data } = updatePublicationDto;

    // Handle PADRAO uniqueness
    if (status === 'PADRAO') {
      const current = await this.prisma.publication.findUnique({
        where: { id },
        select: { establishmentId: true },
      });
      if (current) {
        await this.prisma.publication.updateMany({
          where: {
            establishmentId: current.establishmentId,
            status: 'PADRAO',
            id: { not: id },
          },
          data: { status: 'ARCHIVED' }, // Demote old standard
        });
      }
    }

    return this.prisma.publication.update({
      where: { id },
      data: {
        ...data,
        status,
        offers: offerIds
          ? {
              set: offerIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.publication.delete({
      where: { id },
    });
  }
}
