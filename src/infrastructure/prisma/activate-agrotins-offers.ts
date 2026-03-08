import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Ativando Ofertas e Publicações da Agrotins 2026...');

  const establishments = await prisma.establishment.findMany({
    where: {
      users: {
        some: { email: 'contato@agrotins.to.gov.br' },
      },
    },
    include: { offers: true },
  });

  for (const est of establishments) {
    console.log(`📦 Processando estande: ${est.name}...`);

    // 1. Criar uma Publicação Mestre para o estande
    const publication = await prisma.publication.create({
      data: {
        title: `Novidades Agrotins 2026 - ${est.name}`,
        description: `Confira as tecnologias e inovações que a ${est.name} trouxe para a AgroEvolução.`,
        status: 'PADRAO',
        priority: 'Alta',
        establishmentId: est.id,
      },
    });

    // 2. Vincular todas as ofertas a esta publicação e ativar destaques
    for (let i = 0; i < est.offers.length; i++) {
      const offer = est.offers[i];

      // Imagens genéricas premium baseadas no título para o "WOW" factor
      let imageUrl =
        'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop'; // Default agro

      if (offer.title.toLowerCase().includes('drone')) {
        imageUrl =
          'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop';
      } else if (
        offer.title.toLowerCase().includes('balança') ||
        offer.title.toLowerCase().includes('pecuária')
      ) {
        imageUrl =
          'https://images.unsplash.com/photo-1548677506-69a4ea50085a?q=80&w=800&auto=format&fit=crop';
      } else if (
        offer.title.toLowerCase().includes('colheitadeira') ||
        offer.title.toLowerCase().includes('trator')
      ) {
        imageUrl =
          'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop';
      } else if (
        offer.title.toLowerCase().includes('horta') ||
        offer.title.toLowerCase().includes('irrigação')
      ) {
        imageUrl =
          'https://images.unsplash.com/photo-1592150621344-78439b834823?q=80&w=800&auto=format&fit=crop';
      }

      await prisma.offer.update({
        where: { id: offer.id },
        data: {
          publicationId: publication.id,
          active: true,
          highlight: true, // Todos como destaque para garantir visibilidade na Home
          image: imageUrl,
        },
      });
      console.log(`   ✅ Oferta ativada: ${offer.title}`);
    }
  }

  console.log('✨ Todas as ofertas e publicações da Agrotins estão ONLINE!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
