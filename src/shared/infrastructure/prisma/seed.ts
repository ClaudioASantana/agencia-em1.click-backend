import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const agencies = [
  {
    id: 1,
    name: 'Restaurante Casa de Minas',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1568376794508-fa522735fce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Seropédica',
    segment: 'Gastronomia',
    description:
      'Restaurante especializado na culinária mineira tradicional, com pratos caseiros e ambiente acolhedor.',
    rating: 4.5,
    ratingCount: 127,
    address: 'Rua Principal, 123 - Centro, Seropédica - RJ',
    hours: 'Segunda a Sábado: 11h às 22h | Domingo: 11h às 20h',
    phone: '(21) 2345-6789',
    whatsapp: '(21) 99999-0001',
    specialties: [
      'Comida Mineira',
      'Feijão Tropeiro',
      'Leitão à Pururuca',
      'Doces Caseiros',
    ],
    social: {
      facebook: '#',
      instagram: '#',
      website: '#',
    },
  },
  {
    id: 2,
    name: 'Oficina do Zé',
    image:
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Paracambi',
    segment: 'Automotivo',
    description:
      'Oficina especializada em mecânica geral e elétrica automotiva.',
    rating: 4.8,
    ratingCount: 84,
    address: 'Av. dos Motoristas, 45 - Centro, Paracambi - RJ',
    hours: 'Segunda a Sexta: 08h às 18h',
    phone: '(21) 3456-7890',
    whatsapp: '(21) 98888-0002',
    specialties: ['Mecânica Geral', 'Elétrica', 'Suspensão'],
    social: {
      facebook: '#',
      instagram: '#',
    },
  },
  {
    id: 3,
    name: 'Farmácia Saúde Total',
    image:
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Mendes',
    segment: 'Saúde e Bem Estar',
    rating: 4.9,
    ratingCount: 215,
    description: 'Sua saúde em primeiro lugar com medicamentos e perfumaria.',
    address: 'Praça Central, 10 - Mendes - RJ',
    specialties: ['Medicamentos', 'Perfumaria', 'Manipulação'],
  },
  {
    id: 4,
    name: 'Moda Fashion',
    image:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Seropédica',
    segment: 'Moda e Beleza',
    rating: 4.2,
    ratingCount: 56,
    address: 'Shopping Plaza, Loja 4 - Seropédica',
    specialties: ['Moda Feminina', 'Acessórios'],
    hours: 'Segunda a Sábado: 10h às 22h',
  },
  {
    id: 5,
    name: 'Supermercado Preço Baixo',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Paracambi',
    segment: 'Alimentação',
    rating: 4.3,
    ratingCount: 320,
    address: 'Rua do Comércio, 500 - Paracambi - RJ',
  },
  {
    id: 6,
    name: 'Academia Fit Life',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Mendes',
    segment: 'Saúde e Bem Estar',
    rating: 4.7,
    ratingCount: 150,
    address: 'Av. Esportiva, 88 - Mendes - RJ',
    specialties: ['Musculação', 'Crossfit', 'Zumba'],
  },
  {
    id: 7,
    name: 'Pet Shop Amigo Fiel',
    image:
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Seropédica',
    segment: 'Serviços e Negócios',
    rating: 4.6,
    ratingCount: 92,
    address: 'Rua dos Animais, 22 - Seropédica - RJ',
  },
  {
    id: 8,
    name: 'Clínica Dentária Sorriso',
    image:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Paracambi',
    segment: 'Saúde e Bem Estar',
    rating: 4.9,
    ratingCount: 45,
    address: 'Centro Médico, Sala 3 - Paracambi - RJ',
  },
  {
    id: 9,
    name: 'Escola de Idiomas Global',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Mendes',
    segment: 'Educação',
    rating: 4.4,
    ratingCount: 70,
    address: 'Rua do Saber, 77 - Mendes - RJ',
  },
  {
    id: 10,
    name: 'Imobiliária Lar Doce Lar',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Seropédica',
    segment: 'Casa Construção e Decoração',
    rating: 4.1,
    ratingCount: 22,
    address: 'Av. das Casas, 300 - Seropédica - RJ',
  },
  {
    id: 11,
    name: 'Tech Solutions Informática',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1531297461136-82lw9b6291a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Paracambi',
    segment: 'Serviços e Negócios',
    rating: 4.8,
    ratingCount: 110,
    address: 'Rua da Tecnologia, 42 - Paracambi - RJ',
  },
  {
    id: 12,
    name: 'Salão de Beleza Glamour',
    image:
      'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    location: 'Mendes',
    segment: 'Moda e Beleza',
    rating: 4.5,
    ratingCount: 95,
    address: 'Centro Comercial, Loja 1 - Mendes - RJ',
  },
  {
    id: 13,
    name: 'Pizzaria Bella Napoli',
    image:
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=150&q=80',
    location: 'Rio de Janeiro',
    segment: 'Gastronomia',
    rating: 4.7,
    ratingCount: 340,
    address: 'Av. Atlântica, 1000 - Copacabana',
  },
  {
    id: 14,
    name: 'Crossfit Titan',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80',
    location: 'São Paulo',
    segment: 'Saúde e Bem Estar',
    rating: 4.9,
    ratingCount: 200,
    address: 'Rua Augusta, 500 - Consolação',
  },
  {
    id: 15,
    name: 'Barbearia Vintage',
    image:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=150&q=80',
    location: 'Curitiba',
    segment: 'Moda e Beleza',
    rating: 4.6,
    ratingCount: 88,
    address: 'Rua XV de Novembro, 200 - Centro',
  },
  {
    id: 16,
    name: 'Café Colonial Gramado',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80',
    location: 'Belo Horizonte',
    segment: 'Gastronomia',
    rating: 4.8,
    ratingCount: 500,
    address: 'Av. Afonso Pena, 1200 - Savassi',
  },
  {
    id: 17,
    name: 'Oficina Rápida',
    image:
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=150&q=80',
    location: 'Rio de Janeiro',
    segment: 'Automotivo',
    rating: 4.2,
    ratingCount: 65,
    address: 'Rua dos Mecânicos, 10 - Botafogo',
  },
  {
    id: 18,
    name: 'Clínica Veterinária PetCare',
    image:
      'https://images.unsplash.com/photo-1553688738-a278b9f063e0?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1628009368231-137d6e4a3026?auto=format&fit=crop&w=150&q=80',
    location: 'São Paulo',
    segment: 'Serviços e Negócios',
    rating: 4.7,
    ratingCount: 150,
    address: 'Av. Paulista, 2000 - Bela Vista',
  },
  {
    id: 19,
    name: 'Loja de Móveis Planejados',
    image:
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=150&q=80',
    location: 'Curitiba',
    segment: 'Casa Construção e Decoração',
    rating: 4.5,
    ratingCount: 78,
    address: 'Rua das Flores, 88 - Batel',
  },
  {
    id: 20,
    name: 'Escola de Música Harmonia',
    image:
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=150&q=80',
    location: 'Belo Horizonte',
    segment: 'Educação',
    rating: 4.8,
    ratingCount: 92,
    address: 'Rua da Música, 123 - Lourdes',
  },
  {
    id: 21,
    name: 'Hamburgueria Artesanal',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80',
    location: 'São Paulo',
    segment: 'Gastronomia',
    rating: 4.6,
    ratingCount: 220,
    address: 'Rua dos Pinheiros, 300 - Pinheiros',
  },
  {
    id: 22,
    name: 'Spa Zen Life',
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&q=80',
    location: 'Rio de Janeiro',
    segment: 'Saúde e Bem Estar',
    rating: 4.9,
    ratingCount: 110,
    address: 'Rua Visconde de Pirajá, 500 - Ipanema',
  },
  {
    id: 23,
    name: 'Auto Escola Piloto',
    image:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=150&q=80',
    location: 'Curitiba',
    segment: 'Educação',
    rating: 4.3,
    ratingCount: 85,
    address: 'Av. Cândido de Abreu, 700 - Centro Cívico',
  },
  {
    id: 24,
    name: 'Floricultura Jardim Secreto',
    image:
      'https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&w=150&q=80',
    location: 'Belo Horizonte',
    segment: 'Casa Construção e Decoração',
    rating: 4.7,
    ratingCount: 130,
    address: 'Rua da Bahia, 1000 - Centro',
  },
];
async function main() {
  console.log('Start seeding...');

  try {
    for (const agency of agencies) {
      // 1. Localities
      await prisma.localidades
        .upsert({
          where: { id: agency.location }, // Note: Real app ID is uuid, but we don't have unique constraint on nome, so upsert by name isn't straightforward without custom logic or schema change.
          // However, prisma upsert requires unique field.
          // For now, let's try findFirst -> create logic to mimic upsert by name.
          update: {},
          create: { nome: agency.location },
        })
        .catch(async () => {
          // Fallback manual upsert logic if the above fails (it will fail because id=location string isn't valid if schema expects uuid, but wait, schema defines id defaulting to uuid)
          // Actually, let's just do findFirst
          return null;
        });

      let localityRecord = await prisma.localidades.findFirst({
        where: { nome: agency.location },
      });
      if (!localityRecord) {
        localityRecord = await prisma.localidades.create({
          data: { nome: agency.location },
        });
      }

      // 2. Segments
      let segmentRecord = await prisma.segmentos.findFirst({
        where: { nome: agency.segment },
      });
      if (!segmentRecord) {
        segmentRecord = await prisma.segmentos.create({
          data: { nome: agency.segment },
        });
      }

      // 3. Establishments
      // Check if exists to avoid duplicates
      let establishment = await prisma.estabelecimentos.findFirst({
        where: { nome: agency.name },
      });

      if (!establishment) {
        establishment = await prisma.estabelecimentos.create({
          data: {
            nome: agency.name,
            descricao: agency.description || null,
            logo_url: agency.logo || null,
            endereco: agency.address || null,
            telefone: agency.phone || null,
            whatsapp: agency.whatsapp || null,
            avaliacao_media: agency.rating ? agency.rating : 0,
            total_avaliacoes: agency.ratingCount || 0,
            localidade_id: localityRecord.id,
            segmento_id: segmentRecord.id,
          },
        });

        // 4. Specialties
        if (agency.specialties && agency.specialties.length > 0) {
          for (const spec of agency.specialties) {
            await prisma.especialidades.create({
              data: {
                nome: spec,
                estabelecimento_id: establishment.id,
              },
            });
          }
        }

        // 5. Social Media
        if (agency.social) {
          if (agency.social.facebook) {
            await prisma.redes_sociais.create({
              data: {
                plataforma: 'Facebook',
                url: agency.social.facebook,
                estabelecimento_id: establishment.id,
              },
            });
          }
          if (agency.social.instagram) {
            await prisma.redes_sociais.create({
              data: {
                plataforma: 'Instagram',
                url: agency.social.instagram,
                estabelecimento_id: establishment.id,
              },
            });
          }
          if (agency.social.website) {
            await prisma.redes_sociais.create({
              data: {
                plataforma: 'Website',
                url: agency.social.website,
                estabelecimento_id: establishment.id,
              },
            });
          }
        }

        // 6. Encarte (The Card)
        // We create an encarte linking to the establishment
        const encarte = await prisma.encartes.create({
          data: {
            titulo: agency.name,
            imagem_capa_url: agency.image,
            localidade_id: localityRecord.id,
            // Note: encarte_estabelecimentos many-to-many link
          },
        });

        // Link Encarte to Establishment
        await prisma.encarte_estabelecimentos.create({
          data: {
            encarte_id: encarte.id,
            estabelecimento_id: establishment.id,
          },
        });

        console.log(`Created agency: ${agency.name}`);
      } else {
        console.log(`Agency already exists: ${agency.name}`);
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
