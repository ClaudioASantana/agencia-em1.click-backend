import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const storeId = 12; // TechZone Eletrônicos
  const newLogo = '/images/placeholders/tech-logo.jpg';

  console.log(`--- Updating Logo for Store ID ${storeId} ---`);

  const result = await prisma.establishment.update({
    where: { id: storeId },
    data: { logo: newLogo },
  });

  console.log(`Updated store: ${result.name}`);
  console.log(`New Logo: ${result.logo}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
