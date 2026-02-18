import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Updating Offer Images ---');

  const updates = [
    // Grocery
    { ids: [50, 51, 58], image: '/images/placeholders/grocery.jpg' },
    // Drinks
    { ids: [54], image: '/images/placeholders/drinks.jpg' },
    // Cleaning
    { ids: [56, 57], image: '/images/placeholders/cleaning.jpg' },
    // Hygiene
    { ids: [59], image: '/images/placeholders/hygiene.jpg' },
    // Barbecue
    { ids: [55], image: '/images/placeholders/barbecue.jpg' },
    // Combo
    { ids: [60, 61], image: '/images/placeholders/combo.jpg' },
  ];

  for (const group of updates) {
    console.log(
      `Updating ${group.ids.length} offers with image: ${group.image}`,
    );
    const result = await prisma.offer.updateMany({
      where: {
        id: { in: group.ids },
      },
      data: {
        image: group.image,
      },
    });
    console.log(`Updated ${result.count} offers.`);
  }

  console.log('--- Update Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
