import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async getExtract(userId: number, customerEmail: string) {
    const establishment = await this.prisma.establishment.findFirst({
      where: { users: { some: { id: userId } } },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    const customer = await this.prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found with this email');
    }

    const points = await this.prisma.loyaltyPoint.findMany({
      where: {
        establishmentId: establishment.id,
        userId: customer.id,
      },
      orderBy: { createdAt: 'desc' },
    });

    const balance = points.reduce((acc, current) => acc + current.points, 0);

    return { customer, points, balance };
  }

  async addPoints(
    userId: number,
    customerEmail: string,
    amount: number,
    description: string,
    sourceType: string = 'MANUAL'
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const establishment = await this.prisma.establishment.findFirst({
      where: { users: { some: { id: userId } } },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    const customer = await this.prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found with this email');
    }

    return this.prisma.loyaltyPoint.create({
      data: {
        userId: customer.id,
        establishmentId: establishment.id,
        points: amount,
        reason: description,
        sourceType,
      },
    });
  }

  async deducePoints(
    userId: number,
    customerEmail: string,
    amount: number,
    description: string
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    // Checking if the user has enough points
    const { balance } = await this.getExtract(userId, customerEmail);

    if (balance < amount) {
      throw new BadRequestException(
        'Customer does not have enough points for this deduction.'
      );
    }

    const establishment = await this.prisma.establishment.findFirst({
      where: { users: { some: { id: userId } } },
    });

    const customer = await this.prisma.user.findUnique({
      where: { email: customerEmail },
    });

    return this.prisma.loyaltyPoint.create({
      data: {
        userId: customer!.id,
        establishmentId: establishment!.id,
        points: -amount, // deduplicate points with negative value
        reason: description || 'Resgate de pontos',
        sourceType: 'REDEMPTION',
      },
    });
  }
}
