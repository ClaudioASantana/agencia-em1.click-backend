/**
 * migrate-segments.ts
 *
 * Consolida 16 segmentos em 5 "guarda-chuvas":
 *   5  - Roteiro Gastronômico
 *   13 - Casa, Construção e Decoração
 *   14 - Saúde e Bem Estar
 *   15 - Guia Automotivo
 *   16 - Moda e Beleza
 *
 * Usage: npx ts-node scripts/migrate-segments.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Target Segment IDs ───
const GASTRONOMICO = 5;
const CASA = 13;
const SAUDE = 14;
const AUTOMOTIVO = 15;
const MODA = 16;

// ─── Junk / admin records to delete ───
const JUNK_NAMES = [
  '_VAGO',
  '_FICHA ADESÃO',
  '__FICHA ADESÃO',
  '_FICHA ADESÃO UP-V',
  'Ativação em Breve',
  'CADASTRO CONSULTORES',
  'DEMONSTRAÇÃO',
  'Tudo perto de você: em1.click',
  'PORTAL ACIAPS NATAL 2016',
];

// ─── Establishments → Roteiro Gastronômico ───
const GASTRO_NAMES = [
  'A VACA E O FRANGO',
  'ARTE NA COZINHA',
  'BAR DO ARNALDO',
  'BARRACA DA ANDREIA',
  'BARRACA DE CARNE DE PORCO DO ANTÔNIO',
  'Barraca do Rei do Mato - Edson (neto)',
  'Barraca do Thairo - Carnes Suina e de Aves',
  'Belluno Pizzaria',
  'Beluno',
  'BLITZ 50 Restaurante',
  'CASA DO LANCHE',
  'Caffè Itália',
  'Caminhão do Peixe',
  'Cantinho Nordestino',
  'Cantinho do Caldo',
  'Canto Gelado Sorvete Gourmet',
  'Carne de Porco - Barraca do Guillard',
  'Choco Art\'s & Cia',
  'Choco Artes',
  'Chocolateria Sabor e Prazer',
  'Churrasco dos Gêmeos',
  'Coisas de MG',
  'Comida da Baiana',
  'Conversa\'s Coffee & Beer',
  'Dama\'s Pizzaria',
  'DELICIAS DO CAMPO SELF SERVICE',
  'DinoBurguer',
  'DOCE MAGIA',
  'Doce Magia',
  'Don Peper Salgados',
  'DU SALGADINHOS',
  'Dudu Malvadeza - Frango Assado',
  'EDER BAR & DEPOSITO',
  'ERA DO GELO',
  'ESPAÇO GRILL',
  'FACA GAUCHA',
  'Frangão Carioca',
  'Frangão Galeteria',
  'Frango Assado da NICE',
  'Full Comida Mineira',
  'GAVIÃO DOURADO',
  'HAMBURGUERIA NORUEGUES DELIVERY',
  'Hamburgueria.com',
  'Hard Roça Choperia',
  'Health In Pot',
  'Henrique do Tempero',
  'IRMÃOS OLIVEIRA - CESTA BÁSICA',
  'JB Laticínios e Descartáveis',
  'JL Petiscos',
  'JN LATICÍNIOS E DESCARTÁVEIS',
  'Luciano dos Laticínios',
  'Mister Batata',
  'MR.FUJI SUSHIBAR',
  'O BOM FRANCÊS PANIFICADORA',
  'OFERTÃO DOS LATICÍNIOS',
  'Padaria Princesa',
  'PASTEL E CALDO DE CANA DO NETO',
  'Pastel e Caldo de Cana do Marcelo',
  'Peixaria Seropédica',
  'Pitzaria Dois Irmãos',
  'Produtos Nordestinos Glauber',
  'Produtos de Minas',
  'Quiosque do Lula',
  'Rainha do Açaí e CIA',
  'Real Doces',
  'REDE LIDER - IRMÃOS OLIVEIRA',
  'REI DO ALHO',
  'Restaurante Folha Dourada',
  'Restaurante e Petisqueria Tic-Tita',
  'Restaurante e Pizzaria Milk e Mel',
  'Rural Mais Doces',
  'Sabor Anthigo Pizzaria',
  'SeroAves',
  'SeroPeixe',
  'SORVETERIA SOL & NEVE',
  'Superbig Supermercados',
  'SURYAKI CULINÁRIA ORIENTAL',
  'Sá Salgadinhos',
  'TEMPERO DE FAMÍLIA',
  'Tempero Carioca',
  'TRÊS L RESTAURANTE',
  'UM MUNDO DE SABOR',
  'Wolf Burger',
  'DONA MARGARIDA',
  'FEIRA DA AMORA - SEROPÉDICA',
  'TEM NA FEIRA',
  'HOTEL SEROPÉDICA PALACE',
  'Banca Central',
  'Eliana Serviço de Garçons',
  'Full Gas',
];

// ─── Establishments → Moda e Beleza ───
const MODA_NAMES = [
  'Apetrecho Comércio da Moda',
  'Aviva Calçados e Acessórios',
  'BARRACA DE ROUPAS DO MARCELO',
  'BERAKA BABY',
  'Beth Biju',
  'BOLHA DE SABÃO - Lavanderia e Ajustes de Roupas',
  'Brenda Noivas & Festas',
  'Camisa Mania',
  'Cegonha Kids',
  'Chicnelos',
  'Chikinelos',
  'Chiquenelos',
  'Clara & Igor',
  'Claudia Lingerie',
  'Corte Recorte - Conserto e reforma de roupas',
  'Daiane Joias',
  'DIVA NEVES',
  'Doraliz Modas',
  'Doriliz Modas',
  'Estações',
  'Estações Moda',
  'GIGI BELLA Baby & Kids',
  'Graça Costureira',
  'HINODE PERFUMES',
  'IDEAL COSMÉTICOS',
  'INSTITUTO DA MODA',
  'Isis Modas',
  'Jujuba Kids',
  'L C Jeans',
  'L\'essence  Divine',
  'Laço de Seda',
  'LAS HERMANAS - Roupas e Acessórios',
  'Lee\'Andra Multimarcas',
  'LILIKA',
  'LOOKFASHION',
  'Mary Cabeleireiro',
  'MC MODAS',
  'MC MODAS 2',
  'MC Modas',
  'Megg Jorge Megg',
  'Menina Chique',
  'MK Fashion',
  'Moniquiti Roupas e Calçados',
  'Nalva Modas',
  'Nando Modas',
  'O GUETTO bar, barbearia e Game',
  'OBSESSÃO FEMININA',
  'Penelope Charmosa Roupas',
  'Point Rosa\'s',
  'Polishop - Josélia Sanglar',
  'PSY Tatto',
  'Barbearia Black',
  'Barbearia do André',
  'Salão Espaço Vip',
  'Salão Feminino Sheila Izidoro',
  'Salão da Celi - Cabelo & Corpo',
  'Salão da Márcia',
  'SeroPé Calçados',
  'SUENNY',
  'Tou Chic Butique',
  'Mantas do José',
  'Rota SK8',
  'Nathália Menezes Fotografias',
  'Gráfica Colorwave',
  'Gráfica Seropédica',
  'UP VISION ARTES GRÁFICAS',
  'RUBEN ART DESIGNER',
  'Cláudia S. Melo',
  'BANDA COMPLO',
  'Marcondes Produções Culturais',
  'Espaço Pititas',
  'Pula-pula',
];

// ─── Establishments → Guia Automotivo ───
const AUTO_NAMES = [
  'ALINHA CAR',
  'ALINHA CAR - AUTO CENTER',
  'AUTO ESCOLA PILOTO - Seropédica',
  'AUTO MECÂNICA SAPÃO',
  'AUTOSEG',
  'Autoescola',
  'BM Veículos',
  'Box Serviços Automotivos',
  'CFC',
  'DINIZ CAR - LANTERNAGEM E PINTURA',
  'JEAN CAR - Auto Serviços e a acessórios',
  'LM PNEUS - KM49 - 1°PASSARELA',
  'Nicolau Estética Automotiva',
  'OFICINA DO SILVIO (Fortaleza)',
  'Retifica de Motores Campo Lindo',
  'Rio - São Paulo PNEUS',
  'ROLUGA AUTO PEÇAS',
  'SEROCAR PNEUS',
  'SILVA MOFATI AUTO MECÂNICA',
  'UNIVERSOM  Tunning Car',
  'ZANONI CAR',
  'BLACK TAXI',
  'Taxi Executivo',
  'Alphario Seguros',
  'Nívea Fernandes fretes e eventos/transporte escolar',
  'MILAS BIKE',
];

// ─── Establishments → Saúde e Bem Estar ───
const SAUDE_NAMES = [
  '42FIT',
  'Academia Saradão',
  'ALERTA SAÚDE PÚBLICA',
  'ARENA FUNCIONAL',
  'ARENA FUNCIONAL PAIXAUN',
  'New Life Academia',
  'RTX ACADEMIA',
  'SPORTS ACADEMIA',
  'DENTISTAS - MAIS ODONTO',
  'DROGARIA MAIS VOCÊ (REDE FARMELHOR )',
  'Drogaria Vida Farma',
  'FarMELHOR',
  'FARMÁCIA UNIVERSITÁRIA',
  'INSTITUTO MÉDICO SEROPÉDICA',
  'LABORATÓRIO POPULAR',
  'Laboratório Ecologia',
  'SAÚDE POPULAR DE SEROPÉDICA',
  'Centro Ótico Seropédica',
  'Sorria',
  '4 Patas - Agropecuária e Pet Shop',
  'Banho & Tosa Amigo Fiel',
  'Barraca de rações',
  'Gute Hoffnung Kennel',
  'Peixes ornamentais, Aquários e acessórios',
  'Veterinária KM 32',
  'ALBIS COURSE',
  'CEEOM - Centro Educ. e Especialização Oliveira Machado',
  'Colégio Fernando Costa',
  'Curso Ensino',
  'Curso SEI',
  'UNOPAR',
  'WIZARD SEROP',
  'Kumon',
  'UFRRJ - Campus Seropédica - RJ',
  'UFRRJ - Universidade Federal Rural do RJ',
  'Seropec Shopping Rural',
];

// ─── QrSlot segment remapping (old → new) ───
const QRSLOT_REMAP: Record<number, number> = {
  1: CASA,       // Varejo → Casa
  2: GASTRONOMICO, // Alimentação → Roteiro Gastronômico
  3: CASA,       // Serviços → Casa
  7: MODA,       // Vestuário → Moda e Beleza
  8: CASA,       // Agronegócio → Casa
  10: CASA,      // Insumos → Casa
  11: CASA,      // P&D → Casa
  12: CASA,      // Serviços Tecnologia → Casa
};

// ─── Segments to delete ───
const SEGMENTS_TO_DELETE = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12];

async function main() {
  console.log('🔄 Starting segment migration (16 → 5)...\n');

  await prisma.$transaction(async (tx) => {
    // ── Step 1: Delete junk establishments ──
    console.log('🗑️  Step 1: Removing junk/admin records...');
    const junkResult = await tx.establishment.deleteMany({
      where: { name: { in: JUNK_NAMES } },
    });
    console.log(`   Deleted ${junkResult.count} junk records\n`);

    // ── Step 2: Move Varejo establishments to target segments ──
    console.log('📦 Step 2: Reclassifying Varejo establishments...');

    const gastroResult = await tx.establishment.updateMany({
      where: { segmentId: 1, name: { in: GASTRO_NAMES } },
      data: { segmentId: GASTRONOMICO },
    });
    console.log(`   → Roteiro Gastronômico: ${gastroResult.count}`);

    const modaResult = await tx.establishment.updateMany({
      where: { segmentId: 1, name: { in: MODA_NAMES } },
      data: { segmentId: MODA },
    });
    console.log(`   → Moda e Beleza: ${modaResult.count}`);

    const autoResult = await tx.establishment.updateMany({
      where: { segmentId: 1, name: { in: AUTO_NAMES } },
      data: { segmentId: AUTOMOTIVO },
    });
    console.log(`   → Guia Automotivo: ${autoResult.count}`);

    const saudeResult = await tx.establishment.updateMany({
      where: { segmentId: 1, name: { in: SAUDE_NAMES } },
      data: { segmentId: SAUDE },
    });
    console.log(`   → Saúde e Bem Estar: ${saudeResult.count}`);

    // Remaining Varejo → Casa, Construção e Decoração (catch-all)
    const casaResult = await tx.establishment.updateMany({
      where: { segmentId: 1 },
      data: { segmentId: CASA },
    });
    console.log(`   → Casa, Construção e Decoração (restantes): ${casaResult.count}\n`);

    // ── Step 3: Move other segments to targets ──
    console.log('📦 Step 3: Moving other segment establishments...');

    // Alimentação (2) → Roteiro Gastronômico
    const alimResult = await tx.establishment.updateMany({
      where: { segmentId: 2 },
      data: { segmentId: GASTRONOMICO },
    });
    console.log(`   Alimentação → Roteiro Gastronômico: ${alimResult.count}`);

    // Eletrodomésticos (6) → Casa
    const eletroResult = await tx.establishment.updateMany({
      where: { segmentId: 6 },
      data: { segmentId: CASA },
    });
    console.log(`   Eletrodomésticos → Casa: ${eletroResult.count}`);

    // Vestuário (7) → Moda e Beleza
    const vestResult = await tx.establishment.updateMany({
      where: { segmentId: 7 },
      data: { segmentId: MODA },
    });
    console.log(`   Vestuário → Moda e Beleza: ${vestResult.count}`);

    // Agronegócio (8) → Casa
    const agroResult = await tx.establishment.updateMany({
      where: { segmentId: 8 },
      data: { segmentId: CASA },
    });
    console.log(`   Agronegócio → Casa: ${agroResult.count}`);

    // Any remaining in segments 3,4,9,10,11,12 → Casa
    const remainingResult = await tx.establishment.updateMany({
      where: { segmentId: { in: [3, 4, 9, 10, 11, 12] } },
      data: { segmentId: CASA },
    });
    console.log(`   Outros (Serviços/Tech/etc) → Casa: ${remainingResult.count}\n`);

    // ── Step 4: Remap QrSlot segmentIds ──
    console.log('🔗 Step 4: Remapping QrSlot segment references...');
    for (const [oldId, newId] of Object.entries(QRSLOT_REMAP)) {
      const slotResult = await tx.qrSlot.updateMany({
        where: { segmentId: Number(oldId) },
        data: { segmentId: newId },
      });
      if (slotResult.count > 0) {
        console.log(`   QrSlot segmentId ${oldId} → ${newId}: ${slotResult.count}`);
      }
    }
    console.log('');

    // ── Step 5: Update segment slugs ──
    console.log('🏷️  Step 5: Updating segment slugs...');
    await tx.segment.update({
      where: { id: CASA },
      data: { slug: 'casa-construcao-decoracao' },
    });
    await tx.segment.update({
      where: { id: SAUDE },
      data: { slug: 'saude-e-bem-estar' },
    });
    await tx.segment.update({
      where: { id: AUTOMOTIVO },
      data: { slug: 'guia-automotivo' },
    });
    await tx.segment.update({
      where: { id: MODA },
      data: { slug: 'moda-e-beleza' },
    });
    console.log('   Slugs updated for all 5 segments\n');

    // ── Step 6: Delete old segments ──
    console.log('🗑️  Step 6: Deleting old segments...');
    const segResult = await tx.segment.deleteMany({
      where: { id: { in: SEGMENTS_TO_DELETE } },
    });
    console.log(`   Deleted ${segResult.count} old segments\n`);
  });

  // ── Final verification ──
  console.log('✅ Migration complete! Verifying...\n');

  const segments = await prisma.segment.findMany({
    include: { _count: { select: { establishments: true } } },
    orderBy: { name: 'asc' },
  });

  console.log('📊 Final segment distribution:');
  console.log('─'.repeat(55));
  for (const seg of segments) {
    console.log(
      `   ${seg.name.padEnd(35)} ${String(seg._count.establishments).padStart(5)} estab.`,
    );
  }
  console.log('─'.repeat(55));

  const total = await prisma.establishment.count();
  console.log(`   TOTAL: ${total} establishments across ${segments.length} segments\n`);
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
