import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const encartes = await prisma.encartes.findMany({
    select: {
      id: true,
      titulo: true,
      imagem_capa_url: true,
      localidades: { select: { nome: true } }
    }
  });

  console.log(`Found ${encartes.length} encartes without images.`);
  console.log(JSON.stringify(encartes, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
