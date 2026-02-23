import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database logo updates...');

  const updates = [
    {
      name: 'Quartetto Supermercados',
      logo: '/assets/demo/quartetto-logo.png',
    },
    { name: 'Loja Exemplo', logo: '/images/logos/logo-premium-1.png' },
    {
      name: 'Lojas Avenida - Centro',
      logo: '/images/logos/logo-premium-2.png',
    },
    {
      name: 'Lojas Nosso Lar - Centro',
      logo: '/images/logos/logo-premium-3.png',
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

  console.log('✅ Logo updates completed.');
}

main()
  .catch((e) => {
    console.error('❌ Error updating logos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
