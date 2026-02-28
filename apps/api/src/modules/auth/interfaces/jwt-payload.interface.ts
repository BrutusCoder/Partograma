// =====================================================================
// JWT Payload — Estrutura do token JWT usado na autenticação
// Placeholder para Sprint 1; será substituído por claims Keycloak no Sprint 5
// =====================================================================

import { UserRole } from '@partograma/domain';

export interface JwtPayload {
  /** ID do usuário (users.id) */
  sub: string;
  username: string;
  email: string;
  role: UserRole;
  /** ID da unidade (multi-tenant) — null para ADMIN global */
  unitId: string | null;
  iat?: number;
  exp?: number;
}

/** Tipo do usuário anexado ao request após validação do JWT */
export interface RequestUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  unitId: string | null;
}
