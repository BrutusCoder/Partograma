// =====================================================================
// Plan Entity — Seção 7: Tomada de Decisão Compartilhada (LCG 2020)
//
// Fonte: Plano_Implementacao §3.1 — "Plan: Seção 7 (avaliação e plano)"
// Regras:
//   • Plan é **obrigatório quando há alerta** (ObservationSet.hasAlert)
//   • Relacionamento **1:1** com ObservationSet (unique constraint)
//   • **Imutável** — correções via AuditLog/adendo (nunca UPDATE direto)
//
// Ref. domínio: libs/domain/src/types.ts → interface Plan
// =====================================================================

import { Entity, Column, OneToOne, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ClinicalStatus, ProgressStatus } from '@partograma/domain';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ObservationSetEntity } from '../../observation/entities/observation-set.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('plans')
export class PlanEntity extends BaseEntity {
  // --- Vínculo 1:1 com ObservationSet ---

  @Index('IDX_plans_observation_set_id', { unique: true })
  @Column({ name: 'observation_set_id', type: 'uuid', unique: true })
  observationSetId!: string;

  @OneToOne(() => ObservationSetEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'observation_set_id' })
  observationSet?: ObservationSetEntity;

  // --- Dados da Seção 7 ---

  /** Avaliação clínica global (texto livre) */
  @Column({ type: 'text' })
  assessment!: string;

  /** Status materno — OK ou CONCERNS (a confirmar) */
  @Column({
    name: 'maternal_status',
    type: 'enum',
    enum: ClinicalStatus,
    nullable: true,
  })
  maternalStatus!: ClinicalStatus | null;

  @Column({ name: 'maternal_status_description', type: 'text', nullable: true })
  maternalStatusDescription!: string | null;

  /** Status fetal — OK ou CONCERNS (a confirmar) */
  @Column({
    name: 'fetal_status',
    type: 'enum',
    enum: ClinicalStatus,
    nullable: true,
  })
  fetalStatus!: ClinicalStatus | null;

  @Column({ name: 'fetal_status_description', type: 'text', nullable: true })
  fetalStatusDescription!: string | null;

  /** Progresso do trabalho de parto */
  @Column({
    name: 'progress_status',
    type: 'enum',
    enum: ProgressStatus,
    nullable: true,
  })
  progressStatus!: ProgressStatus | null;

  @Column({ name: 'progress_evidence', type: 'text', nullable: true })
  progressEvidence!: string | null;

  /** Plano de ação definido na decisão compartilhada */
  @Column({ type: 'text' })
  plan!: string;

  /** Horário agendado para reavaliação */
  @Column({ name: 'reassessment_time', type: 'timestamptz' })
  reassessmentTime!: Date;

  // --- Auditoria ---

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy!: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  creator?: UserEntity;
}
