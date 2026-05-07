import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const loja = await prisma.establishment.findUnique({ where: { slug: 'avenida-capim-dourado' }});
  console.log('Loja Avenida Capim Dourado:', loja?.id, loja?.name);

  if (loja) {
    const followers = await prisma.follow.findMany({
      where: { establishmentId: loja.id },
      include: {
        user: true
      }
    });

    console.log(`Seguidores da loja (${followers.length}):`);
    followers.forEach(f => {
      console.log(`- ${f.user.name} (${f.user.email}) / Follow ID: ${f.id}`);
    });
  }

  // Check the establishment the requesting user owns (avenida.palmas@agencia.com)
  const owner = await prisma.user.findUnique({ 
    where: { email: 'avenida.palmas@agencia.com' },
    include: {
      establishments: true
    }
  });

  console.log('\nOwner (avenida.palmas@agencia.com) estabelecimentos:');
  owner?.establishments.forEach(e => console.log(`- ${e.name} (${e.slug}) ID: ${e.id}`));

}

check().catch(console.error).finally(() => prisma.$disconnect());
