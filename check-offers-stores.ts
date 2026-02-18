import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking Stores without Offers ---');
  const storesWithoutOffers = await prisma.establishment.findMany({
    where: {
      offers: {
        none: {},
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (storesWithoutOffers.length === 0) {
    console.log('No stores found without offers.');
  } else {
    console.log(`Found ${storesWithoutOffers.length} stores without offers:`);
    storesWithoutOffers.forEach((store) => {
      console.log(`- [${store.id}] ${store.name} (${store.slug})`);
    });
  }

  console.log('\n--- Checking Offers without Images ---');
  const offersWithoutImages = await prisma.offer.findMany({
    where: {
      OR: [{ image: null }, { image: '' }],
    },
    include: {
      establishment: {
        select: {
          name: true,
        },
      },
    },
  });

  if (offersWithoutImages.length === 0) {
    console.log('No offers found without images.');
  } else {
    console.log(`Found ${offersWithoutImages.length} offers without images:`);
    offersWithoutImages.forEach((offer) => {
      console.log(
        `- [${offer.id}] ${offer.title} (Store: ${offer.establishment.name})`,
      );
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
