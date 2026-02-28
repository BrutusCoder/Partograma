// =====================================================================
// User Service — Testes unitários
// =====================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@partograma/domain';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UnitEntity } from '../unit/entities/unit.entity';
import { RequestUser } from '../auth/interfaces/jwt-payload.interface';

type MockRepository<T = unknown> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = unknown>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const adminUser: RequestUser = {
  id: 'admin-id',
  username: 'admin',
  email: 'admin@test.com',
  role: UserRole.ADMIN,
  unitId: null,
};

const nurseUser: RequestUser = {
  id: 'nurse-id',
  username: 'nurse',
  email: 'nurse@test.com',
  role: UserRole.ENFERMEIRO_OBSTETRA,
  unitId: 'unit-1',
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<UserEntity>;
  let unitRepository: MockRepository<UnitEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(UnitEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<UserEntity>>(getRepositoryToken(UserEntity));
    unitRepository = module.get<MockRepository<UnitEntity>>(getRepositoryToken(UnitEntity));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('ADMIN deve ver todos os usuários', async () => {
      const users = [{ id: '1', username: 'user1', unitId: 'unit-1' }];
      userRepository.find!.mockResolvedValue(users);

      const result = await service.findAll(adminUser);
      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['unit'],
        order: { firstName: 'ASC', lastName: 'ASC' },
      });
    });

    it('não-ADMIN deve ver apenas usuários da mesma unidade', async () => {
      const users = [{ id: '1', username: 'user1', unitId: 'unit-1' }];
      userRepository.find!.mockResolvedValue(users);

      const result = await service.findAll(nurseUser);
      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: { unitId: 'unit-1' },
        relations: ['unit'],
        order: { firstName: 'ASC', lastName: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const user = { id: '1', username: 'user1', unitId: 'unit-1' };
      userRepository.findOne!.mockResolvedValue(user);

      const result = await service.findOne('1', nurseUser);
      expect(result).toEqual(user);
    });

    it('deve lançar NotFoundException se usuário não existe', async () => {
      userRepository.findOne!.mockResolvedValue(null);

      await expect(service.findOne('inexistente', adminUser)).rejects.toThrow(NotFoundException);
    });

    it('não-ADMIN deve ser bloqueado ao acessar usuário de outra unidade', async () => {
      const user = { id: '1', username: 'user1', unitId: 'unit-2' }; // outra unidade
      userRepository.findOne!.mockResolvedValue(user);

      await expect(service.findOne('1', nurseUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    const createDto = {
      username: 'maria.silva',
      email: 'maria@hospital.com',
      firstName: 'Maria',
      lastName: 'Silva',
      role: UserRole.ENFERMEIRO_OBSTETRA,
      unitId: 'unit-1',
    };

    it('deve criar um novo usuário', async () => {
      const created = { id: '1', ...createDto, isActive: true, keycloakSub: null };

      userRepository
        .findOne!.mockResolvedValueOnce(null) // username check
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce({ ...created, unit: { id: 'unit-1', name: 'Unidade A' } }); // return with relations
      unitRepository.findOne!.mockResolvedValue({ id: 'unit-1', name: 'Unidade A' });
      userRepository.create!.mockReturnValue(created);
      userRepository.save!.mockResolvedValue(created);

      const result = await service.create(createDto, adminUser);
      expect(result.username).toBe('maria.silva');
    });

    it('deve lançar ConflictException se username já existe', async () => {
      userRepository.findOne!.mockResolvedValueOnce({ id: '2', username: 'maria.silva' });

      await expect(service.create(createDto, adminUser)).rejects.toThrow(ConflictException);
    });

    it('não-ADMIN deve ter unitId forçado para o próprio tenant', async () => {
      const created = {
        id: '1',
        ...createDto,
        unitId: 'unit-1',
        isActive: true,
        keycloakSub: null,
      };

      userRepository
        .findOne!.mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(created);
      unitRepository.findOne!.mockResolvedValue({ id: 'unit-1', name: 'Unidade A' });
      userRepository.create!.mockReturnValue(created);
      userRepository.save!.mockResolvedValue(created);

      await service.create({ ...createDto, unitId: 'unit-999' }, nurseUser);

      // Deve ter criado com unitId do nurseUser, não o do DTO
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ unitId: 'unit-1' }),
      );
    });
  });

  describe('remove', () => {
    it('deve desativar o usuário', async () => {
      const user = { id: '1', username: 'user1', unitId: null, isActive: true };
      userRepository.findOne!.mockResolvedValue(user);
      userRepository.save!.mockResolvedValue({ ...user, isActive: false });

      await service.remove('1', adminUser);
      expect(userRepository.save).toHaveBeenCalledWith({ ...user, isActive: false });
    });

    it('não deve permitir desativar a si mesmo', async () => {
      const user = { id: 'admin-id', username: 'admin', unitId: null, isActive: true };
      userRepository.findOne!.mockResolvedValue(user);

      await expect(service.remove('admin-id', adminUser)).rejects.toThrow(ForbiddenException);
    });
  });
});
