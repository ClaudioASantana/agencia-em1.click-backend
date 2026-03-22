const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  await p.plan.update({
    where: { id: 1 },
    data: {
      description: 'Presença básica na vitrine digital',
      price: 0,
      trialDays: 0,
      active: false,
      maxPublications: 1,
      maxOffersPerPub: 5,
      maxEstablishments: 1,
      allowsHighlight: false,
      allowsAnalytics: false,
    },
  });

  await p.plan.update({
    where: { id: 2 },
    data: {
      name: 'Estande',
      description: 'Presença na vitrine digital com publicações e ofertas',
      price: 55,
      trialDays: 7,
      active: true,
      maxPublications: 3,
      maxOffersPerPub: 10,
      maxEstablishments: 1,
      allowsHighlight: false,
      allowsAnalytics: false,
    },
  });

  await p.plan.update({
    where: { id: 3 },
    data: {
      name: 'Vitrine',
      description: 'Visibilidade completa com destaque, analytics e múltiplas lojas',
      price: 235,
      trialDays: 7,
      active: true,
      maxPublications: 20,
      maxOffersPerPub: 30,
      maxEstablishments: 5,
      allowsHighlight: true,
      allowsAnalytics: true,
    },
  });

  const plans = await p.plan.findMany({ orderBy: { price: 'asc' } });
  console.log('Plans updated successfully!');
  plans.forEach(pl => {
    console.log(`  [${pl.id}] ${pl.name} - R$${pl.price}/mes - trial:${pl.trialDays}d - active:${pl.active}`);
  });

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
