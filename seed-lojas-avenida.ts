import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

async function main() {
  console.log('Starting seed for Lojas Avenida (Fashion)...');

  const storeNameSearch = 'Avenida'; // Lojas Avenida

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
          title: 'Moda Primavera/Verão',
          description: 'As melhores tendências com os melhores preços!',
          status: 'ACTIVE',
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

    // 2. Check/Delete existing offers to avoid duplicates logic
    const offerTitles = [
      'Camiseta Básica Algodão',
      'Calça Jeans Skinny',
      'Vestido Floral Estampado',
      'Tênis Casual Branco',
      'Blusa de Frio Moletom',
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
        title: 'Camiseta Básica Algodão',
        description:
          'Camiseta 100% algodão, diversas cores. Conforto para o dia a dia.',
        price: 'R$ 39,90',
        originalPrice: 'R$ 59,90',
        discountPercentage: 33,
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'Calça Jeans Skinny',
        description:
          'Calça jeans modelagem skinny, lavagem escura. Veste super bem.',
        price: 'R$ 89,90',
        originalPrice: 'R$ 119,90',
        discountPercentage: 25,
        image:
          'https://images.unsplash.com/photo-1542272617-08f08630329e?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'Vestido Floral Estampado',
        description:
          'Vestido leve e soltinho, estampa floral exclusiva. Perfeito para o verão.',
        price: 'R$ 79,90',
        originalPrice: 'R$ 109,90',
        discountPercentage: 27,
        image:
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'Tênis Casual Branco',
        description: 'Tênis casual branco, solado baixo. Combina com tudo.',
        price: 'R$ 129,90',
        originalPrice: 'R$ 189,90',
        discountPercentage: 31,
        image:
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        establishmentId: store.id,
        publicationId: publication.id,
      },
      {
        title: 'Blusa de Frio Moletom',
        description:
          'Blusa de moletom com capuz e bolso canguru. Quentinha e estilosa.',
        price: 'R$ 99,90',
        originalPrice: 'R$ 149,90',
        discountPercentage: 33,
        image:
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
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

  console.log('Seed Lojas Avenida completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
