import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

async function main() {
  console.log('Starting seed for ALL Lojas Nosso Lar (Correcting Offers)...');

  const storeNameSearch = 'Nosso Lar';

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

    // 1. Find or Create a Publication (Status: ACTIVE or PADRAO)
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
          title: 'Ofertas da Semana',
          description:
            'Confira nossas melhores ofertas selecionadas para você!',
          status: 'ACTIVE', // or PADRAO, but service checks for ACTIVE/PADRAO. Let's use ACTIVE.
          establishmentId: store.id,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Valid for 30 days
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

    // 2. Check for existing offers (linked or unlinked)
    // Since previous run created them unlinked, we might want to update them or delete and recreate.
    // To be safe and clean, let's delete existing offers for this store that match our titles, or just delete all and re-seed?
    // Deleting all offers for the store is drastic if they had real data.
    // Let's check if we created them previously (by title).

    const offerTitles = [
      'Smart TV 55" 4K UHD',
      'Sofá Retrátil e Reclinável 3 Lugares',
      'Geladeira Frost Free Inox',
      'Máquina de Lavar 12kg',
    ];

    // Delete previous unlinked offers (or force update)
    const deleted = await prisma.offer.deleteMany({
      where: {
        establishmentId: store.id,
        title: { in: offerTitles },
      },
    });

    if (deleted.count > 0) {
      console.log(
        `  - Deleted ${deleted.count} previous/old offers to re-seed correctly.`,
      );
    }

    // Create offers linked to publication
    const offersData = [
      {
        title: 'Smart TV 55" 4K UHD',
        description:
          'Smart TV 55 polegadas 4K com HDR, Bluetooth e comando de voz. Experiência de cinema em casa.',
        price: 'R$ 2.499,00',
        originalPrice: 'R$ 3.199,00',
        discountPercentage: 22,
        image:
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id, // LINKED!
      },
      {
        title: 'Sofá Retrátil e Reclinável 3 Lugares',
        description:
          'Sofá retrátil e reclinável, tecido suede aveludado, cor cinza. Conforto e elegância para sua sala.',
        price: 'R$ 1.899,90',
        originalPrice: 'R$ 2.599,00',
        discountPercentage: 27,
        image:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id, // LINKED!
      },
      {
        title: 'Geladeira Frost Free Inox',
        description:
          'Geladeira Frost Free 375L Inox com painel touch e turbo freezer. Mais espaço e tecnologia.',
        price: 'R$ 3.200,00',
        originalPrice: 'R$ 3.800,00',
        discountPercentage: 15,
        image:
          'https://images.unsplash.com/photo-1571175443880-49e1d58b7275?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id, // LINKED!
      },
      {
        title: 'Máquina de Lavar 12kg',
        description:
          'Lavadora de roupas 12kg com ciclo rápido, economia de água e cesto inox.',
        price: 'R$ 1.599,00',
        originalPrice: 'R$ 1.999,00',
        discountPercentage: 20,
        image:
          'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id, // LINKED!
      },
    ];

    for (const offerData of offersData) {
      // Unique slug: title + random suffix or store id
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

  console.log('Seed completed successfully with Linked Publications!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
