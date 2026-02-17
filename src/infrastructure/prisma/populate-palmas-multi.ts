import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando população de múltiplas unidades em Palmas-TO...');

  // 1. Localização Palmas
  const location = await prisma.location.upsert({
    where: { name: 'Palmas' },
    update: {},
    create: { name: 'Palmas' },
  });

  // 2. Segmentos
  const segmentsList = [
    'Alimentação',
    'Varejo',
    'Eletrodomésticos',
    'Vestuário',
  ];
  for (const name of segmentsList) {
    await prisma.segment.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const foodSegment = await prisma.segment.findUnique({
    where: { name: 'Alimentação' },
  });
  const retailSegment = await prisma.segment.findUnique({
    where: { name: 'Varejo' },
  });
  const electroSegment = await prisma.segment.findUnique({
    where: { name: 'Eletrodomésticos' },
  });
  const clothingSegment = await prisma.segment.findUnique({
    where: { name: 'Vestuário' },
  });

  const hashedPassword = await bcrypt.hash('Palmas2026!', 10);

  // Redes e suas unidades
  const chains = [
    {
      ownerEmail: 'quartetto.palmas@agencia.com',
      ownerName: 'Gerente Quartetto',
      segmentId: foodSegment?.id,
      units: [
        {
          name: 'Quartetto - Palmas Shopping',
          slug: 'quartetto-palmas-shopping',
          address: 'Palmas Shopping, Piso Subsolo, Centro - Palmas, TO',
          phone: '(63) 3223-1100',
          logo: '/assets/demo/quartetto-logo.png',
          image: '/assets/demo/arroz-tio-jorge.png',
        },
        {
          name: 'Quartetto - 405 Norte',
          slug: 'quartetto-405-norte',
          address: '405 Norte Alameda Dois, s/n - Palmas, TO',
          phone: '(63) 3215-4520',
          logo: '/assets/demo/quartetto-logo.png',
          image: '/assets/demo/arroz-tio-jorge.png',
        },
      ],
    },
    {
      ownerEmail: 'avenida.palmas@agencia.com',
      ownerName: 'Gerente Lojas Avenida',
      segmentId: clothingSegment?.id,
      units: [
        {
          name: 'Lojas Avenida - Centro',
          slug: 'avenida-palmas-centro',
          address: 'Quadra 106 Sul Alameda 30 - Palmas, TO',
          phone: '(63) 3215-1010',
          logo: '/assets/demo/avenida-logo.png',
          image: '/assets/demo/fashion-bg.png',
        },
        {
          name: 'Lojas Avenida - Capim Dourado',
          slug: 'avenida-capim-dourado',
          address: 'Av. JK, Capim Dourado Shopping - Palmas, TO',
          phone: '(63) 3215-2020',
          logo: '/assets/demo/avenida-logo.png',
          image: '/assets/demo/fashion-bg.png',
        },
      ],
    },
    {
      ownerEmail: 'nossolar.palmas@agencia.com',
      ownerName: 'Gerente Nosso Lar',
      segmentId: electroSegment?.id,
      units: [
        {
          name: 'Lojas Nosso Lar - Centro',
          slug: 'nosso-lar-centro',
          address: 'Q. 104 Norte Rua NE1, 41 - Palmas, TO',
          phone: '(63) 3219-8600',
          logo: '/assets/demo/nosso-lar-logo.png',
          image: '/assets/demo/home-bg.png',
        },
        {
          name: 'Lojas Nosso Lar - Taquaralto',
          slug: 'nosso-lar-taquaralto',
          address: 'Av. Tocantins, s/n Lt 4 - Taquaralto, Palmas, TO',
          phone: '(63) 3572-9100',
          logo: '/assets/demo/nosso-lar-logo.png',
          image: '/assets/demo/home-bg.png',
        },
      ],
    },
  ];

  for (const chain of chains) {
    // 1. Criar/Garantir Usuário Lojista (Dono da Rede)
    const user = await prisma.user.upsert({
      where: { email: chain.ownerEmail },
      update: {},
      create: {
        email: chain.ownerEmail,
        name: chain.ownerName,
        password: hashedPassword,
        role: 'STORE_OWNER',
        active: true,
      },
    });

    for (const unit of chain.units) {
      // 2. Criar Estabelecimento (Unidade)
      const establishment = await prisma.establishment.upsert({
        where: { slug: unit.slug },
        update: {
          address: unit.address,
          phone: unit.phone,
          logo: unit.logo,
          image: unit.image,
          city: 'Palmas',
          state: 'TO',
        },
        create: {
          name: unit.name,
          slug: unit.slug,
          address: unit.address,
          phone: unit.phone,
          city: 'Palmas',
          state: 'TO',
          logo: unit.logo,
          image: unit.image,
          locationId: location.id,
          segmentId: chain.segmentId!,
          users: {
            connect: { id: user.id },
          },
        },
      });

      // 3. Criar uma publicação de boas-vindas para cada unidade
      await prisma.publication.deleteMany({
        where: { establishmentId: establishment.id },
      });
      const pub = await prisma.publication.create({
        data: {
          title: 'Inauguração Digital',
          status: 'PADRAO',
          establishmentId: establishment.id,
          priority: 'Alta',
        },
      });

      if (chain.segmentId === foodSegment?.id) {
        await prisma.offer.create({
          data: {
            title: 'Combo Inauguração',
            price: 'R$ 19,90',
            highlight: true,
            active: true,
            establishmentId: establishment.id,
            publicationId: pub.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }

      console.log(
        `✅ Unidade "${unit.name}" vinculada ao lojista ${chain.ownerEmail}`,
      );
    }
  }

  console.log('🚀 População de redes varejistas concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
