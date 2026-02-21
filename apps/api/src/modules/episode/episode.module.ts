import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeEntity } from './entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeEntity])],
  exports: [TypeOrmModule],
})
export class EpisodeModule {}
