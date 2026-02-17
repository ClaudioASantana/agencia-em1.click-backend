import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const quartetto = await prisma.establishment.findFirst({
    where: { name: { contains: 'Quartetto' } },
    select: { name: true, logo: true, image: true },
  });

  const nossolar = await prisma.establishment.findUnique({
    where: { slug: 'nosso-lar-centro' },
    select: { name: true, logo: true, image: true },
  });

  console.log('--- QUARTETTO ---');
  console.log(JSON.stringify(quartetto, null, 2));
  console.log('--- NOSSO LAR ---');
  console.log(JSON.stringify(nossolar, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
