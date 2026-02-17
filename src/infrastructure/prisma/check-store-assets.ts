import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'nosso-lar-centro';
  console.log(`🔍 Verificando unidade: ${slug}`);

  const store = await prisma.establishment.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      image: true,
    },
  });

  if (!store) {
    console.log('❌ Unidade não encontrada!');
  } else {
    console.log('✅ Dados encontrados:');
    console.log(JSON.stringify(store, null, 2));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
