import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normaliza para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

async function main() {
  console.log('Populating slugs...');

  // 1. Locations
  const locations = await prisma.$queryRaw<
    any[]
  >`SELECT id, name FROM "Location" WHERE slug IS NULL`;
  for (const loc of locations) {
    const slug = slugify(loc.name);
    await prisma.$executeRaw`UPDATE "Location" SET slug = ${slug} WHERE id = ${loc.id}`;
    console.log(`Updated Location: ${loc.name} -> ${slug}`);
  }

  // 2. Segments
  const segments = await prisma.$queryRaw<
    any[]
  >`SELECT id, name FROM "Segment" WHERE slug IS NULL`;
  for (const seg of segments) {
    const slug = slugify(seg.name);
    await prisma.$executeRaw`UPDATE "Segment" SET slug = ${slug} WHERE id = ${seg.id}`;
    console.log(`Updated Segment: ${seg.name} -> ${slug}`);
  }

  console.log('Finish!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
