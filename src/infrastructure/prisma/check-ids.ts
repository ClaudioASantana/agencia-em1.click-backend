import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ids = [7, 8, 9, 10];
  console.log(`🔍 Verificando IDs: ${ids.join(', ')}`);

  const stores = await prisma.establishment.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      logo: true,
      image: true,
    },
  });

  console.log(JSON.stringify(stores, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
