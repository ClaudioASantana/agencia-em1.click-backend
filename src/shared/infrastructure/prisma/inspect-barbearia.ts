import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const name = 'Barbearia Vintage';
  
  const establishment = await prisma.estabelecimentos.findFirst({
    where: { nome: name },
    include: {
        encarte_estabelecimentos: {
            include: { encartes: true }
        }
    }
  });

  const encarte = await prisma.encartes.findFirst({
      where: { titulo: name }
  });

  console.log('Establishment:', JSON.stringify(establishment, null, 2));
  console.log('Encarte (Direct):', JSON.stringify(encarte, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
