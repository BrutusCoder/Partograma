// =====================================================================
// Episode Entity — Episódio de parto (Seção 1 - Cabeçalho do LCG)
// Fonte: libs/domain/src/types.ts → interface Episode
// =====================================================================

import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import {
  LabourOnsetType,
  RuptureStatus,
  EpisodeStatus,
} from '@partograma/domain';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { LcgFormEntity } from '../../lcg-form/entities/lcg-form.entity';

@Entity('episodes')
export class EpisodeEntity extends BaseEntity {
  // --- Dados da paciente ---

  @Column({ name: 'patient_name', type: 'varchar', length: 255 })
  patientName!: string;

  /** Prontuário / MRN (a confirmar formato) */
  @Column({ name: 'patient_id', type: 'varchar', length: 100, nullable: true })
  patientId!: string | null;

  @Column({ type: 'smallint' })
  age!: number;

  @Column({ type: 'smallint' })
  parity!: number;

  @Column({ name: 'gestational_age_weeks', type: 'smallint' })
  gestationalAgeWeeks!: number;

  @Column({ name: 'gestational_age_days', type: 'smallint' })
  gestationalAgeDays!: number;

  /** Fatores de risco — armazenados como array de texto no Postgres */
  @Column({ name: 'risk_factors', type: 'text', array: true, default: '{}' })
  riskFactors!: string[];

  // --- Trabalho de parto ---

  @Column({
    name: 'labour_onset_type',
    type: 'enum',
    enum: LabourOnsetType,
  })
  labourOnsetType!: LabourOnsetType;

  @Column({
    name: 'rupture_status',
    type: 'enum',
    enum: RuptureStatus,
  })
  ruptureStatus!: RuptureStatus;

  @Column({ name: 'rupture_at', type: 'timestamptz', nullable: true })
  ruptureAt!: Date | null;

  @Column({ name: 'active_labour_diagnosis_at', type: 'timestamptz' })
  activeLabourDiagnosisAt!: Date;

  // --- Status do episódio ---

  @Index('IDX_episodes_status')
  @Column({
    type: 'enum',
    enum: EpisodeStatus,
    default: EpisodeStatus.ACTIVE,
  })
  status!: EpisodeStatus;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @Column({ name: 'completion_reason', type: 'text', nullable: true })
  completionReason!: string | null;

  // --- Relações ---

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy!: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  creator?: UserEntity;

  @OneToMany(() => LcgFormEntity, (form) => form.episode)
  lcgForms?: LcgFormEntity[];
}
