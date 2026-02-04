import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const establishmentId = 1003;

  // IDs from previous step
  const baconPubId = 4;
  const weekendPubId = 5;

  const baconOffers = [
    {
      title: 'X-Bacon Supremo',
      description: 'Duplo hambúrguer, triplo bacon crocante e queijo cheddar.',
      price: '34,90',
      originalPrice: '42,00',
      image:
        'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop',
      active: true,
      highlight: true,
    },
    {
      title: 'Batata com Cheddar e Bacon',
      description:
        'Porção generosa de batatas rústicas cobertas com cheddar e farofa de bacon.',
      price: '22,00',
      originalPrice: '28,00',
      image:
        'https://images.unsplash.com/photo-1585109649139-3668018951a3?w=600&h=600&fit=crop',
      active: true,
      highlight: false,
    },
  ];

  const weekendOffers = [
    {
      title: 'Combo Família',
      description: '4 X-Salada + 1 Refrigerante 2L + Batata Frita Grande.',
      price: '89,90',
      originalPrice: '110,00',
      image:
        'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop',
      active: true,
      highlight: true,
    },
    {
      title: 'Smash Burger (Leve 2 Pague 1)',
      description: 'Promoção válida apenas para consumo no local.',
      price: '25,00',
      originalPrice: '50,00',
      image:
        'https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=600&h=600&fit=crop',
      active: true,
      highlight: false,
    },
  ];

  // Helper to create
  const createOffers = async (offers: any[], pubId: number) => {
    for (const offer of offers) {
      const slug =
        offer.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
        '-' +
        Math.random().toString(36).substring(2, 6);
      await prisma.offer.create({
        data: {
          ...offer,
          slug,
          establishmentId,
          publicationId: pubId,
        },
      });
      console.log(`Created offer '${offer.title}' for Pub ID ${pubId}`);
    }
  };

  await createOffers(baconOffers, baconPubId);
  await createOffers(weekendOffers, weekendPubId);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
