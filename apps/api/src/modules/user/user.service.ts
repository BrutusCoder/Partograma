// =====================================================================
// User Service — CRUD para usuários com isolamento multi-tenant
// =====================================================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { UserRole } from '@partograma/domain';
import { UserEntity } from './entities/user.entity';
import { UnitEntity } from '../unit/entities/unit.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestUser } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UnitEntity)
    private readonly unitRepository: Repository<UnitEntity>,
  ) {}

  /**
   * Lista usuários com filtro multi-tenant.
   * ADMIN: vê todos. Demais roles: apenas usuários da mesma unidade.
   */
  async findAll(currentUser: RequestUser): Promise<UserEntity[]> {
    const where: FindOptionsWhere<UserEntity> = {};

    if (currentUser.role !== UserRole.ADMIN && currentUser.unitId) {
      where.unitId = currentUser.unitId;
    }

    return this.userRepository.find({
      where,
      relations: ['unit'],
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }

  /**
   * Busca um usuário pelo ID com verificação de tenant.
   */
  async findOne(id: string, currentUser: RequestUser): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['unit'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
    }

    // Verifica isolamento multi-tenant
    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.unitId &&
      user.unitId !== currentUser.unitId
    ) {
      throw new ForbiddenException('Acesso negado: usuário pertence a outra unidade');
    }

    return user;
  }

  /**
   * Cria um novo usuário.
   */
  async create(dto: CreateUserDto, currentUser: RequestUser): Promise<UserEntity> {
    // Verifica unicidade de username e email
    const existingUsername = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException(`Username "${dto.username}" já está em uso`);
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException(`E-mail "${dto.email}" já está em uso`);
    }

    // Se não é ADMIN, força unitId do próprio tenant
    let unitId = dto.unitId ?? null;
    if (currentUser.role !== UserRole.ADMIN) {
      unitId = currentUser.unitId;
    }

    // Valida se a unidade existe
    if (unitId) {
      const unit = await this.unitRepository.findOne({ where: { id: unitId } });
      if (!unit) {
        throw new NotFoundException(`Unidade com ID "${unitId}" não encontrada`);
      }
    }

    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      unitId: unitId,
      isActive: dto.isActive ?? true,
      keycloakSub: dto.keycloakSub ?? null,
    });

    const saved = await this.userRepository.save(user);
    this.logger.log(`Usuário criado: ${saved.username} (${saved.id}), role: ${saved.role}`);

    return this.userRepository.findOne({
      where: { id: saved.id },
      relations: ['unit'],
    }) as Promise<UserEntity>;
  }

  /**
   * Atualiza um usuário existente.
   */
  async update(id: string, dto: UpdateUserDto, currentUser: RequestUser): Promise<UserEntity> {
    const user = await this.findOne(id, currentUser);

    // Verifica unicidade se alterou username/email
    if (dto.username && dto.username !== user.username) {
      const existing = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (existing) {
        throw new ConflictException(`Username "${dto.username}" já está em uso`);
      }
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException(`E-mail "${dto.email}" já está em uso`);
      }
    }

    // Se não é ADMIN, não pode alterar unitId para outra unidade
    if (dto.unitId !== undefined && currentUser.role !== UserRole.ADMIN) {
      if (dto.unitId !== currentUser.unitId) {
        throw new ForbiddenException('Apenas ADMIN pode transferir usuários entre unidades');
      }
    }

    // Valida unidade se alterada
    if (dto.unitId && dto.unitId !== user.unitId) {
      const unit = await this.unitRepository.findOne({ where: { id: dto.unitId } });
      if (!unit) {
        throw new NotFoundException(`Unidade com ID "${dto.unitId}" não encontrada`);
      }
    }

    Object.assign(user, dto);
    await this.userRepository.save(user);
    this.logger.log(`Usuário atualizado: ${user.username} (${user.id})`);

    return this.userRepository.findOne({
      where: { id: user.id },
      relations: ['unit'],
    }) as Promise<UserEntity>;
  }

  /**
   * Desativa um usuário (soft delete).
   */
  async remove(id: string, currentUser: RequestUser): Promise<void> {
    const user = await this.findOne(id, currentUser);

    // Não permite desativar a si mesmo
    if (user.id === currentUser.id) {
      throw new ForbiddenException('Não é possível desativar o próprio usuário');
    }

    user.isActive = false;
    await this.userRepository.save(user);
    this.logger.log(`Usuário desativado: ${user.username} (${user.id})`);
  }
}
