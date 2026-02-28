import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitEntity } from './entities/unit.entity';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity])],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [TypeOrmModule, UnitService],
})
export class UnitModule {}
