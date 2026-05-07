import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const storeId = 12; // TechZone Eletrônicos
  const newBanner = '/images/placeholders/tech-banner.jpg';

  console.log(`--- Updating Banner for Store ID ${storeId} ---`);

  const result = await prisma.establishment.update({
    where: { id: storeId },
    data: { image: newBanner },
  });

  console.log(`Updated store: ${result.name}`);
  console.log(`New Banner: ${result.image}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
