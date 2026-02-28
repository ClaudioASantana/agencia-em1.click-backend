import { PrismaClient, Prisma } from '@prisma/client';
import * as QRCode from 'qrcode';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const vitrineUrl =
  process.env.VITRINE_URL || 'https://vitrine.amorimdev.cloud/';

async function makeQr(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

async function resolveStoreUrl(
  slot: any,
  establishment: any,
  baseUrl: string,
): Promise<string> {
  const targetType = slot.targetType;
  const slug = establishment.slug;

  // Get location slug
  const locationId = establishment.locationId;
  const locations = await prisma.$queryRaw<
    any[]
  >`SELECT slug, name FROM "Location" WHERE id = ${locationId}`;
  const locationSlug = encodeURIComponent(locations[0]?.name || 'cidade');

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
      const segments = await prisma.$queryRaw<
        any[]
      >`SELECT slug, name FROM "Segment" WHERE id = ${segmentId}`;
      const segmentSlug = encodeURIComponent(segments[0]?.name || '');
      return `${baseUrl.replace(/\/$/, '')}/?location=${locationSlug}&segment=${segmentSlug}`;
    }
    default:
      return `${baseUrl}/loja/${slug}`;
  }
}

async function generateCitySegmentImages(
  data: any,
  baseUrl: string,
): Promise<Record<string, string>> {
  const images: Record<string, string> = {};
  const segmentIds: number[] = data.segmentIds ?? [];
  if (segmentIds.length === 0) return images;

  const locationId = data.locationId || data.template?.locationId;
  const locations = await prisma.$queryRaw<
    any[]
  >`SELECT slug, name FROM "Location" WHERE id = ${locationId}`;
  const locationSlug = encodeURIComponent(locations[0]?.name || '');

  const segments = await prisma.$queryRaw<
    any[]
  >`SELECT id, name, slug FROM "Segment" WHERE id IN (${Prisma.join(segmentIds)})`;
  const orderedSegments = segmentIds
    .map((id) => segments.find((s) => s.id === id))
    .filter(Boolean);

  for (const slot of data.template.slots) {
    const segment = orderedSegments[slot.position - 1];
    if (!segment) continue;

    const segSlug = encodeURIComponent(segment.name);
    const url = `${baseUrl.replace(/\/$/, '')}/?location=${locationSlug}&segment=${segSlug}`;
    images[slot.position.toString()] = await makeQr(url);
  }
  return images;
}

async function main() {
  console.log(`--- Regenerating QR Codes with VITRINE_URL: ${vitrineUrl} ---`);

  // 1. Regenerate Impulses
  console.log('\nProcessing Impulses...');
  const impulses = await prisma.qrImpulse.findMany({
    include: {
      template: { include: { slots: { orderBy: { position: 'asc' } } } },
      establishment: true,
    },
  });

  for (const imp of impulses) {
    console.log(`Updating Impulse ${imp.id} (${imp.template.name})...`);
    const images: Record<string, string> = {};

    if (imp.template.mode === 'CITY_SEGMENT') {
      const newImages = await generateCitySegmentImages(imp, vitrineUrl);
      Object.assign(images, newImages);
    } else {
      if (imp.establishment) {
        for (const slot of imp.template.slots) {
          const url = await resolveStoreUrl(
            slot,
            imp.establishment,
            vitrineUrl,
          );
          images[slot.position.toString()] = await makeQr(url);
        }
      }
    }

    await prisma.qrImpulse.update({
      where: { id: imp.id },
      data: { images: images as any },
    });
  }
  console.log(`Updated ${impulses.length} impulses.`);

  // 2. Regenerate Encartes
  console.log('\nProcessing Encartes...');
  const encartes = await (prisma as any).encarte.findMany({
    include: {
      template: { include: { slots: { orderBy: { position: 'asc' } } } },
      establishment: true,
    },
  });

  for (const enc of encartes) {
    console.log(`Updating Encarte ${enc.id} (${enc.titulo})...`);
    const images: Record<string, string> = {};

    if (enc.template.mode === 'CITY_SEGMENT') {
      // Encartes for CITY_SEGMENT use segmentIds from slots since we simplified it
      const segmentIds = enc.template.slots
        .map((s: any) => s.segmentId)
        .filter(Boolean);
      const newImages = await generateCitySegmentImages(
        { ...enc, segmentIds },
        vitrineUrl,
      );
      Object.assign(images, newImages);
    } else {
      if (enc.establishment) {
        for (const slot of enc.template.slots) {
          const url = await resolveStoreUrl(
            slot,
            enc.establishment,
            vitrineUrl,
          );
          images[slot.position.toString()] = await makeQr(url);
        }
      }
    }

    await (prisma as any).encarte.update({
      where: { id: enc.id },
      data: { qrCodes: images as any },
    });
  }
  console.log(`Updated ${encartes.length} encartes.`);

  console.log('\n--- Regeneration Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
