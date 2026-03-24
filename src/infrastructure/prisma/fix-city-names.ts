import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Normalize Itaguaí variants
  const itaguaiResult = await prisma.location.updateMany({
    where: {
      city: { in: ['ITAGUAI', 'itaguai', 'Itaguai'] },
    },
    data: { city: 'Itaguaí' },
  });
  console.log(`✅ Itaguaí: ${itaguaiResult.count} records updated`);

  // Normalize Seropédica variants
  const seropedicaResult = await prisma.location.updateMany({
    where: {
      city: {
        in: [
          'SEROPEDICA',
          'SEROPÉDICA',
          'Seropedica',
          'Seropádica',
          'Serpopédica',
          'Sseropédica',
          'Seropédica, Paracambi...',
        ],
      },
    },
    data: { city: 'Seropédica' },
  });
  console.log(`✅ Seropédica: ${seropedicaResult.count} records updated`);

  // Verify
  const cities = await prisma.location.groupBy({
    by: ['city'],
    _count: true,
    orderBy: { city: 'asc' },
  });
  console.log('\n📊 Cities after cleanup:');
  cities.forEach((c) => console.log(`  ${c.city}: ${c._count} establishments`));
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
