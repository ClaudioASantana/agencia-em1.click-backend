import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const offersData = [
  {
    title: 'Arroz Tio Jorge 5kg',
    price: '29,90',
    originalPrice: '34,90',
    discountPercentage: 14,
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop',
    highlight: true,
  },
  {
    title: 'Feijão Carioca Kicaldo 1kg',
    price: '7,49',
    originalPrice: '8,99',
    discountPercentage: 16,
    image:
      'https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=400&auto=format&fit=crop',
    highlight: true,
  },
  {
    title: 'Óleo de Soja Liza 900ml',
    price: '5,99',
    originalPrice: '6,49',
    discountPercentage: 7,
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&auto=format&fit=crop',
    highlight: false,
  },
  {
    title: 'Leite Integral Integral 1L',
    price: '4,89',
    originalPrice: '5,49',
    discountPercentage: 10,
    image:
      'https://images.unsplash.com/photo-1563636619-e910f0111be1?q=80&w=400&auto=format&fit=crop',
    highlight: true,
  },
  {
    title: 'Café Melitta 500g',
    price: '18,90',
    originalPrice: '21,90',
    discountPercentage: 13,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop',
    highlight: false,
  },
  {
    title: 'Contra Filé KG',
    price: '39,90',
    originalPrice: '45,90',
    discountPercentage: 13,
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
    highlight: true,
  },
];

async function main() {
  const quartettoStores = await prisma.establishment.findMany({
    where: { name: { contains: 'Quartetto' } },
  });

  console.log(
    `🚀 Iniciando geração de ofertas para ${quartettoStores.length} lojas do Quartetto...`,
  );

  for (const store of quartettoStores) {
    console.log(`🏪 Processando: ${store.name}`);

    // Create a default publication
    const publication = await prisma.publication.create({
      data: {
        title: 'Ofertas da Semana',
        description:
          'Confira nossas principais ofertas válidas para toda a rede.',
        status: 'PADRAO',
        priority: 'Alta',
        establishmentId: store.id,
      },
    });

    console.log(`   ✅ Publicação PADRAO criada: ID ${publication.id}`);

    // Create offers for this publication
    for (const offerData of offersData) {
      await prisma.offer.create({
        data: {
          ...offerData,
          establishmentId: store.id,
          publicationId: publication.id,
          slug:
            offerData.title
              .toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w-]+/g, '') +
            '-' +
            store.id,
        },
      });
    }

    console.log(`   ✅ ${offersData.length} ofertas vinculadas.`);
  }

  console.log('✨ Geração concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
