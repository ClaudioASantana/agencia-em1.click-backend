import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const store = await prisma.establishment.findUnique({
    where: { id: 2 },
    select: { name: true, logo: true, image: true },
  });

  console.log(JSON.stringify(store, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
