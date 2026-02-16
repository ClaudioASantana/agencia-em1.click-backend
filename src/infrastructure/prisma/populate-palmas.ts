import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando população de dados de Palmas-TO com imagens...');

  // 1. Criar Localização Palmas
  const location = await prisma.location.upsert({
    where: { name: 'Palmas' },
    update: {},
    create: { name: 'Palmas' },
  });

  // 2. Garantir Segmentos
  const segments = ['Alimentação', 'Varejo', 'Serviços'];
  for (const seg of segments) {
    await prisma.segment.upsert({
      where: { name: seg },
      update: {},
      create: { name: seg },
    });
  }

  const foodSegment = await prisma.segment.findUnique({
    where: { name: 'Alimentação' },
  });
  const retailSegment = await prisma.segment.findUnique({
    where: { name: 'Varejo' },
  });

  const hashedPassword = await bcrypt.hash('Palmas2026!', 10);

  // Dados das Lojas
  const stores = [
    {
      name: 'Quartetto Supermercados',
      slug: 'quartetto-palmas',
      email: 'quartetto.palmas@agencia.com',
      logo: '/assets/demo/quartetto-logo.png',
      image: '/assets/demo/arroz-tio-jorge.png', // Fallback image for store background
      address: '101 Sul, Rua NS A, Conj. 2, Lote 10 - Palmas, TO',
      phone: '(63) 3223-1100',
      segmentId: foodSegment?.id,
      offers: [
        {
          title: 'Arroz Tio Jorge (5kg)',
          price: '28,90',
          originalPrice: '34,90',
          highlight: true,
          image: '/assets/demo/arroz-tio-jorge.png',
        },
        {
          title: 'Feijão Carioca Combrasil (1kg)',
          price: '7,49',
          originalPrice: '9,90',
          highlight: true,
        },
        {
          title: 'Óleo de Soja Soya (900ml)',
          price: '6,49',
          originalPrice: '7,50',
          highlight: true,
        },
      ],
    },
    {
      name: 'América Supermercados',
      slug: 'america-palmas',
      email: 'america.palmas@agencia.com',
      logo: '/assets/demo/quartetto-logo.png', // Using Quartetto logo as placeholder for America if missing
      image: '/assets/demo/contra-file.png', // Meat image for background
      address: '108 Sul Alameda Cinco, s/n lote 2 - Palmas, TO',
      phone: '(63) 3215-5364',
      segmentId: foodSegment?.id,
      offers: [
        {
          title: 'Contra Filé Bovino (kg)',
          price: '42,90',
          originalPrice: '49,90',
          highlight: true,
          image: '/assets/demo/contra-file.png',
        },
        {
          title: 'Picanha Maturata (kg)',
          price: '79,90',
          originalPrice: '98,00',
          highlight: true,
          image: '/assets/demo/contra-file.png',
        },
        {
          title: 'Cerveja Skol (Lata 350ml)',
          price: '3,49',
          originalPrice: '4,20',
          highlight: true,
        },
        {
          title: 'Carvão Vegetal 5kg',
          price: '18,90',
          originalPrice: '22,00',
          highlight: true,
        },
      ],
    },
    {
      name: 'Superbig Supermercados',
      slug: 'superbig-palmas',
      email: 'superbig.palmas@agencia.com',
      logo: '/assets/demo/quartetto-logo.png', // Temporary
      image: '/assets/demo/arroz-tio-jorge.png', // Temporary
      address: 'Quadra 405 Norte Al. 06 Lt. 08 - Palmas, TO',
      phone: '(63) 3312-4520',
      segmentId: retailSegment?.id,
      offers: [
        {
          title: 'Detergente Ypê (500ml)',
          price: '2,29',
          originalPrice: '2,89',
          highlight: true,
        },
        {
          title: 'Sabão em Pó Omo 1.6kg',
          price: '24,90',
          originalPrice: '29,90',
          highlight: true,
        },
        {
          title: 'Leite Condensado Moça (395g)',
          price: '7,99',
          originalPrice: '10,50',
          highlight: true,
        },
        {
          title: 'Papel Higiênico Neve (12 rolos)',
          price: '19,90',
          originalPrice: '24,50',
          highlight: true,
        },
      ],
    },
  ];

  for (const storeData of stores) {
    // Criar Usuário Lojista
    const user = await prisma.user.upsert({
      where: { email: storeData.email },
      update: {},
      create: {
        email: storeData.email,
        name: `Gerente ${storeData.name}`,
        password: hashedPassword,
        role: 'STORE_OWNER',
        active: true,
      },
    });

    // Criar Estabelecimento
    const establishment = await prisma.establishment.upsert({
      where: { slug: storeData.slug },
      update: {
        logo: storeData.logo || null,
        image: storeData.image || null,
        address: storeData.address,
        phone: storeData.phone,
        city: 'Palmas',
        state: 'TO',
      },
      create: {
        name: storeData.name,
        slug: storeData.slug,
        address: storeData.address,
        phone: storeData.phone,
        city: 'Palmas',
        state: 'TO',
        logo: storeData.logo || null,
        image: storeData.image || null,
        locationId: location.id,
        segmentId: storeData.segmentId!,
        users: {
          connect: { id: user.id },
        },
      },
    });

    // Limpar publicações e ofertas anteriores
    await prisma.offer.deleteMany({
      where: { establishmentId: establishment.id },
    });
    await prisma.publication.deleteMany({
      where: { establishmentId: establishment.id },
    });

    // Criar Publicação Padrão
    const publication = await prisma.publication.create({
      data: {
        title: 'Ofertas Diversas',
        status: 'PADRAO',
        establishmentId: establishment.id,
        priority: 'Alta',
      },
    });

    // Criar Ofertas
    for (const offer of storeData.offers) {
      await prisma.offer.create({
        data: {
          title: offer.title,
          price: `R$ ${offer.price}`,
          originalPrice: `R$ ${offer.originalPrice}`,
          image: (offer as any).image || null,
          highlight: offer.highlight || false,
          active: true,
          establishmentId: establishment.id,
          publicationId: publication.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    console.log(
      `✅ Loja "${storeData.name}" e ofertas atualizadas com sucesso!`,
    );
  }

  console.log('🚀 População de Palmas (com imagens) concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
