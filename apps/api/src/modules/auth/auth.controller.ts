// =====================================================================
// Auth Controller — Endpoints de autenticação (Sprint 1 placeholder)
// POST /auth/dev-login  — gera token JWT para desenvolvimento
// GET  /auth/profile    — retorna perfil do usuário autenticado
// =====================================================================

import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RequestUser } from './interfaces/jwt-payload.interface';

class DevLoginDto {
  username!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('dev-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[DEV] Login de desenvolvimento',
    description:
      'Gera um JWT para teste local. NÃO usa senha. ' +
      'Será substituído pelo fluxo OIDC/Keycloak no Sprint 5.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { username: { type: 'string', example: 'admin' } },
      required: ['username'],
    },
  })
  async devLogin(@Body() body: DevLoginDto) {
    return this.authService.devLogin(body.username);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna perfil do usuário autenticado' })
  async getProfile(@CurrentUser() user: RequestUser) {
    return this.authService.getProfile(user.id);
  }
}
