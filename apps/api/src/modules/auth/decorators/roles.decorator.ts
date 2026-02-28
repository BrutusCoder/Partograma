// =====================================================================
// @Roles() — Decorator para definir roles permitidas em um endpoint
// Uso: @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
// =====================================================================

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@partograma/domain';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
