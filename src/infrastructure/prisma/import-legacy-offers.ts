import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();
const LEGACY_IMG_BASE = 'https://em1.click/imgs/';

interface LegacyOffer {
  ProdutoId: number;
  Descricao: string;
  DescricaoImagem: string | null;
  Valor: string;
  LegacyUsuarioId: number;
  LegacyLoja: string;
  PromoTitulo: string;
  DataInicio: string | null;
  DataFim: string | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🔧 Importing active legacy offers...\n');

  // 1. Extract data from SQL Server via docker exec
  const sqlQuery = `
    SELECT
      p.Id as ProdutoId,
      TRIM(p.Descricao) as Descricao,
      p.DescricaoImagem,
      CAST(p.Valor as VARCHAR(20)) as Valor,
      p.UsuarioId as LegacyUsuarioId,
      TRIM(u.Descricao) as LegacyLoja,
      TRIM(pr.Titulo) as PromoTitulo,
      CONVERT(VARCHAR(23), pr.DataInicio, 126) as DataInicio,
      CONVERT(VARCHAR(23), pr.DataFim, 126) as DataFim
    FROM Promocao pr
    JOIN PromocaoProduto pp ON pr.Id = pp.PromocaoId
    JOIN Produto p ON pp.ProdutoId = p.Id
    JOIN Usuario u ON p.UsuarioId = u.Id
    WHERE pr.Ativo = 1
      AND p.DescricaoImagem IS NOT NULL
      AND p.DescricaoImagem != ''
      AND p.DescricaoImagem != 'NOVO_PRODUTO.jpg'
    ORDER BY u.Descricao, p.Id
  `.replace(/\n/g, ' ');

  console.log('📥 Fetching from SQL Server...');
  const rawOutput = execSync(
    `docker exec mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStr0ng!Passw0rd" -d produtoDB -C -Q "${sqlQuery}" -W -s"|" -h-1`,
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 },
  );

  const lines = rawOutput
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('---') && !l.includes('rows affected'));

  const legacyOffers: LegacyOffer[] = [];
  for (const line of lines) {
    const parts = line.split('|');
    if (parts.length < 9 || isNaN(Number(parts[0]))) continue;
    legacyOffers.push({
      ProdutoId: parseInt(parts[0]),
      Descricao: parts[1],
      DescricaoImagem: parts[2] || null,
      Valor: parts[3],
      LegacyUsuarioId: parseInt(parts[4]),
      LegacyLoja: parts[5],
      PromoTitulo: parts[6],
      DataInicio: parts[7] !== 'NULL' ? parts[7] : null,
      DataFim: parts[8] !== 'NULL' ? parts[8] : null,
    });
  }

  console.log(`📊 Found ${legacyOffers.length} products from active promotions\n`);

  // 2. Load all establishments from PostgreSQL
  const establishments = await prisma.establishment.findMany({
    select: { id: true, name: true, slug: true },
  });

  // Build mapping: legacy user ID (from slug suffix) → establishment ID
  const slugSuffixMap = new Map<number, number>();
  const nameMap = new Map<string, number>();

  for (const est of establishments) {
    // Extract legacy ID from slug suffix: "churrasco-dos-gemeos-447" → 447
    const match = est.slug.match(/-(\d+)$/);
    if (match) {
      slugSuffixMap.set(parseInt(match[1]), est.id);
    }
    // Also build a name map for fallback
    nameMap.set(est.name.trim().toUpperCase(), est.id);
  }

  // 3. Import offers
  let imported = 0;
  let skipped = 0;
  let notFound = 0;
  const notFoundLojas: string[] = [];

  for (const offer of legacyOffers) {
    // Try slug suffix match first, then name match
    let establishmentId =
      slugSuffixMap.get(offer.LegacyUsuarioId) ??
      nameMap.get(offer.LegacyLoja.toUpperCase());

    if (!establishmentId) {
      if (!notFoundLojas.includes(offer.LegacyLoja)) {
        notFoundLojas.push(offer.LegacyLoja);
        console.log(
          `  ⚠️  Loja não encontrada: "${offer.LegacyLoja}" (legacy ID: ${offer.LegacyUsuarioId})`,
        );
      }
      notFound++;
      continue;
    }

    // Check if offer already exists (by title + establishment)
    const existing = await prisma.offer.findFirst({
      where: {
        title: offer.Descricao,
        establishmentId,
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    // Build image URL
    let imageUrl: string | null = null;
    if (offer.DescricaoImagem) {
      imageUrl = `${LEGACY_IMG_BASE}${offer.DescricaoImagem}`;
    }

    // Parse price
    const price = parseFloat(offer.Valor);
    const priceStr = price > 0 ? `R$ ${price.toFixed(2)}` : null;

    const offerSlug = `${slugify(offer.Descricao)}-${offer.ProdutoId}`;

    await prisma.offer.create({
      data: {
        title: offer.Descricao,
        slug: offerSlug,
        description: `Promoção: ${offer.PromoTitulo}`,
        price: priceStr,
        image: imageUrl,
        active: true,
        highlight: false,
        startDate: offer.DataInicio ? new Date(offer.DataInicio) : null,
        endDate: offer.DataFim ? new Date(offer.DataFim) : null,
        establishmentId,
      },
    });
    imported++;
  }

  console.log(`\n✅ Resultado:`);
  console.log(`   Importados: ${imported}`);
  console.log(`   Já existiam (pulados): ${skipped}`);
  console.log(`   Loja não encontrada: ${notFound}`);
  if (notFoundLojas.length > 0) {
    console.log(
      `   Lojas sem match: ${notFoundLojas.join(', ')}`,
    );
  }

  // 4. Show summary
  const totalOffers = await prisma.offer.count();
  console.log(`\n📊 Total de ofertas no banco: ${totalOffers}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
