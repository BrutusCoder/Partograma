// =====================================================================
// Unit Service — CRUD para unidades hospitalares (tenant)
// =====================================================================

import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitEntity } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  private readonly logger = new Logger(UnitService.name);

  constructor(
    @InjectRepository(UnitEntity)
    private readonly unitRepository: Repository<UnitEntity>,
  ) {}

  /**
   * Lista todas as unidades. Pode filtrar por status ativo.
   */
  async findAll(onlyActive = false): Promise<UnitEntity[]> {
    const where = onlyActive ? { isActive: true } : {};
    return this.unitRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  /**
   * Busca uma unidade pelo ID.
   */
  async findOne(id: string): Promise<UnitEntity> {
    const unit = await this.unitRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException(`Unidade com ID "${id}" não encontrada`);
    }
    return unit;
  }

  /**
   * Cria uma nova unidade hospitalar.
   */
  async create(dto: CreateUnitDto): Promise<UnitEntity> {
    // Verifica unicidade do externalId se informado
    if (dto.externalId) {
      const existing = await this.unitRepository.findOne({
        where: { externalId: dto.externalId },
      });
      if (existing) {
        throw new ConflictException(`Já existe uma unidade com código externo "${dto.externalId}"`);
      }
    }

    const unit = this.unitRepository.create({
      name: dto.name,
      externalId: dto.externalId ?? null,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.unitRepository.save(unit);
    this.logger.log(`Unidade criada: ${saved.name} (${saved.id})`);
    return saved;
  }

  /**
   * Atualiza uma unidade existente.
   */
  async update(id: string, dto: UpdateUnitDto): Promise<UnitEntity> {
    const unit = await this.findOne(id);

    // Verifica unicidade do externalId se alterado
    if (dto.externalId && dto.externalId !== unit.externalId) {
      const existing = await this.unitRepository.findOne({
        where: { externalId: dto.externalId },
      });
      if (existing) {
        throw new ConflictException(`Já existe uma unidade com código externo "${dto.externalId}"`);
      }
    }

    Object.assign(unit, dto);
    const saved = await this.unitRepository.save(unit);
    this.logger.log(`Unidade atualizada: ${saved.name} (${saved.id})`);
    return saved;
  }

  /**
   * Remove (soft delete via isActive = false) uma unidade.
   */
  async remove(id: string): Promise<void> {
    const unit = await this.findOne(id);
    unit.isActive = false;
    await this.unitRepository.save(unit);
    this.logger.log(`Unidade desativada: ${unit.name} (${unit.id})`);
  }
}
