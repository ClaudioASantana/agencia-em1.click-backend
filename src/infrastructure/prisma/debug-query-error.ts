import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const userId = 3;
  console.log(`🔍 Testando consulta para UserID: ${userId}`);

  try {
    const pubs = await prisma.publication.findMany({
      where: {
        establishment: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        establishment: true,
        _count: {
          select: { offers: true },
        },
      },
    });

    console.log('✅ Consulta executada com sucesso!');
    console.log('📦 Resultados:', pubs.length);
  } catch (error) {
    console.error('❌ ERRO DETECTADO NA CONSULTA:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

run();
