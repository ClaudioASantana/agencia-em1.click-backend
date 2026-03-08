import { Module } from '@nestjs/common';
import { EstablishmentController } from './establishment.controller';
import { EstablishmentService } from './establishment.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PlanModule } from '../plans/plan.module';

@Module({
  imports: [PrismaModule, PlanModule],
  controllers: [EstablishmentController],
  providers: [EstablishmentService],
})
export class EstablishmentModule {}
