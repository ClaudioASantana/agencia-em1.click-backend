import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SegmentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.segment.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
