import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { MailService } from '../../infrastructure/mail/mail.service';

@Injectable()
export class EstablishmentService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

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
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        logo: true,
        rating: true,
        phone: true,
        whatsapp: true,
        address: true,
        hours: true,
        specialties: true,
        instagram: true,
        facebook: true,
        website: true,
        showPrice: true,
        isAgency: true,
        locationId: true,
        segmentId: true,
        location: { select: { id: true, name: true } },
        segment: { select: { id: true, name: true } },
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
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            originalPrice: true,
            discountPercentage: true,
            image: true,
            highlight: true,
            active: true,
            publication: {
              select: {
                id: true,
                status: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        },
        publications: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            startDate: true,
            endDate: true,
            createdAt: true,
          },
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
          where: {
            status: { in: ['ACTIVE', 'PADRAO'] },
            AND: [
              { OR: [{ startDate: null }, { startDate: { lte: new Date() } }] },
              { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
            ],
          },
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
    let finalLocationId = locationId;
    if (!finalLocationId) {
      const firstLocation = await this.prisma.location.findFirst();
      if (!firstLocation)
        throw new NotFoundException(
          'Nenhuma localização cadastrada no sistema.',
        );
      finalLocationId = firstLocation.id;
    }

    let finalSegmentId = segmentId;
    if (!finalSegmentId) {
      const firstSegment = await this.prisma.segment.findFirst();
      if (!firstSegment)
        throw new NotFoundException('Nenhum segmento cadastrado no sistema.');
      finalSegmentId = firstSegment.id;
    }

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

  async getMyFirstEstablishmentId(userId: number): Promise<number | null> {
    const units = await this.findByUserId(userId);
    return units.length > 0 ? units[0].id : null;
  }

  async getFollowers(establishmentId: number) {
    const follows = await this.prisma.follow.findMany({
      where: { establishmentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return follows.map((f: any) => ({
      id: f.id,
      followedAt: f.createdAt,
      user: {
        id: f.user?.id,
        name: f.user?.name || 'Consumidor',
        email: f.user?.email,
      },
    }));
  }

  async getFollowersStats(establishmentId: number) {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [totalFollowers, newThisWeek, newThisMonth] = await Promise.all([
      this.prisma.follow.count({ where: { establishmentId } }),
      this.prisma.follow.count({
        where: { establishmentId, createdAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.follow.count({
        where: { establishmentId, createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    const followsForChart = await this.prisma.follow.findMany({
      where: {
        establishmentId,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const growthMap = new Map<string, number>();
    for (const f of followsForChart) {
      const dateKey = f.createdAt.toISOString().split('T')[0];
      growthMap.set(dateKey, (growthMap.get(dateKey) || 0) + 1);
    }

    const growthData: { date: string; newCount: number; totalCount: number }[] =
      [];
    let cumulative = totalFollowers - newThisMonth; // Total before the 30-day window

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dailyCount = growthMap.get(dateKey) || 0;

      cumulative += dailyCount;

      growthData.push({
        date: dateKey,
        newCount: dailyCount,
        totalCount: cumulative,
      });
    }

    return {
      totalFollowers,
      newThisWeek,
      newThisMonth,
      growthData,
    };
  }

  async getCampaigns(establishmentId: number) {
    return this.prisma.campaign.findMany({
      where: { establishmentId },
      orderBy: { sentAt: 'desc' },
    });
  }

  async sendCampaign(
    establishmentId: number,
    subject: string,
    content: string,
  ) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id: establishmentId },
      include: {
        follows: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    const followersEmails = establishment.follows
      .filter((f: any) => f.user?.email && !f.user.notificationOptOut)
      .map((f: any) => f.user.email);

    if (followersEmails.length > 0) {
      await this.mailService.sendCampaignEmails(
        followersEmails,
        subject,
        content,
        { name: establishment.name, slug: establishment.slug },
      );
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        subject,
        content,
        establishmentId,
      },
    });

    return campaign;
  }
}
