import { Module } from '@nestjs/common';
import { SweepstakesService } from './sweepstakes.service';
import { SweepstakesController } from './sweepstakes.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SweepstakesController],
  providers: [SweepstakesService],
})
export class SweepstakesModule {}
