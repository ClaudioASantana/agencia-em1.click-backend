import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const establishmentId = 1003; // Amorim do Hamburgerzão

  const pubs = [
    {
      title: 'Festival do Bacon',
      description: 'Ofertas irresistíveis com muito bacon!',
      priority: 'Alta',
      active: false,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    {
      title: 'Promoção de Fim de Semana',
      description: 'Descontos especiais para sexta, sábado e domingo.',
      priority: 'Média',
      active: false,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    },
  ];

  for (const p of pubs) {
    const created = await prisma.publication.create({
      data: {
        ...p,
        establishmentId,
      },
    });
    console.log(`Created publication: [${created.id}] ${created.title}`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
