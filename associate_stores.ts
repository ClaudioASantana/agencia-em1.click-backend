import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function associateStores() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'mcmoriam+palmas@gmail.com' }
    });

    if (!user) {
      console.log('Usuário não encontrado!');
      return;
    }

    const localidade = await prisma.localidade.findFirst({
      where: { nome: { contains: 'Palmas', mode: 'insensitive' } }
    });

    if (!localidade) {
      console.log('Localidade Palmas não encontrada!');
      return;
    }

    console.log(`Localidade encontrada: ${localidade.nome} (ID: ${localidade.id})`);

    const updateResult = await prisma.estabelecimento.updateMany({
      where: { localidadeId: localidade.id },
      data: { ownerId: user.id }
    });
    
    console.log(`--- Estabelecimentos Atualizados: ${updateResult.count} ---`);

    const updatedStores = await prisma.estabelecimento.findMany({
      where: { localidadeId: localidade.id },
      select: { nome: true }
    });

    console.log(JSON.stringify(updatedStores, null, 2));

  } catch (error) {
    console.error('Erro ao atualizar o banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

associateStores();
