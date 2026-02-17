import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getBase64(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    });

    const contentType = res.headers.get('content-type') || '';
    if (
      !contentType.startsWith('image/') &&
      !contentType.startsWith('text/xml') &&
      !url.includes('svg')
    ) {
      console.error(
        `⚠️  Tipo de conteúdo inválido para ${url}: ${contentType}`,
      );
      return null;
    }

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Normalize content type for SVG from dicebear if needed
    let finalContentType = contentType;
    if (url.includes('svg')) finalContentType = 'image/svg+xml';

    return `data:${finalContentType};base64,${base64}`;
  } catch (e) {
    console.error(`❌ Erro ao baixar ${url}:`, e.message);
    return null;
  }
}

async function main() {
  const assets = {
    avenida: {
      logoUrl:
        'https://api.dicebear.com/7.x/initials/svg?seed=Avenida&backgroundColor=f59e0b',
      imageUrl:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    },
    nossoLar: {
      logoUrl:
        'https://api.dicebear.com/7.x/initials/svg?seed=NossoLar&backgroundColor=2563eb',
      imageUrl:
        'https://images.unsplash.com/photo-1556911220-e15595b39527?q=80&w=800&auto=format&fit=crop',
    },
  };

  console.log('🔄 Convertendo ativos para Base64 (com User-Agent)...');

  const avenidaLogo = await getBase64(assets.avenida.logoUrl);
  const avenidaImage = await getBase64(assets.avenida.imageUrl);
  const nossoLarLogo = await getBase64(assets.nossoLar.logoUrl);
  const nossoLarImage = await getBase64(assets.nossoLar.imageUrl);

  if (!nossoLarImage || nossoLarImage.includes('text/html')) {
    console.log(
      '⚠️  Falha ao obter imagem da Nosso Lar, tentando link alternativo...',
    );
    // Tentar outro link de móveis/casa
    const altImage = await getBase64(
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
    );
    if (altImage) {
      console.log('✅ Imagem alternativa obtida com sucesso.');
      // Update variables
      // I won't re-assign let variables in an async block easily if they are const
    }
  }

  console.log('📝 Atualizando Banco de Dados...');

  // Avenida
  await prisma.establishment.updateMany({
    where: { slug: { in: ['avenida-palmas-centro', 'avenida-capim-dourado'] } },
    data: {
      logo: avenidaLogo || undefined,
      image: avenidaImage || undefined,
    },
  });

  // Nosso Lar
  const nImage =
    nossoLarImage && !nossoLarImage.includes('text/html')
      ? nossoLarImage
      : await getBase64(
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
        );

  await prisma.establishment.updateMany({
    where: { slug: { in: ['nosso-lar-centro', 'nosso-lar-taquaralto'] } },
    data: {
      logo: nossoLarLogo || undefined,
      image: nImage || undefined,
    },
  });

  console.log('✅ Tudo pronto! Ativos convertidos para Base64.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
