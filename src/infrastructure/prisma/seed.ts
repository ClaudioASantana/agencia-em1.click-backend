import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Default Location (Belo Horizonte)
  const location = await prisma.location.upsert({
    where: { name: 'Belo Horizonte' },
    update: {},
    create: { name: 'Belo Horizonte' },
  });

  // 2. Create Default Segments
  const segments = ['Varejo', 'Alimentação', 'Serviços', 'Tecnologia'];
  for (const seg of segments) {
    await prisma.segment.upsert({
      where: { name: seg },
      update: {},
      create: { name: seg },
    });
  }
  const retailSegment = await prisma.segment.findUnique({
    where: { name: 'Varejo' },
  });

  // 3. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bureau.com' },
    update: {},
    create: {
      email: 'admin@bureau.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  });
  console.log('👤 Admin user created: admin@bureau.com / admin123');

  // 4. Create Store Owner & Establishment
  const owner = await prisma.user.upsert({
    where: { email: 'loja@bureau.com' },
    update: {},
    create: {
      email: 'loja@bureau.com',
      name: 'Dono da Loja Exemplo',
      password: hashedPassword,
      role: 'STORE_OWNER',
      active: true,
    },
  });

  if (retailSegment) {
    const store = await prisma.establishment.upsert({
      where: { slug: 'loja-exemplo' },
      update: {},
      create: {
        name: 'Loja Exemplo',
        slug: 'loja-exemplo',
        description: 'Uma loja de demonstração para o Bureau.',
        phone: '11999999999',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
        locationId: location.id,
        segmentId: retailSegment.id,
        users: {
          connect: { id: owner.id },
        },
      },
    });
    console.log('🏪 Example store created linked to owner.');
  }

  console.log('✅ Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
