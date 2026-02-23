import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Fixing remaining store logos...');

  const updates = [
    { name: 'Lojas Avenidas', logo: '/images/logos/logo-lojas-avenida-ai.png' },
    {
      name: 'Lojas Avenida - Capim Dourado',
      logo: '/images/logos/logo-lojas-avenida-ai.png',
    },
    {
      name: 'Lojas Nosso Lar',
      logo: '/images/logos/logo-lojas-nosso-lar-ai.png',
    },
    {
      name: 'Lojas Nosso Lar - Taquaralto',
      logo: '/images/logos/logo-lojas-nosso-lar-ai.png',
    },
  ];

  for (const update of updates) {
    const establishment = await prisma.establishment.findFirst({
      where: { name: update.name },
    });

    if (establishment) {
      await prisma.establishment.update({
        where: { id: establishment.id },
        data: { logo: update.logo },
      });
      console.log(`✅ Updated logo for: ${update.name}`);
    } else {
      console.log(`⚠️ Establishment not found: ${update.name}`);
    }
  }

  console.log('✅ Final logo fixes completed.');
}

main()
  .catch((e) => {
    console.error('❌ Error fixing logos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
