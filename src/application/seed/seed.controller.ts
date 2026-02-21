import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('offers')
  async seedOffers() {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const offersData = [
      {
        establishmentId: 7,
        offers: [
          {
            title: 'Arroz Tio João 5kg',
            price: 'R$ 24,90',
            originalPrice: 'R$ 29,90',
            discountPercentage: 17,
            description: 'Arroz tipo 1, pacote 5kg.',
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
      {
        establishmentId: 8,
        offers: [
          {
            title: 'Refrigerante Coca-Cola 2L',
            price: 'R$ 8,49',
            originalPrice: 'R$ 10,99',
            discountPercentage: 23,
            description: 'Coca-Cola Original 2 litros.',
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
            description: 'Sabão em pó Omo multiação.',
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
      {
        establishmentId: 10,
        offers: [
          {
            title: 'Frango Congelado Sadia 1kg',
            price: 'R$ 11,90',
            originalPrice: 'R$ 14,90',
            discountPercentage: 20,
            description: 'Peito de frango congelado Sadia.',
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
            description: 'Papel higiênico folha dupla Neve.',
            image:
              'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&h=600&fit=crop',
          },
        ],
      },
    ];

    const results: any[] = [];

    for (const store of offersData) {
      for (const offer of store.offers) {
        const slug =
          slugify(offer.title) +
          '-' +
          Math.random().toString(36).substring(2, 6);
        const created = await this.prisma.offer.create({
          data: {
            ...offer,
            slug,
            active: true,
            highlight: false,
            establishmentId: store.establishmentId,
          },
        });
        results.push(created);
      }
    }

    return { message: 'Seed completed', count: results.length, results };
  }
}
