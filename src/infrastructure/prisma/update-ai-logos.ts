import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Updating stores with AI generated logos...');

  const updates = [
    { name: 'Loja Exemplo', logo: '/images/logos/logo-loja-exemplo-ai.png' },
    {
      name: 'Lojas Avenida - Centro',
      logo: '/images/logos/logo-lojas-avenida-ai.png',
    },
    {
      name: 'Lojas Nosso Lar - Centro',
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

  console.log('✅ AI Logo updates completed.');
}

main()
  .catch((e) => {
    console.error('❌ Error updating logos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
