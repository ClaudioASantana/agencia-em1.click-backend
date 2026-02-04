import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'amorim.info@teste.com';
  console.log(`Checking for user with email: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    console.log('User found:', user);
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
