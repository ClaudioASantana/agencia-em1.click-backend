import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newUrl = 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80';
  
  // Update Encarte
  await prisma.encartes.updateMany({
    where: { titulo: 'Barbearia Vintage' },
    data: { imagem_capa_url: newUrl }
  });

  console.log('Updated Barbearia Vintage image.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
