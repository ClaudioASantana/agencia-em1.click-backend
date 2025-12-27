import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, PrismaService],
})
export class CatalogModule {}
