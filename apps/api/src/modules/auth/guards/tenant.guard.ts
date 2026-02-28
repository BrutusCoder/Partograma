// =====================================================================
// TenantGuard — Guard para isolamento multi-tenant por unitId
//
// Regras:
// 1. ADMIN pode acessar qualquer unidade.
// 2. Demais roles: unitId do JWT deve existir e é injetado como filtro.
// 3. Se um parâmetro :unitId existir na rota, deve coincidir com o do JWT
//    (exceto para ADMIN).
// =====================================================================

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@partograma/domain';
import { RequestUser } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // Admin global pode acessar qualquer tenant
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Para demais roles, unitId deve estar presente no token
    if (!user.unitId) {
      throw new ForbiddenException('Usuário sem unidade associada. Contate o administrador.');
    }

    // Se a rota tem um parâmetro unitId, verifica se coincide
    const routeUnitId = request.params?.unitId;
    if (routeUnitId && routeUnitId !== user.unitId) {
      throw new ForbiddenException('Acesso negado: unidade não corresponde ao seu vínculo.');
    }

    // Injeta unitId no request para uso nos services
    request.tenantUnitId = user.unitId;

    return true;
  }
}
