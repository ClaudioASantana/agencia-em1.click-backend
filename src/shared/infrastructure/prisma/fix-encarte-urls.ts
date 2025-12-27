import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find encartes with basic Unsplash URLs (missing crop/width params)
  const encartes = await prisma.encartes.findMany({
    where: {
      imagem_capa_url: {
        endsWith: 'ixlib=rb-4.0.3'
      }
    }
  });

  console.log(`Found ${encartes.length} encartes to fix.`);

  for (const encarte of encartes) {
    if (encarte.imagem_capa_url) {
      const newUrl = `${encarte.imagem_capa_url}&auto=format&fit=crop&w=800&q=80`;
      
      await prisma.encartes.update({
        where: { id: encarte.id },
        data: { imagem_capa_url: newUrl }
      });
      console.log(`Updated: ${encarte.titulo}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
