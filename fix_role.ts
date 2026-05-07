import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserRole() {
  try {
    const updatedUser = await prisma.user.updateMany({
      where: { email: { contains: 'agrotins', mode: 'insensitive' } },
      data: { role: 'STORE_OWNER' }
    });
    
    console.log(`--- Usuários Agrotins Atualizados: ${updatedUser.count} ---`);

    const users = await prisma.user.findMany({
      where: { email: { contains: 'agrotins', mode: 'insensitive' } }
    });
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erro ao atualizar o banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();
