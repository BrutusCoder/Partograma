// =====================================================================
// Unit Service — Testes unitários
// =====================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitEntity } from './entities/unit.entity';

type MockRepository<T = unknown> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = unknown>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UnitService', () => {
  let service: UnitService;
  let repository: MockRepository<UnitEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitService,
        {
          provide: getRepositoryToken(UnitEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UnitService>(UnitService);
    repository = module.get<MockRepository<UnitEntity>>(getRepositoryToken(UnitEntity));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar todas as unidades', async () => {
      const units = [
        { id: '1', name: 'Unidade A', isActive: true },
        { id: '2', name: 'Unidade B', isActive: false },
      ];
      repository.find!.mockResolvedValue(units);

      const result = await service.findAll();
      expect(result).toEqual(units);
      expect(repository.find).toHaveBeenCalledWith({
        where: {},
        order: { name: 'ASC' },
      });
    });

    it('deve filtrar apenas unidades ativas', async () => {
      const units = [{ id: '1', name: 'Unidade A', isActive: true }];
      repository.find!.mockResolvedValue(units);

      const result = await service.findAll(true);
      expect(result).toEqual(units);
      expect(repository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma unidade pelo ID', async () => {
      const unit = { id: '1', name: 'Unidade A', isActive: true };
      repository.findOne!.mockResolvedValue(unit);

      const result = await service.findOne('1');
      expect(result).toEqual(unit);
    });

    it('deve lançar NotFoundException se unidade não existe', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne('inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar uma nova unidade', async () => {
      const dto = { name: 'Maternidade Central' };
      const created = { id: '1', name: 'Maternidade Central', externalId: null, isActive: true };

      repository.findOne!.mockResolvedValue(null); // sem conflito
      repository.create!.mockReturnValue(created);
      repository.save!.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Maternidade Central',
        externalId: null,
        isActive: true,
      });
    });

    it('deve lançar ConflictException se externalId já existe', async () => {
      const dto = { name: 'Unidade A', externalId: 'CNES123' };
      repository.findOne!.mockResolvedValue({ id: '2', externalId: 'CNES123' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('deve desativar a unidade (soft delete)', async () => {
      const unit = { id: '1', name: 'Unidade A', isActive: true };
      repository.findOne!.mockResolvedValue(unit);
      repository.save!.mockResolvedValue({ ...unit, isActive: false });

      await service.remove('1');
      expect(repository.save).toHaveBeenCalledWith({ ...unit, isActive: false });
    });
  });
});
