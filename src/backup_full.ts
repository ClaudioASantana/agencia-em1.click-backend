import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const locations = await prisma.location.findMany();
  const segments = await prisma.segment.findMany();
  const establishments = await prisma.establishment.findMany();
  const offers = await prisma.offer.findMany();
  const users = await prisma.user.findMany();

  const backup = {
    locations,
    segments,
    establishments,
    offers,
    users,
  };

  const backupPath = path.join(
    __dirname,
    'infrastructure',
    'prisma',
    'backup.json',
  );
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

  console.log(`Backup saved to ${backupPath}`);
  console.log(`Users: ${users.length}`);
  console.log(`Establishments: ${establishments.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
