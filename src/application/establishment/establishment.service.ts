import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';

@Injectable()
export class EstablishmentService {
  constructor(private prisma: PrismaService) {}

  private filterOffers(offers: any[]) {
    const now = new Date();

    // 1. Filter out invalid active offers (expired or not started)
    // PADRAO usually doesn't have dates, or if it does, we ignore or respect?
    // Usually PADRAO is timeless, but let's assume if it has dates it should respect them too?
    // For now, let's treat PADRAO as always valid if status is PADRAO.
    // ACTIVE must respect dates.

    const validOffers = offers.filter((o) => {
      if (o.publication?.status === 'ACTIVE') {
        if (!o.publication.startDate || !o.publication.endDate) return true; // Safety
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

  async findAll(
    location?: string,
    segment?: string,
    userId?: number,
    followed?: boolean,
    isAgency?: boolean,
  ) {
    const where: any = {};

    if (location) {
      where.OR = [{ location: { name: location } }, { city: location }];
    }
    if (segment) {
      where.segment = { name: segment };
    }
    if (isAgency !== undefined) {
      where.isAgency = isAgency;
    }

    if (userId && !followed) {
      where.users = {
        some: {
          id: userId,
        },
      };
    }

    if (followed && userId) {
      where.follows = {
        some: {
          userId: userId,
        },
      };
    }

    const establishments = await this.prisma.establishment.findMany({
      where,
      include: {
        location: true,
        segment: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        offers: {
          where: {
            active: true,
            publication: { status: { in: ['ACTIVE', 'PADRAO'] } },
          },
          include: { publication: true },
        },
        publications: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return establishments.map((est) => ({
      ...est,
      specialties: est.specialties ? JSON.parse(est.specialties) : [],
      offers: this.filterOffers(est.offers),
    }));
  }

  async findOne(slug: string) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { slug },
      include: {
        location: true,
        segment: true,
        offers: {
          where: {
            active: true,
            publication: {
              status: { in: ['ACTIVE', 'PADRAO'] },
            },
          },
          include: { publication: true },
        },
        publications: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!establishment) return null;

    return {
      ...establishment,
      specialties: establishment.specialties
        ? JSON.parse(establishment.specialties)
        : [],
      offers: this.filterOffers(establishment.offers),
    };
  }

  async findById(id: number | null) {
    if (!id) return null;
    const establishment = await this.prisma.establishment.findUnique({
      where: { id },
      include: {
        location: true,
        segment: true,
        offers: {
          where: {
            active: true,
            publication: {
              status: { in: ['ACTIVE', 'PADRAO'] },
            },
          },
          include: { publication: true },
        },
        publications: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (establishment) {
      return {
        ...establishment,
        specialties: establishment.specialties
          ? JSON.parse(establishment.specialties)
          : [],
        offers: this.filterOffers(establishment.offers),
      };
    }

    return establishment;
  }
  async update(id: number, data: any) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    const { specialties, locationId, segmentId, ...otherData } = data;

    const updated = await this.prisma.establishment.update({
      where: { id },
      data: {
        ...otherData,
        specialties: specialties ? JSON.stringify(specialties) : undefined,
        location: locationId
          ? { connect: { id: Number(locationId) } }
          : undefined,
        segment: segmentId ? { connect: { id: Number(segmentId) } } : undefined,
      },
    });

    return {
      ...updated,
      specialties: updated.specialties ? JSON.parse(updated.specialties) : [],
    };
  }
  async findAllAdmin(isAgency?: boolean) {
    const where: any = {};
    if (isAgency !== undefined) {
      where.isAgency = isAgency;
    }

    return this.prisma.establishment.findMany({
      where,
      include: {
        location: true,
        segment: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateEstablishmentDto, userId: number) {
    // Extract relations FKs to avoid duplication with connect
    const { specialties, locationId, segmentId, ...otherData } = data;

    // Defaults if not provided (for safety)
    const finalLocationId = locationId || 1; // Fallback to first location
    const finalSegmentId = segmentId || 1; // Fallback to first segment

    // Better: Allow creating with minimal data, e.g. Name.
    // We need unique slug.
    const slug =
      otherData.slug ||
      (otherData.name || 'unnamed')
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

    const establishment = await this.prisma.establishment.create({
      data: {
        ...otherData,
        slug: slug + '-' + Math.floor(Math.random() * 1000), // Ensure Uniqueness
        specialties: specialties ? JSON.stringify(specialties) : '[]',
        isAgency: data.isAgency || false,
        location: { connect: { id: finalLocationId } },
        segment: { connect: { id: finalSegmentId } },
        // Link the creating user!
        users: { connect: { id: userId } },
      },
    });

    return establishment;
  }

  async findByUserId(userId: number) {
    const establishments = await this.prisma.establishment.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        location: true,
        segment: true,
        offers: {
          where: {
            active: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return establishments.map((est) => ({
      ...est,
      specialties: est.specialties ? JSON.parse(est.specialties) : [],
    }));
  }

  async getStats(establishmentId: number) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id: establishmentId },
      include: {
        offers: {
          where: { active: true },
        },
        follows: true,
      },
    });

    if (!establishment) throw new NotFoundException('Establishment not found');

    // Simulate some historical data based on creation dates
    // In a real scenario, this would come from an Analytics/Logs table
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('pt-BR', { weekday: 'short' });
    });

    const last30Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (30 - i * 5));
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    });

    return {
      views: Math.floor(Math.random() * 500) + 1000, // Placeholder as we don't track views yet
      activeOffers: establishment.offers.length,
      rating: establishment.rating || 0,
      followers: establishment.follows.length,
      visitsHistory: {
        labels: last30Days,
        values: [30, 45, 25, 60, 55, 90, 70], // Hardcoded for now but ready for API
      },
      engagementHistory: {
        labels: last7Days,
        values: [12, 19, 15, 8, 22, 30, 25], // Hardcoded for now but ready for API
      },
    };
  }
}
