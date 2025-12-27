import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.estabelecimentos.count();
  const encartes = await prisma.encartes.count();
  const localities = await prisma.localidades.count();
  const segments = await prisma.segmentos.count();

  console.log(`VERIFICATION RESULTS:`);
  console.log(`Establishments: ${count}`);
  console.log(`Encartes: ${encartes}`);
  console.log(`Localities: ${localities}`);
  console.log(`Segments: ${segments}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
