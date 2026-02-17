import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Atualizando ativos visuais das unidades...');

  const assets = {
    avenida: {
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Avenida&backgroundColor=f59e0b',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    },
    nossoLar: {
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NossoLar&backgroundColor=2563eb',
      image:
        'https://images.unsplash.com/photo-1556911220-e15595b39527?q=80&w=1200&auto=format&fit=crop',
    },
  };

  // Avenida Units
  await prisma.establishment.updateMany({
    where: { slug: { in: ['avenida-palmas-centro', 'avenida-capim-dourado'] } },
    data: {
      logo: assets.avenida.logo,
      image: assets.avenida.image,
    },
  });
  console.log('✅ Unidades Avenida atualizadas.');

  // Nosso Lar Units
  await prisma.establishment.updateMany({
    where: { slug: { in: ['nosso-lar-centro', 'nosso-lar-taquaralto'] } },
    data: {
      logo: assets.nossoLar.logo,
      image: assets.nossoLar.image,
    },
  });
  console.log('✅ Unidades Nosso Lar atualizadas.');

  console.log('🚀 Todos os ativos foram vinculados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
