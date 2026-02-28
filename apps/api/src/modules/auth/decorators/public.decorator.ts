// =====================================================================
// @Public() — Decorator para marcar endpoints que não requerem autenticação
// Uso: @Public() em controller ou handler
// =====================================================================

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
