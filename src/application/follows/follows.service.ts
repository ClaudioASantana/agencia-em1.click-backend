import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async follow(userId: number, establishmentId: number) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id: establishmentId },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    return this.prisma.follow.create({
      data: {
        userId,
        establishmentId,
      },
    });
  }

  async unfollow(userId: number, establishmentId: number) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        userId_establishmentId: {
          userId,
          establishmentId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    return this.prisma.follow.delete({
      where: {
        id: follow.id,
      },
    });
  }

  async isFollowing(userId: number, establishmentId: number) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        userId_establishmentId: {
          userId,
          establishmentId,
        },
      },
    });
    return !!follow;
  }

  async getFollowedEstablishmentIds(userId: number) {
    const follows = await this.prisma.follow.findMany({
      where: { userId },
      select: { establishmentId: true },
    });
    return follows.map((f) => f.establishmentId);
  }
}
