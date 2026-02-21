// =====================================================================
// User Entity — Usuário do sistema Partograma LCG
// Fonte: libs/domain/src/types.ts → interface User
// Autenticação via Keycloak (OIDC); esta tabela armazena o perfil local.
// =====================================================================

import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserRole } from '@partograma/domain';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UnitEntity } from '../../unit/entities/unit.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  /** Username — mesmo do Keycloak */
  @Column({ type: 'varchar', length: 150, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 150 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 150 })
  lastName!: string;

  /** Role RBAC — espelha a realm role do Keycloak */
  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  // --- Relação: Unit (opcional) ---
  @Column({ name: 'unit_id', type: 'uuid', nullable: true })
  unitId!: string | null;

  @ManyToOne(() => UnitEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'unit_id' })
  unit?: UnitEntity;

  /** Sub do Keycloak — permite vincular o perfil local ao token OIDC */
  @Index('IDX_users_keycloak_sub', { unique: true })
  @Column({ name: 'keycloak_sub', type: 'varchar', length: 255, nullable: true, unique: true })
  keycloakSub!: string | null;
}
