// =====================================================================
// JWT Strategy — Passport strategy para validar Bearer tokens
// Sprint 1: Valida JWT assinado com secret local.
// Sprint 5: Será substituída por validação via JWKS do Keycloak.
// =====================================================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, RequestUser } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtSecret'),
    });
  }

  /**
   * Invocado pelo Passport após decodificar e verificar o JWT.
   * O retorno é anexado a request.user.
   */
  validate(payload: JwtPayload): RequestUser {
    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido: sub ausente');
    }

    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      unitId: payload.unitId,
    };
  }
}
