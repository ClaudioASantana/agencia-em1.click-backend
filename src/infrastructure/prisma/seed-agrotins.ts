import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Agrotins 2026 seed...');

  // 1. Get/Create Location (Palmas)
  const location = await prisma.location.upsert({
    where: { name: 'Palmas' },
    update: {},
    create: { name: 'Palmas', slug: 'palmas' },
  });

  // 2. Create Agronegócio Segment
  const agroSegment = await prisma.segment.upsert({
    where: { name: 'Agronegócio' },
    update: {},
    create: { name: 'Agronegócio', slug: 'agronegocio' },
  });

  const techSegment = await prisma.segment.findUnique({
    where: { name: 'Tecnologia' },
  });

  // 3. Create Agrotins User (Lojista Master)
  const hashedPassword = await bcrypt.hash('agrotins2026', 10);
  const agrotinsUser = await prisma.user.upsert({
    where: { email: 'contato@agrotins.to.gov.br' },
    update: {},
    create: {
      email: 'contato@agrotins.to.gov.br',
      name: 'Agrotins 2026',
      password: hashedPassword,
      role: 'STORE_OWNER',
      active: true,
    },
  });

  // 4. Assign Pro Plan to Agrotins User
  await prisma.subscription.upsert({
    where: { userId: agrotinsUser.id },
    update: { planId: 3 }, // Pro Plan
    create: { userId: agrotinsUser.id, planId: 3, status: 'ACTIVE' },
  });

  console.log('👥 Agrotins User created and subscribed to PRO plan.');

  // 5. Expositores (Establishments)
  const expositores = [
    {
      name: 'Unitins',
      slug: 'unitins-agrotins',
      description:
        'Universidade Estadual do Tocantins - Pesquisa e Inovação no Campo.',
      estandeSustentavel: true,
      segmentId: agroSegment.id,
      logo: '/uploads/agrotins/logos/unitins.png',
      image: '/uploads/agrotins/banners/unitins.png',
      offers: [
        {
          title: 'Balança Inteligente para Pecuaristas',
          description:
            'Sistema que pesa o animal automaticamente ao beber água e envia dados para o banco de dados.',
          price: 'Sob Consulta',
        },
        {
          title: 'Vitrine Agrotecnológica',
          description:
            'Demonstração de culturas e tecnologias de manejo sustentável.',
          price: 'Grátis',
        },
      ],
    },
    {
      name: 'IFTO',
      slug: 'ifto-agrotins',
      description:
        'Instituto Federal do Tocantins - Educação e Tecnologia para o Agronegócio.',
      estandeSustentavel: true,
      segmentId: agroSegment.id,
      logo: '/uploads/agrotins/logos/ifto.png',
      image: '/uploads/agrotins/banners/ifto.png',
      offers: [
        {
          title: 'Horta Inteligente',
          description:
            'Sistema de irrigação autônomo com leitura automatizada do solo e controle por aplicativo móvel.',
          price: 'Sob Consulta',
        },
        {
          title: 'Laboratório Maker e Espaço de Inovação',
          description:
            'Espaço para criação e prototipagem de soluções tecnológicas agrícolas.',
          price: 'Visitação Livre',
        },
      ],
    },
    {
      name: 'Grandtec (Case IH)',
      slug: 'grandtec-case-ih',
      description:
        'Concessionária Case IH - Potência e Tecnologia para sua colheita.',
      estandeSustentavel: false,
      segmentId: agroSegment.id,
      logo: '/uploads/agrotins/logos/grandtec.png',
      image: '/uploads/agrotins/banners/grandtec.png',
      offers: [
        {
          title: 'Nova geração de Colheitadeiras',
          description:
            'Máquinas de alto desempenho com automação total e telemetria avançada.',
          price: 'A partir de R$ 1.200.000',
        },
        {
          title: 'Tratores e Pulverizadores',
          description:
            'Equipamentos de alta performance para máxima produtividade no campo.',
          price: 'Sob Consulta',
        },
      ],
    },
    {
      name: 'AZB Tecnologia Agrícola',
      slug: 'azb-tecnologia',
      description: 'Soluções avançadas em pulverização e drones agrícolas.',
      estandeSustentavel: false,
      segmentId: agroSegment.id,
      logo: '/uploads/agrotins/logos/azb.png',
      image: '/uploads/agrotins/banners/azb.png',
      offers: [
        {
          title: 'Drones de pulverização de última geração',
          description:
            'Precisão absoluta na aplicação de defensivos com drones autônomos.',
          price: 'Sob Consulta',
        },
        {
          title: 'Tecnologia de grãos de pulverização',
          description:
            'Economia de defensivos e maior cobertura foliar com bicos inteligentes.',
          price: 'Sob Consulta',
        },
      ],
    },
  ];

  for (const exp of expositores) {
    // Clear existing offers to avoid duplicates on re-seed
    await prisma.offer.deleteMany({
      where: { establishment: { slug: exp.slug } },
    });

    const establishment = await prisma.establishment.upsert({
      where: { slug: exp.slug },
      update: {
        name: exp.name,
        description: exp.description,
        segmentId: exp.segmentId,
        estandeSustentavel: exp.estandeSustentavel,
        logo: exp.logo,
        image: exp.image,
      },
      create: {
        name: exp.name,
        slug: exp.slug,
        description: exp.description,
        address: 'Parque Agrotecnológico Mauro Medanha',
        city: 'Palmas',
        state: 'TO',
        locationId: location.id,
        segmentId: exp.segmentId,
        estandeSustentavel: exp.estandeSustentavel,
        logo: exp.logo,
        image: exp.image,
        users: {
          connect: { id: agrotinsUser.id },
        },
      },
    });

    for (const off of exp.offers) {
      await prisma.offer.create({
        data: {
          title: off.title,
          description: off.description,
          price: off.price,
          establishmentId: establishment.id,
        },
      });
    }
  }

  console.log('✅ Agrotins 2026 data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
