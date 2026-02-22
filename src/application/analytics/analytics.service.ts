import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { subDays, startOfDay, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async track(dto: CreateEventDto) {
    // fire-and-forget: não bloqueia a requisição
    this.prisma.analyticsEvent
      .create({ data: dto })
      .catch((e) => console.error('[Analytics] track error:', e));
  }

  async getDashboard(establishmentId: number, period: '7d' | '30d' = '30d') {
    const days = period === '7d' ? 7 : 30;
    const since = startOfDay(subDays(new Date(), days - 1));

    const [storeViews, offerViews, whatsappClicks, followers, offerViewsByOffer, rawTimeline] =
      await Promise.all([
        this.prisma.analyticsEvent.count({
          where: { establishmentId, eventType: 'store_view', createdAt: { gte: since } },
        }),
        this.prisma.analyticsEvent.count({
          where: { establishmentId, eventType: 'offer_view', createdAt: { gte: since } },
        }),
        this.prisma.analyticsEvent.count({
          where: { establishmentId, eventType: 'whatsapp_click', createdAt: { gte: since } },
        }),
        this.prisma.follow.count({ where: { establishmentId } }),
        // top offers by view count
        this.prisma.analyticsEvent.groupBy({
          by: ['offerId'],
          where: {
            establishmentId,
            eventType: 'offer_view',
            offerId: { not: null },
            createdAt: { gte: since },
          },
          _count: { offerId: true },
          orderBy: { _count: { offerId: 'desc' } },
          take: 5,
        }),
        // raw events for timeline
        this.prisma.analyticsEvent.findMany({
          where: { establishmentId, eventType: 'store_view', createdAt: { gte: since } },
          select: { createdAt: true },
        }),
      ]);

    // Build daily timeline
    const timelineMap = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const label = format(subDays(new Date(), days - 1 - i), 'dd/MM');
      timelineMap.set(label, 0);
    }
    for (const event of rawTimeline) {
      const label = format(event.createdAt, 'dd/MM');
      if (timelineMap.has(label)) {
        timelineMap.set(label, (timelineMap.get(label) ?? 0) + 1);
      }
    }
    const storeViewsTrend = {
      labels: Array.from(timelineMap.keys()),
      data: Array.from(timelineMap.values()),
    };

    // Resolve top offer titles
    const topOfferIds = offerViewsByOffer
      .map((g) => g.offerId)
      .filter((id): id is number => id !== null);

    const offerTitles = await this.prisma.offer.findMany({
      where: { id: { in: topOfferIds } },
      select: { id: true, title: true },
    });
    const titleMap = new Map(offerTitles.map((o) => [o.id, o.title]));

    const topOffers = offerViewsByOffer.map((g) => ({
      offerId: g.offerId,
      title: titleMap.get(g.offerId!) ?? 'Oferta',
      views: g._count.offerId,
    }));

    return {
      period,
      storeViews,
      offerViews,
      whatsappClicks,
      followers,
      storeViewsTrend,
      topOffers,
    };
  }
}
