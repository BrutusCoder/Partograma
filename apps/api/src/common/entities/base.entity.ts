// =====================================================================
// BaseEntity — Colunas comuns a todas as entidades do Partograma LCG
// PK UUID + timestamps automáticos (createdAt / updatedAt)
// =====================================================================

import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
