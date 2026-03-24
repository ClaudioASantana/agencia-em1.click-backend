import { SubscriptionService } from './subscription.service';
import { DEFAULT_FREE_PLAN } from '../plans/plan.constants';

const makePrisma = (overrides: Record<string, any> = {}) =>
  ({
    subscription: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    establishment: { findMany: jest.fn(), count: jest.fn() },
    publication: { count: jest.fn() },
    offer: { count: jest.fn() },
    ...overrides,
  }) as any;

const STARTER_PLAN = {
  id: 2,
  name: 'Starter',
  price: 49.9,
  maxPublications: 5,
  maxOffersPerPub: 10,
  maxEstablishments: 3,
  allowsHighlight: false,
  allowsAnalytics: false,
  createdAt: new Date(),
};

describe('SubscriptionService', () => {
  describe('getPlanByUserId', () => {
    it('retorna plano grátis quando usuário não tem assinatura', async () => {
      const prisma = makePrisma();
      prisma.subscription.findUnique.mockResolvedValue(null);
      const svc = new SubscriptionService(prisma);

      const plan = await svc.getPlanByUserId(1);
      expect(plan).toEqual(DEFAULT_FREE_PLAN);
    });

    it('retorna plano grátis quando assinatura está cancelada', async () => {
      const prisma = makePrisma();
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'CANCELLED',
        plan: STARTER_PLAN,
      });
      const svc = new SubscriptionService(prisma);

      const plan = await svc.getPlanByUserId(1);
      expect(plan).toEqual(DEFAULT_FREE_PLAN);
    });

    it('retorna plano grátis quando assinatura está expirada', async () => {
      const prisma = makePrisma();
      const yesterday = new Date(Date.now() - 86400_000);
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        expiresAt: yesterday,
        plan: STARTER_PLAN,
      });
      const svc = new SubscriptionService(prisma);

      const plan = await svc.getPlanByUserId(1);
      expect(plan).toEqual(DEFAULT_FREE_PLAN);
    });

    it('retorna o plano correto quando assinatura está ativa e não expirada', async () => {
      const prisma = makePrisma();
      const tomorrow = new Date(Date.now() + 86400_000);
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        expiresAt: tomorrow,
        plan: STARTER_PLAN,
      });
      const svc = new SubscriptionService(prisma);

      const plan = await svc.getPlanByUserId(1);
      expect(plan).toEqual(STARTER_PLAN);
    });
  });

  describe('checkLimit — publication', () => {
    it('permite criação quando abaixo do limite', async () => {
      const prisma = makePrisma();
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        expiresAt: null,
        plan: STARTER_PLAN,
      });
      prisma.establishment.findMany.mockResolvedValue([{ id: 10 }, { id: 11 }]);
      prisma.publication.count.mockResolvedValue(3); // abaixo do limite de 5

      const svc = new SubscriptionService(prisma);
      const result = await svc.checkLimit(1, 'publication');

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(5);
      expect(result.current).toBe(3);
    });

    it('bloqueia quando no limite', async () => {
      const prisma = makePrisma();
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        expiresAt: null,
        plan: STARTER_PLAN,
      });
      prisma.establishment.findMany.mockResolvedValue([{ id: 10 }]);
      prisma.publication.count.mockResolvedValue(5); // igual ao limite

      const svc = new SubscriptionService(prisma);
      const result = await svc.checkLimit(1, 'publication');

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(5);
    });

    it('usuário sem assinatura respeita limite do plano grátis (max 1)', async () => {
      const prisma = makePrisma();
      prisma.subscription.findUnique.mockResolvedValue(null);
      prisma.establishment.findMany.mockResolvedValue([{ id: 10 }]);
      prisma.publication.count.mockResolvedValue(1); // já tem 1

      const svc = new SubscriptionService(prisma);
      const result = await svc.checkLimit(1, 'publication');

      expect(result.allowed).toBe(false);
      expect(result.limit).toBe(1);
    });
  });

  describe('checkLimit — establishment', () => {
    it('permite quando abaixo do limite de estabelecimentos', async () => {
      const prisma = makePrisma();
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        expiresAt: null,
        plan: STARTER_PLAN,
      });
      prisma.establishment.count.mockResolvedValue(2); // abaixo de 3

      const svc = new SubscriptionService(prisma);
      const result = await svc.checkLimit(1, 'establishment');

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(3);
    });

    it('bloqueia quando atingiu o limite de estabelecimentos', async () => {
      const prisma = makePrisma();
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        expiresAt: null,
        plan: STARTER_PLAN,
      });
      prisma.establishment.count.mockResolvedValue(3); // igual ao limite

      const svc = new SubscriptionService(prisma);
      const result = await svc.checkLimit(1, 'establishment');

      expect(result.allowed).toBe(false);
    });
  });
});
