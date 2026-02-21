import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationSetEntity } from './entities/observation-set.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ObservationSetEntity])],
  exports: [TypeOrmModule],
})
export class ObservationModule {}
