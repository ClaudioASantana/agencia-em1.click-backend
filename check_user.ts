import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findFirst({
      where: { 
        email: {
          contains: 'mcmoriam'
        }
      }
    });

    const usersMcmoriam = await prisma.user.findMany({
      where: { 
        email: {
          contains: 'mcmoriam'
        }
      }
    });

    console.log('--- Usuários mcmoriam Encontrados ---');
    console.log(JSON.stringify(usersMcmoriam, null, 2));

    const allLojistas = await prisma.user.findMany({
      where: { role: 'STORE_OWNER' },
      select: { email: true, name: true, role: true }
    });

    console.log(`\n--- Total de Lojistas (STORE_OWNER) encontrados: ${allLojistas.length} ---`);
    console.log(JSON.stringify(allLojistas.slice(0, 5), null, 2));
    if (allLojistas.length > 5) {
      console.log('... (mostrando apenas os 5 primeiros)');
    }

  } catch (error) {
    console.error('Erro ao consultar o banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
