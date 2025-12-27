import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map of keywords to relevant icon/logo URLs (Unsplash source for demo)
const logoMap: Record<string, string> = {
  'Pizzaria': 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=150&q=80',
  'Crossfit': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80',
  'Barbearia': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=150&q=80',
  'Café': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80',
  'Veterinária': 'https://images.unsplash.com/photo-1628009368231-137d6e4a3026?auto=format&fit=crop&w=150&q=80',
  'Móveis': 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=150&q=80',
  'Música': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=150&q=80',
  'Hamburgueria': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80',
  'Spa': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&q=80',
  'Auto Escola': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=150&q=80',
  'Floricultura': 'https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&w=150&q=80',
  'Oficina': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=150&q=80',
  'Salão': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=150&q=80'
};

const defaultLogos: Record<string, string> = {
  'Gastronomia': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=150&q=80',
  'Saúde e Bem Estar': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=150&q=80',
  'Educação': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=150&q=80',
  'Automotivo': 'https://images.unsplash.com/photo-1486262715619-01b80250e0dc?auto=format&fit=crop&w=150&q=80'
};

async function main() {
  const establishments = await prisma.estabelecimentos.findMany({
    where: { logo_url: null },
    include: { segmentos: true }
  });

  console.log(`Found ${establishments.length} establishments without logo.`);

  for (const est of establishments) {
    let logoUrl = '';
    
    // 1. Try matching name keywords
    for (const [key, url] of Object.entries(logoMap)) {
      if (est.nome.includes(key)) {
        logoUrl = url;
        break;
      }
    }

    // 2. Fallback to segment default
    if (!logoUrl && est.segmentos?.nome && defaultLogos[est.segmentos.nome]) {
      logoUrl = defaultLogos[est.segmentos.nome];
    }

    if (logoUrl) {
      await prisma.estabelecimentos.update({
        where: { id: est.id },
        data: { logo_url: logoUrl }
      });
      console.log(`Updated logo for: ${est.nome}`);
    } else {
      console.log(`No match found for: ${est.nome} (${est.segmentos?.nome})`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
