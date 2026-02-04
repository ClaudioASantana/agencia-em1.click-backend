import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLES = [
  {
    title: 'Ofertas da Semana',
    description:
      'Confira nossos destaques e preços especiais para esta semana!',
    offers: [
      {
        title: 'Produto Premium A',
        price: 'R$ 89,90',
        originalPrice: 'R$ 120,00',
      },
      { title: 'Lançamento Exclusivo', price: 'R$ 159,00' },
      {
        title: 'Promoção Relâmpago',
        price: 'R$ 45,00',
        originalPrice: 'R$ 60,00',
      },
    ],
  },
  {
    title: 'Coleção Verão 2024',
    description: 'As tendências que vão dominar a estação agora disponíveis.',
    offers: [
      { title: 'Item Tendência 01', price: 'R$ 199,90' },
      { title: 'Acessório Moderno', price: 'R$ 29,00' },
    ],
  },
];

const IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525966222134-fcfa99bafb75?w=800&auto=format&fit=crop',
];

async function main() {
  console.log('--- Iniciando Autoseed de Publicações ---');

  const establishments = await prisma.establishment.findMany({
    include: {
      publications: true,
    },
  });

  console.log(`Encontrados ${establishments.length} estabelecimentos.`);

  let createdCount = 0;

  for (const est of establishments) {
    if (est.publications.length === 0) {
      console.log(`Populando: ${est.name} (ID: ${est.id})`);

      for (const sample of SAMPLES) {
        const publication = await prisma.publication.create({
          data: {
            title: sample.title,
            description: sample.description,
            status: 'ACTIVE',
            priority: 'Alta',
            establishmentId: est.id,
            offers: {
              create: sample.offers.map((off, idx) => ({
                title: off.title,
                price: off.price,
                originalPrice: off.originalPrice,
                image: IMAGES[(createdCount + idx) % IMAGES.length],
                active: true,
                establishmentId: est.id,
              })),
            },
          },
        });
        console.log(
          `  - Criada publicação: ${publication.title} com ${sample.offers.length} ofertas.`,
        );
      }
      createdCount++;
    } else {
      console.log(
        `Pulando: ${est.name} (Já possui ${est.publications.length} publicações)`,
      );
    }
  }

  console.log(`--- Seed Finalizado! ${createdCount} lojas populadas. ---`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
