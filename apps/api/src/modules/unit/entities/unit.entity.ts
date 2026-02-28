// =====================================================================
// Unit Entity — Unidade de saúde / maternidade (tenant)
// Fonte: @partograma/domain → interface Unit + MultiTenantEntity
// Campos marcados (a confirmar) poderão ser renomeados/estendidos.
// =====================================================================

import { Entity, Column, OneToMany } from 'typeorm';
import { Unit as IUnit } from '@partograma/domain';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('units')
export class UnitEntity extends BaseEntity implements Omit<IUnit, 'createdAt' | 'updatedAt'> {
  /** Nome da unidade de saúde */
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /** Código externo / CNES da unidade */
  @Column({ name: 'external_id', type: 'varchar', length: 100, nullable: true, unique: true })
  externalId!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  // Relação inversa — carregada sob demanda
  @OneToMany(() => UserEntity, (user) => user.unit)
  users?: UserEntity[];
}
