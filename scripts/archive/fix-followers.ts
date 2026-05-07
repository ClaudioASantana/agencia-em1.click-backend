import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const targetEmail = 'claudio.a.santana@outlook.com';
  
  // 1. Achar o usuário com esse email ou criar se não existir
  let user = await prisma.user.findUnique({
    where: { email: targetEmail }
  });

  if (!user) {
    console.log(`Usuário com email ${targetEmail} não encontrado. Pegando o primeiro...`);
    user = await prisma.user.findFirst();
    if (!user) {
        console.log('Nenhum dado na tabela User!');
        return;
    }
  }

  // 2. Apagar todos os Follows do banco, exceto se for o do user alvo
  console.log(`Apagando follows antigos para limpar o teste...`);
  await prisma.follow.deleteMany({
      where: {
          userId: { not: user.id }
      }
  });

  // Garantir que a conta tem o targetEmail
  await prisma.user.update({
    where: { id: user.id },
    data: { email: targetEmail }
  });

  // Garantir que esse user está seguindo pelo menos 1 estabelecimento
  const establishments = await prisma.establishment.findMany({ take: 1 });
  if (establishments.length > 0) {
      const est = establishments[0];
      const existingFollow = await prisma.follow.findFirst({
          where: { userId: user.id, establishmentId: est.id }
      });

      if (!existingFollow) {
          console.log(`Criando Follow do usuário testador na loja ${est.name}...`);
          await prisma.follow.create({
              data: {
                  userId: user.id,
                  establishmentId: est.id
              }
          });
      }
      console.log(`Pronto! A Loja '${est.name}' agora tem o seu email '${targetEmail}' como UNICO follower.`);
  }

  console.log('Banco de dados configurado para teste de disparo da campanha (Opção 1) com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
