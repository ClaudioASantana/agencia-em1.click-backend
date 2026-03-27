import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- INICIANDO TESTE DE CONSULTAS COM O NOVO MAPEAMENTO ---')
  
  try {
    const users = await prisma.user.findMany({ take: 2 })
    console.log(`✅ Users (Banco: Cliente): ${users.length} registro(s) retornado(s).`)

    const lojas = await prisma.establishment.findMany({ take: 2 })
    console.log(`✅ Establishments (Banco: Usuario_Loja): ${lojas.length} registro(s) retornado(s).`)

    const pub = await prisma.publication.findMany({ take: 2 })
    console.log(`✅ Publications (Banco: Promocao): ${pub.length} registro(s) retornado(s).`)

    console.log('\nTudo funciona perfeitamente! Os dados foram lidos sem erro das tabelas em português.')
  } catch (error) {
    console.error('❌ Erro durante a consulta:', error)
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
