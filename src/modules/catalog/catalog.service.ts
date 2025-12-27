import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getAgencies() {
    const establishments = await this.prisma.estabelecimentos.findMany({
      include: {
        localidades: true,
        segmentos: true,
        redes_sociais: true,
        especialidades: true,
        encarte_estabelecimentos: {
          include: {
            encartes: true,
          },
        },
      },
      orderBy: { nome: 'asc' },
    });

    // Map to Frontend Agency Interface
    return establishments.map((e) => {
      // Find the main image from encartes (assuming one main encarte for now or take the first one)
      // If no encarte, fallback to logo or placeholder
      const mainEncarte = e.encarte_estabelecimentos[0]?.encartes;
      const image = mainEncarte?.imagem_capa_url || e.logo_url || '';

      return {
        id: e.id, // Keep UUID for backend referencing, frontend might need to adapt if it strictly expects number, but we defined Agency ID as number in frontend.
        // Wait, the frontend mock uses number, backend uses UUID.
        // We should ideally update frontend to accept string IDs.
        // For strict backward compatibility with current frontend definition (number), we might have a problem.
        // Proposal said: "Returns a list of agencies formatted to match the frontend Agency interface".
        // If frontend expects number, and we send uuid string, it might break.
        // I will update the frontend interface to accept string | number, or just string.
        // For now, let's return the UUID.
        name: e.nome,
        image: image,
        logo: e.logo_url,
        location: e.localidades?.nome || '',
        segment: e.segmentos?.nome || '',
        description: e.descricao,
        rating: Number(e.avaliacao_media) || 0,
        ratingCount: e.total_avaliacoes || 0,
        address: e.endereco,
        hours: null, // Schema doesn't have operating hours yet
        phone: e.telefone,
        whatsapp: e.whatsapp,
        specialties: e.especialidades.map((s) => s.nome),
        social: {
          facebook: e.redes_sociais.find((s) => s.plataforma === 'Facebook')
            ?.url,
          instagram: e.redes_sociais.find((s) => s.plataforma === 'Instagram')
            ?.url,
          website: e.redes_sociais.find((s) => s.plataforma === 'Website')?.url,
        },
      };
    });
  }

  async getFilters() {
    const locations = await this.prisma.localidades.findMany({
      select: { nome: true },
      distinct: ['nome'],
    });
    const segments = await this.prisma.segmentos.findMany({
      select: { nome: true },
      distinct: ['nome'],
    });

    return {
      locations: locations.map((l) => l.nome),
      segments: segments.map((s) => s.nome),
    };
  }
}
