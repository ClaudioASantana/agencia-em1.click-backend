import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bureau.com';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`Password for ${email} updated successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
