import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Listando todas as unidades "Nosso Lar"...');

  const stores = await prisma.establishment.findMany({
    where: { name: { contains: 'Nosso Lar', mode: 'insensitive' } },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      image: true,
      address: true,
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
