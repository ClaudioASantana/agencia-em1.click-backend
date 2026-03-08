import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function getBase64Sync(filePath: string): string | null {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.error(`⚠️  Arquivo não encontrado: ${fullPath}`);
      return null;
    }
    const buffer = fs.readFileSync(fullPath);
    const extension = path.extname(filePath).replace('.', '');
    const mimeType =
      extension === 'svg' ? 'image/svg+xml' : `image/${extension}`;
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (e) {
    console.error(`❌ Erro ao ler ${filePath}:`, e.message);
    return null;
  }
}

async function main() {
  const units = [
    { slug: 'unitins-agrotins', logo: 'unitins.png', banner: 'unitins.png' },
    { slug: 'ifto-agrotins', logo: 'ifto.png', banner: 'ifto.png' },
    { slug: 'grandtec-case-ih', logo: 'grandtec.png', banner: 'grandtec.png' },
    { slug: 'azb-tecnologia', logo: 'azb.png', banner: 'azb.png' },
  ];

  console.log('🔄 Convertendo imagens da Agrotins para Base64...');

  for (const unit of units) {
    console.log(`📡 Processando ${unit.slug}...`);

    const logoBase64 = getBase64Sync(`uploads/agrotins/logos/${unit.logo}`);
    const bannerBase64 = getBase64Sync(
      `uploads/agrotins/banners/${unit.banner}`,
    );

    if (logoBase64 || bannerBase64) {
      await prisma.establishment.update({
        where: { slug: unit.slug },
        data: {
          logo: logoBase64 || undefined,
          image: bannerBase64 || undefined,
        },
      });
      console.log(`✅ ${unit.slug} atualizado!`);
    } else {
      console.error(`❌ Falha ao processar imagens para ${unit.slug}`);
    }
  }

  console.log('✨ Sincronização Agrotins -> Base64 concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
