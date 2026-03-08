import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ShareTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(establishmentId: number) {
    const token = randomBytes(6).toString('hex'); // 12 chars hex
    const shareToken = await this.prisma.shareToken.create({
      data: { token, establishmentId },
    });
    return { token: shareToken.token };
  }

  async registerVisit(token: string) {
    // Fire-and-forget: atualiza clickCount sem bloquear
    void this.prisma.shareToken
      .update({
        where: { token },
        data: { clickCount: { increment: 1 } },
      })
      .catch(() => {
        // Token inválido ou expirado — ignorar silenciosamente
      });
  }

  async getStatsByEstablishment(establishmentId: number) {
    const tokens = await this.prisma.shareToken.findMany({
      where: { establishmentId },
      orderBy: { createdAt: 'desc' },
      select: {
        token: true,
        clickCount: true,
        createdAt: true,
      },
    });

    const totalClicks = tokens.reduce((sum, t) => sum + t.clickCount, 0);
    return { totalClicks, tokens };
  }
}
