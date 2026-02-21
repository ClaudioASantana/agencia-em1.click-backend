import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { SeedController } from '../seed/seed.controller';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Module({
  controllers: [OfferController, SeedController],
  providers: [OfferService, PrismaService],
  exports: [OfferService],
})
export class OfferModule {}
