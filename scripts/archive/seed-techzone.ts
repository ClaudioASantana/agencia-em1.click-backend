import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log('Starting seed for TechZone Eletrônicos...');

  const storeNameSearch = 'TechZone';

  // Find ALL stores
  const stores = await prisma.establishment.findMany({
    where: {
      name: {
        contains: storeNameSearch,
        mode: 'insensitive',
      },
    },
  });

  if (stores.length === 0) {
    console.log(`No stores found containing '${storeNameSearch}'.`);
    return;
  }

  console.log(
    `Found ${stores.length} stores: ${stores.map((s) => s.name).join(', ')}`,
  );

  for (const store of stores) {
    console.log(`Processing: ${store.name} (ID: ${store.id})`);

    // 1. Find or Create a Publication (Status: ACTIVE)
    let publication = await prisma.publication.findFirst({
      where: {
        establishmentId: store.id,
        status: { in: ['ACTIVE', 'PADRAO'] },
      },
    });

    if (!publication) {
      console.log(
        `  - No active publication found. Creating default publication...`,
      );
      publication = await prisma.publication.create({
        data: {
          title: 'Tech Week',
          description: 'Tecnologia de ponta com descontos imperdíveis!',
          status: 'ACTIVE',
          establishmentId: store.id,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
      });
      console.log(
        `  - Created Publication: ${publication.title} (ID: ${publication.id})`,
      );
    } else {
      console.log(
        `  - Found existing publication: ${publication.title} (ID: ${publication.id})`,
      );
    }

    // 2. Check/Delete existing offers to avoid duplicates logic
    const offerTitles = [
      'iPhone 15 Pro Max',
      'MacBook Air M2',
      'Fone Bluetooth Sony WH-1000XM5',
      'Smartwatch Galaxy Watch 6',
      'Teclado Mecânico Gamer RGB',
      'Mouse Gamer Logitech G Pro',
    ];

    const deleted = await prisma.offer.deleteMany({
      where: {
        establishmentId: store.id,
        title: { in: offerTitles },
      },
    });

    if (deleted.count > 0) {
      console.log(`  - Deleted ${deleted.count} previous offers to re-seed.`);
    }

    // Create offers linked to publication
    const offersData = [
      {
        title: 'iPhone 15 Pro Max',
        description:
          'Titânio, A17 Pro, Câmera de 48MP. O iPhone mais poderoso.',
        price: 'R$ 9.899,00',
        originalPrice: 'R$ 10.999,00',
        discountPercentage: 10,
        image:
          'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'MacBook Air M2',
        description:
          'Chip M2, tela Liquid Retina de 13.6 pol. Super leve e rápido.',
        price: 'R$ 7.499,00',
        originalPrice: 'R$ 8.999,00',
        discountPercentage: 16,
        image:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'Fone Bluetooth Sony WH-1000XM5',
        description:
          'O melhor cancelamento de ruído do mercado. Bateria de 30 horas.',
        price: 'R$ 2.199,00',
        originalPrice: 'R$ 2.699,00',
        discountPercentage: 18,
        image:
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'Smartwatch Galaxy Watch 6',
        description:
          'Monitoramento de saúde avançado, design premium em alumínio.',
        price: 'R$ 1.499,00',
        originalPrice: 'R$ 1.899,00',
        discountPercentage: 21,
        image:
          'https://images.unsplash.com/photo-1544117519-31a4b71922bb?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'Teclado Mecânico Gamer RGB',
        description:
          'Switch Blue, iluminação RGB customizável. Alta performance.',
        price: 'R$ 299,90',
        originalPrice: 'R$ 450,00',
        discountPercentage: 33,
        image:
          'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'Mouse Gamer Logitech G Pro',
        description:
          'Sensor HERO 25K, ultraleve, sem fio. Usado por profissionais.',
        price: 'R$ 599,00',
        originalPrice: 'R$ 799,00',
        discountPercentage: 25,
        image:
          'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
    ];

    for (const offerData of offersData) {
      const slug =
        slugify(offerData.title) +
        '-' +
        store.id +
        '-' +
        Math.floor(Math.random() * 1000);

      await prisma.offer.create({
        data: {
          ...offerData,
          slug: slug,
          active: true,
          highlight: true,
        },
      });
      console.log(`  - Created and Linked offer: ${offerData.title}`);
    }
  }

  console.log('Seed TechZone completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
