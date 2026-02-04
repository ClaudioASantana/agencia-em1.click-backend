import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hamburgerPubId = 2; // Amorim do Hamburgerzão
  const pizzaPubId = 3; // Campanha da semana em campanha

  // 1. Move Hamburgers
  // SQL Server is usually case insensitive by default, so we remove the specific mode config
  const hamburgerUpdate = await prisma.offer.updateMany({
    where: {
      OR: [
        { title: { contains: 'burg' } },
        { description: { contains: 'burg' } },
        { title: { contains: 'hamb' } },
        { description: { contains: 'hamb' } },
      ],
      publicationId: null,
    },
    data: {
      publicationId: hamburgerPubId,
    },
  });
  console.log(
    `Updated ${hamburgerUpdate.count} hamburger offers to Pub ID ${hamburgerPubId}.`,
  );

  // 2. Move Pizzas
  const pizzaUpdate = await prisma.offer.updateMany({
    where: {
      OR: [
        { title: { contains: 'pizza' } },
        { description: { contains: 'pizza' } },
      ],
    },
    data: {
      publicationId: pizzaPubId,
    },
  });
  console.log(
    `Updated ${pizzaUpdate.count} pizza offers to Pub ID ${pizzaPubId}.`,
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
