import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PlanGuard } from './plan.guard';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { PLAN_RESOURCE_KEY } from './plan-resource.decorator';

const makeMockContext = (user: any): ExecutionContext =>
  ({
    getHandler: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

describe('PlanGuard', () => {
  let guard: PlanGuard;
  let reflector: jest.Mocked<Reflector>;
  let subscriptionService: jest.Mocked<SubscriptionService>;

  beforeEach(() => {
    reflector = {
      get: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    subscriptionService = {
      checkLimit: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionService>;

    guard = new PlanGuard(reflector, subscriptionService);
  });

  it('retorna true quando nenhum resource está decorado no handler', async () => {
    reflector.get.mockReturnValue(undefined);
    const ctx = makeMockContext({ userId: 1 });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(subscriptionService.checkLimit).not.toHaveBeenCalled();
  });

  it('retorna true quando não há userId no request (usuário não autenticado)', async () => {
    reflector.get.mockReturnValue('publication');
    const ctx = makeMockContext(undefined);
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(subscriptionService.checkLimit).not.toHaveBeenCalled();
  });

  it('retorna true quando o limite ainda não foi atingido', async () => {
    reflector.get.mockReturnValue('publication');
    subscriptionService.checkLimit.mockResolvedValue({
      allowed: true,
      limit: 5,
      current: 2,
    });
    const ctx = makeMockContext({ userId: 42 });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(subscriptionService.checkLimit).toHaveBeenCalledWith(
      42,
      'publication',
    );
  });

  it('lança ForbiddenException com PLAN_LIMIT_REACHED quando limite atingido', async () => {
    reflector.get.mockReturnValue('publication');
    subscriptionService.checkLimit.mockResolvedValue({
      allowed: false,
      limit: 1,
      current: 1,
    });
    const ctx = makeMockContext({ userId: 7 });

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);

    try {
      await guard.canActivate(ctx);
    } catch (err: any) {
      expect(err.response.code).toBe('PLAN_LIMIT_REACHED');
      expect(err.response.limit).toBe(1);
      expect(err.response.current).toBe(1);
      expect(err.response.resource).toBe('publication');
    }
  });

  it('verifica limite para resource "offer"', async () => {
    reflector.get.mockReturnValue('offer');
    subscriptionService.checkLimit.mockResolvedValue({
      allowed: true,
      limit: 5,
      current: 3,
    });
    const ctx = makeMockContext({ userId: 10 });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(subscriptionService.checkLimit).toHaveBeenCalledWith(10, 'offer');
  });

  it('verifica limite para resource "establishment"', async () => {
    reflector.get.mockReturnValue('establishment');
    subscriptionService.checkLimit.mockResolvedValue({
      allowed: false,
      limit: 1,
      current: 1,
    });
    const ctx = makeMockContext({ userId: 5 });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });
});
