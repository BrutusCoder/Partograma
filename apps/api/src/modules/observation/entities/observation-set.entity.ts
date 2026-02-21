// =====================================================================
// ObservationSet Entity — Rodada de observações (Seções 2–6 do LCG)
// Fonte: libs/domain/src/types.ts → interface ObservationSet
// Cada LcgForm agrupa N rodadas; cada rodada gera 0..N alertas
// e pode ter 0..1 Plan (Seção 7, obrigatório quando hasAlert = true).
// =====================================================================

import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import {
  Section2Data,
  Section3Data,
  Section4Data,
  Section5Data,
  Section6Data,
  Section7Data,
} from '@partograma/domain';
import { BaseEntity } from '../../../common/entities/base.entity';
import { LcgFormEntity } from '../../lcg-form/entities/lcg-form.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('observation_sets')
export class ObservationSetEntity extends BaseEntity {
  // --- Vínculo com LcgForm ---

  @Index('IDX_observation_sets_lcg_form_id')
  @Column({ name: 'lcg_form_id', type: 'uuid' })
  lcgFormId!: string;

  @ManyToOne(() => LcgFormEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lcg_form_id' })
  lcgForm?: LcgFormEntity;

  // --- Momento do registro ---

  @Column({ name: 'recorded_at', type: 'timestamptz' })
  recordedAt!: Date;

  // --- Seções 2–6 (JSONB — dados clínicos estruturados) ---

  @Column({ type: 'jsonb' })
  section2!: Section2Data;

  @Column({ type: 'jsonb' })
  section3!: Section3Data;

  @Column({ type: 'jsonb' })
  section4!: Section4Data;

  @Column({ type: 'jsonb' })
  section5!: Section5Data;

  @Column({ type: 'jsonb' })
  section6!: Section6Data;

  /**
   * Seção 7 embutida (dados brutos da decisão compartilhada).
   * Para persistência estruturada, usar a entidade Plan (1:1).
   * Mantido por retrocompatibilidade com o fluxo de criação de observações.
   */
  @Column({ type: 'jsonb', nullable: true })
  section7!: Section7Data | null;

  // --- Flag de alerta ---

  @Column({ name: 'has_alert', type: 'boolean', default: false })
  hasAlert!: boolean;

  // --- Auditoria ---

  @Column({ name: 'recorded_by', type: 'uuid' })
  recordedBy!: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'recorded_by' })
  recorder?: UserEntity;

  // --- Relação inversa 1:1 com Plan ---
  // Importação lazy para evitar dependência circular
  // A relação é gerenciada pelo lado owning (PlanEntity.observationSetId)
}
