import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Creating missing indexes...');

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Establishment_locationId_idx" ON "Establishment" ("locationId");
  `);
  console.log('✅ Index: Establishment_locationId_idx');

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Establishment_segmentId_idx" ON "Establishment" ("segmentId");
  `);
  console.log('✅ Index: Establishment_segmentId_idx');

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Establishment_city_idx" ON "Establishment" ("city");
  `);
  console.log('✅ Index: Establishment_city_idx');

  // Verify
  const indexes = await prisma.$queryRaw<any[]>`
    SELECT indexname FROM pg_indexes
    WHERE tablename = 'Establishment'
    ORDER BY indexname;
  `;
  console.log('\n📊 Establishment indexes:');
  indexes.forEach((i: any) => console.log(`  - ${i.indexname}`));
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
