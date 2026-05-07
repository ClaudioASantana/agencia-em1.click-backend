import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStores() {
  try {
    const users = await prisma.user.findMany({
      where: { email: { contains: 'agrotins', mode: 'insensitive' } }
    });

    console.log("Users:", users.map(u => ({ id: u.id, email: u.email, role: u.role })));

    if (users.length > 0) {
      for (const u of users) {
        const stores = await prisma.estabelecimento.findMany({
          where: { ownerId: u.id }
        });
        console.log(`Stores for user ${u.email} (${u.id}):`, stores.map(s => s.nome));
      }
    }
    
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStores();
