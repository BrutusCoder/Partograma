// =====================================================================
// @CurrentUser() — Decorator para extrair o usuário autenticado do request
// Uso: @CurrentUser() user: RequestUser
//      @CurrentUser('id') userId: string
// =====================================================================

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: RequestUser = request.user;
    return data ? user?.[data] : user;
  },
);
