import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PublicationService } from './publication.service';

const makePublication = (overrides = {}) => ({
  id: 1,
  title: 'Pub de Verão',
  description: null,
  status: 'DRAFT',
  startDate: null,
  endDate: null,
  priority: 'Média',
  establishmentId: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
  establishment: { name: 'Loja Teste', slug: 'loja-teste' },
  ...overrides,
});

const makePrisma = (overrides: Record<string, any> = {}) =>
  ({
    publication: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    establishment: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    follow: { findMany: jest.fn() },
    lead: { findMany: jest.fn() },
    leadNotification: { create: jest.fn() },
    ...overrides,
  }) as any;

const makeMailService = () => ({ sendNewCampaignAlert: jest.fn().mockResolvedValue(undefined) }) as any;
const makeWhatsappService = () => ({ send: jest.fn().mockResolvedValue('SENT') }) as any;
const makeConfigService = () => ({ get: jest.fn().mockReturnValue('https://vitrine.test') }) as any;

describe('PublicationService', () => {
  describe('update — verificação de propriedade', () => {
    it('atualiza com sucesso quando userId é undefined (admin)', async () => {
      const pub = makePublication();
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue({ status: pub.status, establishmentId: pub.establishmentId });
      prisma.publication.update.mockResolvedValue({ ...pub, title: 'Novo título' });

      const svc = new PublicationService(prisma, makeMailService(), makeWhatsappService(), makeConfigService());
      const result = await svc.update(1, { title: 'Novo título' }, undefined);

      expect(result.title).toBe('Novo título');
      expect(prisma.establishment.findFirst).not.toHaveBeenCalled();
    });

    it('atualiza com sucesso quando userId é dono do estabelecimento', async () => {
      const pub = makePublication();
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue({ status: pub.status, establishmentId: pub.establishmentId });
      prisma.establishment.findFirst.mockResolvedValue({ id: 10 }); // é dono
      prisma.publication.update.mockResolvedValue({ ...pub, title: 'Minha Oferta' });

      const svc = new PublicationService(prisma, makeMailService(), makeWhatsappService(), makeConfigService());
      const result = await svc.update(1, { title: 'Minha Oferta' }, 99);

      expect(result.title).toBe('Minha Oferta');
      expect(prisma.establishment.findFirst).toHaveBeenCalledWith({
        where: { id: 10, users: { some: { id: 99 } } },
        select: { id: true },
      });
    });

    it('lança ForbiddenException quando userId não é dono', async () => {
      const pub = makePublication();
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue({ status: pub.status, establishmentId: pub.establishmentId });
      prisma.establishment.findFirst.mockResolvedValue(null); // NÃO é dono

      const svc = new PublicationService(prisma, makeMailService(), makeWhatsappService(), makeConfigService());

      await expect(svc.update(1, { title: 'Invasão' }, 999)).rejects.toThrow(ForbiddenException);
    });

    it('lança NotFoundException quando publicação não existe', async () => {
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue(null);

      const svc = new PublicationService(prisma, makeMailService(), makeWhatsappService(), makeConfigService());

      await expect(svc.update(999, { title: 'Qualquer' }, 1)).rejects.toThrow(NotFoundException);
    });

    it('dispara notificações ao ativar publicação (DRAFT → ACTIVE)', async () => {
      const pub = makePublication({ status: 'DRAFT', establishment: { name: 'Loja X', slug: 'loja-x' } });
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue({ status: 'DRAFT', establishmentId: 10 });
      prisma.establishment.findFirst.mockResolvedValue({ id: 10 });
      prisma.publication.update.mockResolvedValue({ ...pub, status: 'ACTIVE', establishment: pub.establishment });
      prisma.follow.findMany.mockResolvedValue([]);
      prisma.lead.findMany.mockResolvedValue([]);

      const mail = makeMailService();
      const svc = new PublicationService(prisma, mail, makeWhatsappService(), makeConfigService());

      await svc.update(1, { status: 'ACTIVE' }, undefined);

      // aguarda o setImmediate disparar
      await new Promise((r) => setImmediate(r));

      // Como não há followers, sendNewCampaignAlert não é chamado
      expect(mail.sendNewCampaignAlert).not.toHaveBeenCalled();
    });

    it('NÃO dispara notificações quando publicação já estava ACTIVE', async () => {
      const pub = makePublication({ status: 'ACTIVE', establishment: { name: 'Loja X', slug: 'loja-x' } });
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue({ status: 'ACTIVE', establishmentId: 10 });
      prisma.establishment.findFirst.mockResolvedValue({ id: 10 });
      prisma.publication.update.mockResolvedValue({ ...pub, title: 'Atualizada' });

      const mail = makeMailService();
      const svc = new PublicationService(prisma, mail, makeWhatsappService(), makeConfigService());

      await svc.update(1, { status: 'ACTIVE', title: 'Atualizada' }, undefined);
      await new Promise((r) => setImmediate(r));

      expect(prisma.follow.findMany).not.toHaveBeenCalled();
      expect(mail.sendNewCampaignAlert).not.toHaveBeenCalled();
    });
  });

  describe('remove — verificação de propriedade', () => {
    it('remove com sucesso quando userId é undefined (admin)', async () => {
      const prisma = makePrisma();
      prisma.publication.delete.mockResolvedValue({ id: 1 });

      const svc = new PublicationService(prisma, makeMailService(), makeWhatsappService(), makeConfigService());
      const result = await svc.remove(1, undefined);

      expect(result).toEqual({ id: 1 });
      expect(prisma.establishment.findFirst).not.toHaveBeenCalled();
    });

    it('remove com sucesso quando userId é dono', async () => {
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue({ establishmentId: 10 });
      prisma.establishment.findFirst.mockResolvedValue({ id: 10 });
      prisma.publication.delete.mockResolvedValue({ id: 1 });

      const svc = new PublicationService(prisma, makeMailService(), makeWhatsappService(), makeConfigService());
      await svc.remove(1, 42);

      expect(prisma.publication.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('lança ForbiddenException ao tentar remover publicação de outro usuário', async () => {
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue({ establishmentId: 10 });
      prisma.establishment.findFirst.mockResolvedValue(null); // não é dono

      const svc = new PublicationService(prisma, makeMailService(), makeWhatsappService(), makeConfigService());

      await expect(svc.remove(1, 999)).rejects.toThrow(ForbiddenException);
      expect(prisma.publication.delete).not.toHaveBeenCalled();
    });

    it('lança NotFoundException ao tentar remover publicação inexistente', async () => {
      const prisma = makePrisma();
      prisma.publication.findUnique.mockResolvedValue(null);

      const svc = new PublicationService(prisma, makeMailService(), makeWhatsappService(), makeConfigService());

      await expect(svc.remove(999, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
