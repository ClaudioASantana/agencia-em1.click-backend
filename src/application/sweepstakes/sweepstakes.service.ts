import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateSweepstakeDto } from './dto/create-sweepstake.dto';
import { UpdateSweepstakeDto } from './dto/update-sweepstake.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SweepstakesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createSweepstakeDto: CreateSweepstakeDto) {
    const establishment = await this.prisma.establishment.findFirst({
      where: { users: { some: { id: userId } } },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found for this user');
    }

    return this.prisma.sweepstake.create({
      data: {
        title: createSweepstakeDto.title,
        description: createSweepstakeDto.description,
        startDate: createSweepstakeDto.startDate ? new Date(createSweepstakeDto.startDate) : undefined,
        endDate: createSweepstakeDto.endDate ? new Date(createSweepstakeDto.endDate) : undefined,
        active: true,
        type: createSweepstakeDto.type || 'DEFAULT',
        prizeQuantity: createSweepstakeDto.prizeQuantity || 1,
        establishmentId: establishment.id,
      },
    });
  }

  async findAll(userId: number) {
    const establishment = await this.prisma.establishment.findFirst({
      where: { users: { some: { id: userId } } },
    });

    if (!establishment) {
      return [];
    }

    return this.prisma.sweepstake.findMany({
      where: { establishmentId: establishment.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const establishment = await this.prisma.establishment.findFirst({
      where: { users: { some: { id: userId } } },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    const sweepstake = await this.prisma.sweepstake.findFirst({
      where: { id, establishmentId: establishment.id },
      include: {
        tickets: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!sweepstake) {
      throw new NotFoundException('Sweepstake not found');
    }

    return sweepstake;
  }

  async update(id: number, userId: number, updateSweepstakeDto: UpdateSweepstakeDto) {
    const sweepstake = await this.findOne(id, userId);

    return this.prisma.sweepstake.update({
      where: { id: sweepstake.id },
      data: {
        title: updateSweepstakeDto.title,
        description: updateSweepstakeDto.description,
        startDate: updateSweepstakeDto.startDate ? new Date(updateSweepstakeDto.startDate) : undefined,
        endDate: updateSweepstakeDto.endDate ? new Date(updateSweepstakeDto.endDate) : undefined,
        active: updateSweepstakeDto.active,
      },
    });
  }

  async remove(id: number, userId: number) {
    const sweepstake = await this.findOne(id, userId);

    // Ensure we cascade/delete tickets or fail if tickets exist depending on business rules.
    // Usually we don't delete if there are tickets, but let's check
    const ticketsCount = await this.prisma.sweepstakeTicket.count({
      where: { sweepstakeId: id },
    });

    if (ticketsCount > 0) {
      throw new BadRequestException('Cannot delete a sweepstake that already has tickets issued.');
    }

    return this.prisma.sweepstake.delete({
      where: { id: sweepstake.id },
    });
  }

  async issueTicket(sweepstakeId: number, currentUserId: number, customerEmail: string) {
    const sweepstake = await this.findOne(sweepstakeId, currentUserId);

    if (!sweepstake.active) {
      throw new BadRequestException('Sweepstake is not active.');
    }

    const customer = await this.prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found with this email.');
    }

    const hashcode = this.generateTicketNumber(sweepstakeId, customer.id);

    return this.prisma.sweepstakeTicket.create({
      data: {
        sweepstakeId,
        userId: customer.id,
        hashcode,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }

  private generateTicketNumber(sweepstakeId: number, userId: number): string {
    const prefix = `SWP${sweepstakeId}`;
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
  }
}
