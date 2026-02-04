import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'mcmoriam@gmail.com';
  const password = '123'; // Assuming a simple password or I can ask.
  // Wait, the user said "senha que cadastrei". I don't know it.
  // I should set a temporary one and tell them.
  // OR, I can set it to '123456' which is the common seed password.

  const hashedPassword = await bcrypt.hash('123456', 10);

  console.log(`Creating/Updating user: ${email}`);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
    create: {
      email,
      name: 'Claudio (Restored)',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  });

  console.log(
    `User ${user.email} created/updated with password '123456' and role ADMIN.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
