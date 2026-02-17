import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Listando TODAS as unidades e seus ativos...');

  const stores = await prisma.establishment.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
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
