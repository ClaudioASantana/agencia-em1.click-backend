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
    const stores = [
      {
        name: 'Boutique Elegance',
        slug: 'boutique-elegance',
        description: 'Moda e sofisticação em cada detalhe.',
        logo: '/images/logos/logo-premium-1.png',
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200',
        segment: 'Varejo',
      },
      {
        name: 'Luxe Market',
        slug: 'luxe-market',
        description: 'Produtos premium selecionados para você.',
        logo: '/images/logos/logo-premium-2.png',
        image:
          'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200',
        segment: 'Alimentação',
      },
      {
        name: 'Tech Vision',
        slug: 'tech-vision',
        description: 'A tecnologia do futuro, hoje.',
        logo: '/images/logos/logo-premium-3.png',
        image:
          'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200',
        segment: 'Tecnologia',
      },
      {
        name: 'Lojas Avenidas',
        slug: 'lojas-avenidas',
        description:
          'Sua moda, seu caminho. Tendências e estilo para o seu dia a dia.',
        logo: 'https://images.unsplash.com/photo-1549439602-43bbcb6d583a?q=80&w=200&h=200&fit=crop',
        image:
          'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=1200',
        segment: 'Varejo',
      },
      {
        name: 'Lojas Nosso Lar',
        slug: 'lojas-nosso-lar',
        description:
          'Onde o conforto encontra o estilo. Móveis e decoração com alma.',
        logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200&h=200&fit=crop',
        image:
          'https://images.unsplash.com/photo-1616489953149-8086202422db?q=80&w=1200',
        segment: 'Varejo',
      },
    ];

    for (const storeData of stores) {
      const segment = await prisma.segment.findUnique({
        where: { name: storeData.segment },
      });
      await prisma.establishment.upsert({
        where: { slug: storeData.slug },
        update: {
          logo: storeData.logo,
          image: storeData.image,
        },
        create: {
          name: storeData.name,
          slug: storeData.slug,
          description: storeData.description,
          logo: storeData.logo,
          image: storeData.image,
          phone: '11999999999',
          address: 'Endereço Premium, 100',
          locationId: location.id,
          segmentId: segment?.id || retailSegment.id,
          users: {
            connect: { id: owner.id },
          },
        },
      });
    }
    console.log('🏪 Novas lojas premium criadas e vinculadas.');
  }

  // 5. Seed default Plans
  await prisma.plan.upsert({
    where: { name: 'Grátis' },
    update: {},
    create: {
      name: 'Grátis',
      price: 0,
      maxPublications: 1,
      maxOffersPerPub: 5,
      maxEstablishments: 1,
      allowsHighlight: false,
      allowsAnalytics: false,
    },
  });

  const starterPlan = await prisma.plan.upsert({
    where: { name: 'Starter' },
    update: {},
    create: {
      name: 'Starter',
      price: 49.9,
      maxPublications: 5,
      maxOffersPerPub: 20,
      maxEstablishments: 3,
      allowsHighlight: true,
      allowsAnalytics: true,
    },
  });

  await prisma.plan.upsert({
    where: { name: 'Pro' },
    update: {},
    create: {
      name: 'Pro',
      price: 99.9,
      maxPublications: 999,
      maxOffersPerPub: 999,
      maxEstablishments: 10,
      allowsHighlight: true,
      allowsAnalytics: true,
    },
  });
  console.log('💳 Planos criados: Grátis, Starter, Pro');

  // Assign Starter plan to admin by default
  await prisma.subscription.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, planId: starterPlan.id, status: 'ACTIVE' },
  });

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
