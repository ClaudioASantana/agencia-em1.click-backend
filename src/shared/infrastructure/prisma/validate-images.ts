import { PrismaClient } from '@prisma/client';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient();

function checkUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    
    // Handle simple https/http check
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 302);
    });
    
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function main() {
  const encartes = await prisma.encartes.findMany({
    select: {
      id: true,
      titulo: true,
      imagem_capa_url: true
    }
  });

  console.log(`Checking ${encartes.length} encartes...`);
  
  const broken: any[] = [];

  for (const encarte of encartes) {
    if (!encarte.imagem_capa_url) {
      console.log(`[MISSING] ${encarte.titulo}`);
      broken.push(encarte);
      continue;
    }

    const isValid = await checkUrl(encarte.imagem_capa_url);
    if (!isValid) {
      console.log(`[BROKEN] ${encarte.titulo} - ${encarte.imagem_capa_url}`);
      broken.push(encarte);
    } else {
        // console.log(`[OK] ${encarte.titulo}`);
    }
  }

  console.log(`\nFound ${broken.length} broken/missing images.`);
  if (broken.length > 0) {
      console.log(JSON.stringify(broken, null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
