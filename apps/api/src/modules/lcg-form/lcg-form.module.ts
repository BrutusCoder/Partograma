import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LcgFormEntity } from './entities/lcg-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LcgFormEntity])],
  exports: [TypeOrmModule],
})
export class LcgFormModule {}
