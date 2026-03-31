import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateLoyaltyDto } from './dto/create-loyalty.dto';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async fetchPoints(userId: number) {
    const establishment = await this.prisma.establishment.findFirst({
      where: { users: { some: { id: userId } } },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    return this.prisma.loyaltyPoint.findMany({
      where: { establishmentId: establishment.id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addPoints(userId: number, createLoyaltyDto: CreateLoyaltyDto) {
    const establishment = await this.prisma.establishment.findFirst({
      where: { users: { some: { id: userId } } },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    const customer = await this.prisma.user.findUnique({
      where: { email: createLoyaltyDto.customerEmail },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found with this email.');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.prisma.loyaltyPoint.create({
      data: {
        establishmentId: establishment.id,
        userId: customer.id,
        points: createLoyaltyDto.points,
        value: createLoyaltyDto.value || null,
        reason: createLoyaltyDto.reason || null,
        sourceType: 'MANUAL',
        status: 'ACTIVE',
      },
    });
  }

  async fetchCustomerPoints(customerId: number) {
    return this.prisma.loyaltyPoint.findMany({
      where: { userId: customerId },
      include: {
        establishment: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
