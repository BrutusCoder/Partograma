// =====================================================================
// Unit Entity — Unidade de saúde / maternidade
// Fonte: User.unitId (types.ts) + Keycloak user attribute "unit_id"
// Campos marcados (a confirmar) poderão ser renomeados/estendidos.
// =====================================================================

import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('units')
export class UnitEntity extends BaseEntity {
  /** Nome da unidade de saúde (a confirmar) */
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /** Código externo / CNES da unidade (a confirmar) */
  @Column({ name: 'external_id', type: 'varchar', length: 100, nullable: true, unique: true })
  externalId!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  // Relação inversa — carregada sob demanda
  // @OneToMany(() => UserEntity, (user) => user.unit)
  // users?: UserEntity[];
}
