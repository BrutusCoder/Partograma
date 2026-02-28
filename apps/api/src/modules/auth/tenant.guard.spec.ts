// =====================================================================
// TenantGuard — Testes unitários
// =====================================================================

import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@partograma/domain';
import { TenantGuard } from './guards/tenant.guard';

describe('TenantGuard', () => {
  let guard: TenantGuard;

  beforeEach(() => {
    guard = new TenantGuard();
  });

  const createContext = (user: unknown, params: Record<string, string> = {}): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params,
        }),
      }),
    }) as unknown as ExecutionContext;

  it('deve permitir ADMIN acessar qualquer unidade', () => {
    const context = createContext(
      { id: '1', role: UserRole.ADMIN, unitId: null },
      { unitId: 'unit-99' },
    );

    expect(guard.canActivate(context)).toBe(true);
  });

  it('deve permitir acesso quando unitId do JWT coincide com a rota', () => {
    const context = createContext(
      { id: '1', role: UserRole.ENFERMEIRO_OBSTETRA, unitId: 'unit-1' },
      { unitId: 'unit-1' },
    );

    expect(guard.canActivate(context)).toBe(true);
  });

  it('deve bloquear quando unitId do JWT difere da rota', () => {
    const context = createContext(
      { id: '1', role: UserRole.ENFERMEIRO_OBSTETRA, unitId: 'unit-1' },
      { unitId: 'unit-2' },
    );

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('deve bloquear quando usuário não-ADMIN não tem unitId', () => {
    const context = createContext({
      id: '1',
      role: UserRole.ENFERMEIRO_OBSTETRA,
      unitId: null,
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('deve bloquear quando não há usuário autenticado', () => {
    const context = createContext(null);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
