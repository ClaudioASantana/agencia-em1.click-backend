import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates: Record<string, string> = {
  'Oficina do Zé': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
  'Supermercado Preço Baixo': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  'Crossfit Titan': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  'Oficina Rápida': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
  'Clínica Veterinária PetCare': 'https://images.unsplash.com/photo-1553688738-a278b9f063e0?auto=format&fit=crop&w=800&q=80'
};

async function main() {
  for (const [title, url] of Object.entries(updates)) {
    const result = await prisma.encartes.updateMany({
      where: { titulo: title },
      data: { imagem_capa_url: url }
    });
    console.log(`Updated ${title}: ${result.count}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
