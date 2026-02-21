// =====================================================================
// LcgForm Entity — Formulário LCG (Labour Care Guide)
// Cada episódio pode ter N formulários (encadeamento após 12h).
// Fonte: libs/domain/src/types.ts → interface LcgForm
// =====================================================================

import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { LcgFormStatus } from '@partograma/domain';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EpisodeEntity } from '../../episode/entities/episode.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('lcg_forms')
export class LcgFormEntity extends BaseEntity {
  // --- Vínculo com episódio ---

  @Index('IDX_lcg_forms_episode_id')
  @Column({ name: 'episode_id', type: 'uuid' })
  episodeId!: string;

  @ManyToOne(() => EpisodeEntity, (episode) => episode.lcgForms, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'episode_id' })
  episode?: EpisodeEntity;

  // --- Dados do formulário ---

  /** Número sequencial do form dentro do episódio (1, 2, 3…) */
  @Column({ name: 'form_number', type: 'smallint', default: 1 })
  formNumber!: number;

  /** true quando é um formulário encadeado (regra 12h) */
  @Column({ name: 'is_continued_form', type: 'boolean', default: false })
  isContinuedForm!: boolean;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt!: Date;

  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true })
  endedAt!: Date | null;

  @Index('IDX_lcg_forms_status')
  @Column({
    type: 'enum',
    enum: LcgFormStatus,
    default: LcgFormStatus.ACTIVE,
  })
  status!: LcgFormStatus;

  // --- Auditoria ---

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy!: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  creator?: UserEntity;
}
