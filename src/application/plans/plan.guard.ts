import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { PLAN_RESOURCE_KEY } from './plan-resource.decorator';

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resource = this.reflector.get<
      'publication' | 'offer' | 'establishment'
    >(PLAN_RESOURCE_KEY, context.getHandler());

    if (!resource) return true;

    const req = context.switchToHttp().getRequest();
    const userId: number = req.user?.userId;

    if (!userId) return true;
    if (req.user?.role === 'ADMIN') return true;

    const { allowed, limit, current } =
      await this.subscriptionService.checkLimit(userId, resource);

    if (!allowed) {
      throw new ForbiddenException({
        code: 'PLAN_LIMIT_REACHED',
        resource,
        limit,
        current,
        message: `Limite do plano atingido: máximo de ${limit} ${resource}(s) ativas.`,
      });
    }

    return true;
  }
}
