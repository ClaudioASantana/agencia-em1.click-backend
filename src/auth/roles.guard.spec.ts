import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

const makeMockContext = (user: any, handlerRoles?: string[], classRoles?: string[]): ExecutionContext =>
  ({
    getHandler: () => ({ handlerRoles }),
    getClass: () => ({ classRoles }),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new RolesGuard(reflector);
  });

  it('retorna true quando nenhum role está definido no handler/classe', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const ctx = makeMockContext({ userId: 1, role: 'STORE_OWNER' });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('retorna true quando roles está vazio', () => {
    reflector.getAllAndOverride.mockReturnValue([]);
    const ctx = makeMockContext({ userId: 1, role: 'STORE_OWNER' });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('retorna true quando o usuário tem o role exigido (ADMIN)', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);
    const ctx = makeMockContext({ userId: 1, role: 'ADMIN' });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('lança ForbiddenException quando o usuário não está autenticado (user undefined)', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);
    const ctx = makeMockContext(undefined);

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(ctx)).toThrow('Não autenticado');
  });

  it('lança ForbiddenException quando o usuário tem role diferente do exigido', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);
    const ctx = makeMockContext({ userId: 5, role: 'STORE_OWNER' });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(ctx)).toThrow('Acesso restrito a administradores');
  });

  it('retorna true quando roles aceita múltiplos valores e o usuário tem um deles', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN', 'MODERATOR']);
    const ctx = makeMockContext({ userId: 1, role: 'ADMIN' });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('lança ForbiddenException quando role é case-sensitive (admin != ADMIN)', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);
    const ctx = makeMockContext({ userId: 1, role: 'admin' });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('usa getAllAndOverride com handler e class como alvos', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);
    const ctx = makeMockContext({ userId: 1, role: 'ADMIN' });

    guard.canActivate(ctx);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      expect.any(String), // ROLES_KEY
      expect.arrayContaining([expect.anything(), expect.anything()]),
    );
  });
});
