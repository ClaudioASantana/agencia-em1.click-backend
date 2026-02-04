import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'mcmoriam@gmail.com';
  console.log(`Checking user with email: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { establishments: true },
  });

  if (user) {
    console.log('User found:');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Active: ${user.active}`);
    console.log(`Role: ${user.role}`);
    const storeNames =
      user.establishments?.map((est) => est.name).join(', ') || 'None';
    console.log(`Establishments: ${storeNames}`);
    console.log(
      `Password Hash starts with: ${user.password.substring(0, 10)}...`,
    );
  } else {
    console.log('User NOT found.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
