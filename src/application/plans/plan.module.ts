import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { PlanGuard } from './plan.guard';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { SubscriptionModule } from '../subscriptions/subscription.module';

@Module({
  imports: [PrismaModule, SubscriptionModule],
  controllers: [PlanController],
  providers: [PlanService, PlanGuard],
  exports: [PlanService, PlanGuard, SubscriptionModule],
})
export class PlanModule {}
