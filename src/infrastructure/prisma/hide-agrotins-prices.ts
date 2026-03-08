import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🙈 Ocultando preços das ofertas Agrotins 2026...');

  const result = await prisma.establishment.updateMany({
    where: {
      users: {
        some: { email: 'contato@agrotins.to.gov.br' },
      },
    },
    data: {
      showPrice: false,
    },
  });

  console.log(
    `✅ ${result.count} estabelecimentos atualizados para não mostrar preço.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
