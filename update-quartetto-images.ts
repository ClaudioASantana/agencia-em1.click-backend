import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const storeName = 'Quartetto - Palmas Shopping';

  console.log(`--- Updating Images for ${storeName} ---`);

  // 1. Update Store Banner and Logo (using banner as logo fallback if needed)
  await prisma.establishment.updateMany({
    where: { name: storeName },
    data: {
      image: '/images/placeholders/supermarket-banner.jpg',
      logo: '/images/placeholders/supermarket-banner.jpg', // Using banner as logo for now if no specific logo
    },
  });

  // 2. Update Specific Offers
  const offers = [
    { term: 'Arroz', image: '/images/placeholders/rice.jpg' },
    { term: 'Feijão', image: '/images/placeholders/beans.jpg' },
    { term: 'Óleo', image: '/images/placeholders/oil.jpg' },
    { term: 'Açúcar', image: '/images/placeholders/sugar.jpg' },
    { term: 'Café', image: '/images/placeholders/coffee.jpg' },
    { term: 'Leite', image: '/images/placeholders/milk.jpg' },
  ];

  for (const offer of offers) {
    // Find establishment first to get ID regarding the name
    const store = await prisma.establishment.findFirst({
      where: { name: storeName },
    });
    if (!store) {
      console.error('Store not found');
      return;
    }

    const result = await prisma.offer.updateMany({
      where: {
        establishmentId: store.id,
        title: { contains: offer.term, mode: 'insensitive' },
      },
      data: { image: offer.image },
    });
    console.log(
      `Updated ${result.count} offers containing "${offer.term}" with ${offer.image}`,
    );
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
