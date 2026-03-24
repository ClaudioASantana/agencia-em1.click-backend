import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const logo = 'https://images.unsplash.com/photo-1549439602-43bbcb6d583a?q=80&w=200&h=200&fit=crop';
  const banner = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=1200';

  await prisma.establishment.updateMany({
    where: { 
      slug: {
         in: ['avenida-capim-dourado', 'avenida-palmas-centro']
      }
    },
    data: {
      logo: logo,
      image: banner
    }
  });
  console.log('✅ Imagens da Loja Avenida atualizadas com sucesso para a Demo!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
