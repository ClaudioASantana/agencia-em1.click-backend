import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bureau.com';
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`User ${email} NOT FOUND in database.`);
  } else {
    console.log('--- USER FOUND ---');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Active: ${user.active}`);

    // Test password 'admin123'
    const isMatch = await bcrypt.compare('admin123', user.password);
    console.log(`Password 'admin123' matches: ${isMatch}`);
    console.log('--- END USER ---');
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
