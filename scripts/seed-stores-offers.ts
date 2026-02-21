import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const offersData = [
  // Lojas Avenida - Centro (ID: 7)
  {
    establishmentId: 7,
    offers: [
      {
        title: 'Arroz Tio João 5kg',
        price: 'R$ 24,90',
        originalPrice: 'R$ 29,90',
        discountPercentage: 17,
        description:
          'Arroz tipo 1, pacote 5kg. Promoção válida enquanto durar o estoque.',
        image:
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
      },
      {
        title: 'Café Melitta 500g',
        price: 'R$ 15,90',
        originalPrice: 'R$ 19,90',
        discountPercentage: 20,
        description: 'Café torrado e moído tradicional 500g.',
        image:
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop',
      },
      {
        title: 'Açúcar Cristal União 5kg',
        price: 'R$ 18,50',
        originalPrice: 'R$ 22,00',
        discountPercentage: 16,
        description: 'Açúcar cristal, pacote 5kg.',
        image:
          'https://images.unsplash.com/photo-1550411294-098c282e4358?w=600&h=600&fit=crop',
      },
    ],
  },
  // Lojas Avenida - Capim Dourado (ID: 8)
  {
    establishmentId: 8,
    offers: [
      {
        title: 'Refrigerante Coca-Cola 2L',
        price: 'R$ 8,49',
        originalPrice: 'R$ 10,99',
        discountPercentage: 23,
        description: 'Coca-Cola Original 2 litros. Gelada e refrescante!',
        image:
          'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&h=600&fit=crop',
      },
      {
        title: 'Biscoito Oreo 90g',
        price: 'R$ 3,99',
        originalPrice: 'R$ 5,49',
        discountPercentage: 27,
        description: 'Biscoito recheado Oreo sabor original.',
        image:
          'https://images.unsplash.com/photo-1590005354167-6da97870c757?w=600&h=600&fit=crop',
      },
      {
        title: 'Macarrão Barilla 500g',
        price: 'R$ 6,90',
        originalPrice: 'R$ 8,90',
        discountPercentage: 22,
        description: 'Massa Penne Rigate importada Barilla.',
        image:
          'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=600&h=600&fit=crop',
      },
    ],
  },
  // Lojas Nosso Lar - Centro (ID: 9)
  {
    establishmentId: 9,
    offers: [
      {
        title: 'Leite Integral Italac 1L',
        price: 'R$ 5,49',
        originalPrice: 'R$ 6,99',
        discountPercentage: 21,
        description: 'Leite integral UHT, caixa 1 litro.',
        image:
          'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop',
      },
      {
        title: 'Sabão em Pó Omo 1.6kg',
        price: 'R$ 16,90',
        originalPrice: 'R$ 21,90',
        discountPercentage: 23,
        description: 'Sabão em pó Omo multiação, caixa 1.6kg.',
        image:
          'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&h=600&fit=crop',
      },
      {
        title: 'Desodorante Rexona 150ml',
        price: 'R$ 12,90',
        originalPrice: 'R$ 16,90',
        discountPercentage: 24,
        description: 'Desodorante aerossol Rexona Men.',
        image:
          'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop',
      },
    ],
  },
  // Lojas Nosso Lar - Taquaralto (ID: 10)
  {
    establishmentId: 10,
    offers: [
      {
        title: 'Frango Congelado Sadia 1kg',
        price: 'R$ 11,90',
        originalPrice: 'R$ 14,90',
        discountPercentage: 20,
        description: 'Peito de frango congelado Sadia, bandeja 1kg.',
        image:
          'https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=600&h=600&fit=crop',
      },
      {
        title: 'Margarina Qualy 500g',
        price: 'R$ 6,49',
        originalPrice: 'R$ 8,49',
        discountPercentage: 24,
        description: 'Margarina cremosa com sal Qualy.',
        image:
          'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&h=600&fit=crop',
      },
      {
        title: 'Papel Higiênico Neve 12un',
        price: 'R$ 15,90',
        originalPrice: 'R$ 19,90',
        discountPercentage: 20,
        description: 'Papel higiênico folha dupla Neve, pacote 12 rolos.',
        image:
          'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&h=600&fit=crop',
      },
    ],
  },
];

async function main() {
  console.log('🚀 Populando ofertas para lojas sem ofertas...\n');

  for (const store of offersData) {
    const establishment = await prisma.establishment.findUnique({
      where: { id: store.establishmentId },
    });

    if (!establishment) {
      console.log(
        `⚠️  Estabelecimento ID ${store.establishmentId} não encontrado. Pulando...`,
      );
      continue;
    }

    console.log(
      `📦 Criando ofertas para: ${establishment.name} (ID: ${store.establishmentId})`,
    );

    for (const offer of store.offers) {
      const slug =
        slugify(offer.title) + '-' + Math.random().toString(36).substring(2, 6);

      const created = await prisma.offer.create({
        data: {
          title: offer.title,
          slug,
          description: offer.description,
          price: offer.price,
          originalPrice: offer.originalPrice,
          discountPercentage: offer.discountPercentage,
          image: offer.image,
          active: true,
          highlight: false,
          establishmentId: store.establishmentId,
        },
      });

      console.log(`  ✅ ${created.title} (ID: ${created.id})`);
    }

    console.log('');
  }

  console.log('✨ Todas as ofertas foram criadas com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
