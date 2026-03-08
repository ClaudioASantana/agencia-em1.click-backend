import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SegmentsService {
  constructor(private prisma: PrismaService) {}

  create(createSegmentDto: CreateSegmentDto) {
    return this.prisma.segment.create({
      data: createSegmentDto,
    });
  }

  findAll() {
    return this.prisma.segment.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const segment = await this.prisma.segment.findUnique({ where: { id } });
    if (!segment) throw new NotFoundException('Segmento não encontrado');
    return segment;
  }

  async update(id: number, updateSegmentDto: UpdateSegmentDto) {
    await this.findOne(id);
    return this.prisma.segment.update({
      where: { id },
      data: updateSegmentDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.segment.delete({ where: { id } });
  }
}
