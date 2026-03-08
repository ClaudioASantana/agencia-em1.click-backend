import { PrismaClient } from '@prisma/client';
import * as QRCode from 'qrcode';

const prisma = new PrismaClient();

async function resolveStoreUrl(
  slot: any,
  establishment: any,
  baseUrl: string,
  qrTemplate?: any,
): Promise<string> {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const targetType = slot.targetType;
  const slug = establishment?.slug;

  // Get location slug
  // Try establishment location first, then template location
  const locationId = establishment?.locationId || qrTemplate?.locationId;
  let locationSlug = 'cidade';
  if (locationId) {
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    locationSlug = encodeURIComponent(
      location?.name || establishment?.city || 'cidade',
    );
  }

  const isLojistaMode = qrTemplate?.mode === 'STORES';
  const lojistaFilter = isLojistaMode && slug ? `&agency=${slug}` : '';

  switch (targetType) {
    case 'STORE':
      return `${cleanBaseUrl}/loja/${slug}`;
    case 'PROMOTIONS':
      return `${cleanBaseUrl}/loja/${slug}/ofertas`;
    case 'PUBLICATIONS':
      return `${cleanBaseUrl}/loja/${slug}/publicacoes`;
    case 'CITY':
      return `${cleanBaseUrl}/?location=${locationSlug}${lojistaFilter}`;
    case 'SEGMENT': {
      const segmentId =
        slot.segmentId || establishment?.segmentId || qrTemplate?.segmentId;
      const segment = await prisma.segment.findUnique({
        where: { id: segmentId },
      });
      const segmentSlug = encodeURIComponent(segment?.name || '');
      return `${cleanBaseUrl}/?location=${locationSlug}&segment=${segmentSlug}${lojistaFilter}`;
    }
    case 'USER_STORES': {
      let userId = establishment?.users?.[0]?.id;

      // Se o estabelecimento não foi passado com usuários, tenta buscar
      if (!userId && establishment?.id) {
        const estWithUsers = await prisma.establishment.findUnique({
          where: { id: establishment.id },
          include: { users: { select: { id: true } } },
        });
        userId = estWithUsers?.users?.[0]?.id;
      }

      if (!userId) return `${cleanBaseUrl}/`;
      return `${cleanBaseUrl}/unidades/${userId}`;
    }
    default:
      return `${cleanBaseUrl}/loja/${slug}`;
  }
}

async function makeQr(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

async function main() {
  console.log('--- Regenerating QR Codes ---');
  const vitrineUrl =
    process.env.VITRINE_URL || 'https://vitrine.amorimdev.cloud/';
  console.log(`Base URL: ${vitrineUrl}`);

  // 1. Regenerate QrImpulse images
  const impulses = await prisma.qrImpulse.findMany({
    include: {
      template: { include: { slots: { orderBy: { position: 'asc' } } } },
      establishment: { include: { users: true } },
      location: true,
    },
  });

  console.log(`Processing ${impulses.length} impulses...`);
  for (const impulse of impulses) {
    const images: any = {};

    for (const slot of impulse.template.slots) {
      let establishment = impulse.establishment;

      // If STORES mode, slot might have its own establishment
      if (impulse.template.mode === 'STORES' && slot.establishmentId) {
        establishment = await prisma.establishment.findUnique({
          where: { id: slot.establishmentId },
          include: { users: true },
        });
      }

      // NO LONGER SKIP IF NO ESTABLISHMENT - solveStoreUrl can handle it
      const url = await resolveStoreUrl(
        slot,
        establishment,
        vitrineUrl,
        impulse.template,
      );
      images[slot.position.toString()] = await makeQr(url);
    }

    try {
      await prisma.qrImpulse.update({
        where: { id: impulse.id },
        data: { images },
      });
      console.log(`Updated Impulse ${impulse.id}`);
    } catch (err) {
      console.error(
        `Failed to update Impulse ${impulse.id}:`,
        (err as any).message,
      );
    }
  }

  // 2. Regenerate Encarte qrCodes
  const encartes = await prisma.encarte.findMany({
    include: {
      template: { include: { slots: { orderBy: { position: 'asc' } } } },
      establishment: { include: { users: true } },
      location: true,
    },
  });

  console.log(`Processing ${encartes.length} encartes...`);
  for (const encarte of encartes) {
    const qrCodes: any = {};

    if (!encarte.template) continue;

    for (const slot of encarte.template.slots) {
      let establishment = encarte.establishment;

      if (encarte.template.mode === 'STORES' && slot.establishmentId) {
        establishment = await prisma.establishment.findUnique({
          where: { id: slot.establishmentId },
          include: { users: true },
        });
      }

      const url = await resolveStoreUrl(
        slot,
        establishment,
        vitrineUrl,
        encarte.template,
      );
      qrCodes[slot.position.toString()] = await makeQr(url);
    }

    try {
      await prisma.encarte.update({
        where: { id: encarte.id },
        data: { qrCodes },
      });
      console.log(`Updated Encarte ${encarte.id}`);
    } catch (err) {
      console.error(
        `Failed to update Encarte ${encarte.id}:`,
        (err as any).message,
      );
    }
  }

  console.log('--- Finished ---');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
