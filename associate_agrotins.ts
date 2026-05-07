import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function associateAgrotinsStores() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'mcmoriam+agrotins@gmail.com' }
    });

    if (!user) {
      console.log('Usuário Agrotins não encontrado!');
      return;
    }

    const storesToUpdate = await prisma.estabelecimento.findMany({
      where: {
        OR: [
          { nome: { contains: 'agrotins', mode: 'insensitive' } },
          { nome: { contains: 'agro', mode: 'insensitive' } },
        ]
      }
    });

    if (storesToUpdate.length === 0) {
      console.log('Nenhum estabelecimento Agrotins encontrado!');
      return;
    }

    const storeIds = storesToUpdate.map(s => s.id);
    console.log(`Lojas encontradas: ${storesToUpdate.map(s => s.nome).join(', ')}`);

    const updateResult = await prisma.estabelecimento.updateMany({
      where: { id: { in: storeIds } },
      data: { ownerId: user.id }
    });
    
    console.log(`--- Estabelecimentos Atualizados: ${updateResult.count} ---`);

  } catch (error) {
    console.error('Erro ao atualizar o banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

associateAgrotinsStores();
