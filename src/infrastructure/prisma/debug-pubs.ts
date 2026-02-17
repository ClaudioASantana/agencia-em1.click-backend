import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const email = 'quartetto.palmas@agencia.com';
  const user = await prisma.user.findUnique({
    where: { email },
    include: { establishments: true },
  });

  if (!user) {
    console.log(`❌ Usuário ${email} não encontrado.`);
    return;
  }

  console.log('👤 Usuário:', user.name, `(${user.id})`);
  console.log(
    '🏪 Estabelecimentos vinculados:',
    user.establishments.map((e) => ({ id: e.id, name: e.name })),
  );

  const establishmentIds = user.establishments.map((e) => e.id);

  const pubs = await prisma.publication.findMany({
    where: { establishmentId: { in: establishmentIds } },
    include: {
      _count: { select: { offers: true } },
      establishment: { select: { name: true } },
    },
  });

  console.log('📄 Publicações encontradas:');
  console.log(JSON.stringify(pubs, null, 2));

  // Check unique IDs of publications
  const pubIds = pubs.map((p) => p.id);
  console.log('🆔 Lista de IDs de Publicações:', pubIds);
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
