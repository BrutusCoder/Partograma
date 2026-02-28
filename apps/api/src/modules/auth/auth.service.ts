// =====================================================================
// Auth Service — Serviço de autenticação (Sprint 1 placeholder)
// Gera JWT para dev/teste. Sprint 5: migrar para fluxo Keycloak OIDC.
// =====================================================================

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Login de desenvolvimento: busca usuário por username e gera JWT.
   * NÃO valida senha — apenas para ambiente de desenvolvimento.
   * Em produção, o login será via Keycloak OIDC (Sprint 5).
   */
  async devLogin(username: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      unitId: user.unitId,
    };

    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`[DEV] Token gerado para: ${user.username} (role: ${user.role})`);

    return { accessToken };
  }

  /**
   * Retorna o perfil do usuário autenticado pelo ID do JWT.
   */
  async getProfile(userId: string): Promise<Omit<UserEntity, 'keycloakSub'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['unit'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { keycloakSub, ...profile } = user;
    return profile;
  }
}
