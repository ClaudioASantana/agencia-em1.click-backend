import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      establishments: true,
    },
  });

  console.log('--- User List ---');
  users.forEach((u) => {
    let role = 'SaaS Admin';
    if (u.establishments && u.establishments.length > 0) {
      const storeNames = u.establishments.map((est) => est.name).join(', ');
      role = `Store Owner (Stores: ${storeNames})`;
    }
    console.log(`Email: ${u.email} | Role: ${role} | Active: ${u.active}`);
  });
  console.log('-----------------');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
