import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const establishments = await prisma.estabelecimentos.findMany({
    select: {
      id: true,
      nome: true,
      logo_url: true,
      segmentos: { select: { nome: true } }
    }
  });

  console.log(JSON.stringify(establishments, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
