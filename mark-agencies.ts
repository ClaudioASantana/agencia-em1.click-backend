import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.establishment.updateMany({
    where: {
      id: { in: [4, 5, 6] },
    },
    data: {
      isAgency: true,
    },
  });
  console.log(`Updated ${result.count} establishments as agencies.`);

  // Also check if there are others that should be agencies based on name
  const candidates = await prisma.establishment.findMany({
    where: {
      name: {
        contains: 'Lojas',
        mode: 'insensitive',
      },
    },
  });

  console.log(
    'Candidate agencies found by name:',
    candidates.map((c) => c.name),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
