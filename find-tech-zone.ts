import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Finding Tech Zone ---');
  const stores = await prisma.establishment.findMany({
    where: {
      name: {
        contains: 'Tech',
        mode: 'insensitive',
      },
    },
  });

  if (stores.length === 0) {
    console.log('No store found with name "Tech Zone"');
  } else {
    stores.forEach((store) => {
      console.log(`Found: [${store.id}] ${store.name} - Logo: ${store.logo}`);
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
