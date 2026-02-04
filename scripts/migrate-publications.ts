import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration of stores to publications...');

  const establishments = await prisma.establishment.findMany({
    include: { publications: true, offers: true },
  });

  for (const est of establishments) {
    console.log(`Processing store: ${est.name} (${est.id})`);

    let defaultPub = est.publications.find((p) => p.status === 'PADRAO');

    if (!defaultPub) {
      console.log(`- Creating default publication...`);
      defaultPub = await prisma.publication.create({
        data: {
          title: 'Ofertas Padrão',
          description:
            'Publicação gerada automaticamente para ofertas legadas.',
          status: 'PADRAO',
          establishmentId: est.id,
        },
      });
    }

    // Update offers that have no publication
    const offersToUpdate = est.offers.filter((o) => !o.publicationId);
    if (offersToUpdate.length > 0) {
      console.log(
        `- Linking ${offersToUpdate.length} offers to publication ${defaultPub.id}...`,
      );
      await prisma.offer.updateMany({
        where: {
          id: { in: offersToUpdate.map((o) => o.id) },
        },
        data: {
          publicationId: defaultPub.id,
        },
      });
    }
  }

  console.log('Migration complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
