import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { DEFAULT_FREE_PLAN } from '../plans/plan.constants';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlanByUserId(userId: number) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
    if (!sub || sub.status !== 'ACTIVE') return DEFAULT_FREE_PLAN;
    if (sub.expiresAt && sub.expiresAt < new Date()) return DEFAULT_FREE_PLAN;
    return sub.plan;
  }

  async assign(userId: number, planId: number) {
    return this.prisma.subscription.upsert({
      where: { userId },
      create: { userId, planId, status: 'ACTIVE' },
      update: { planId, status: 'ACTIVE', expiresAt: null },
      include: { plan: true },
    });
  }

  async cancel(userId: number) {
    return this.prisma.subscription.updateMany({
      where: { userId },
      data: { status: 'CANCELLED' },
    });
  }

  async checkLimit(
    userId: number,
    resource: 'publication' | 'offer' | 'establishment',
    establishmentId?: number,
  ): Promise<{ allowed: boolean; limit: number; current: number }> {
    const plan = await this.getPlanByUserId(userId);

    if (resource === 'publication') {
      const estIds = await this.prisma.establishment
        .findMany({
          where: { users: { some: { id: userId } } },
          select: { id: true },
        })
        .then((r) => r.map((e) => e.id));

      const current = await this.prisma.publication.count({
        where: {
          establishmentId: { in: estIds },
          status: { not: 'DRAFT' },
        },
      });
      return {
        allowed: current < plan.maxPublications,
        limit: plan.maxPublications,
        current,
      };
    }

    if (resource === 'offer') {
      const pubId = establishmentId;
      const current = pubId
        ? await this.prisma.offer.count({ where: { publicationId: pubId } })
        : 0;
      return {
        allowed: current < plan.maxOffersPerPub,
        limit: plan.maxOffersPerPub,
        current,
      };
    }

    if (resource === 'establishment') {
      const current = await this.prisma.establishment.count({
        where: { users: { some: { id: userId } } },
      });
      return {
        allowed: current < plan.maxEstablishments,
        limit: plan.maxEstablishments,
        current,
      };
    }

    return { allowed: true, limit: 999, current: 0 };
  }

  async findAll() {
    return this.prisma.subscription.findMany({
      include: {
        plan: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
