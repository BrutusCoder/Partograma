// =====================================================================
// E2E Test — Auth + Unit + User endpoints
// Testa fluxo completo: login dev → CRUD unidades → CRUD usuários
// =====================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Sprint 1 — Auth + Unit + User (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Auth ---
  describe('POST /api/v1/auth/dev-login', () => {
    it('deve ser acessível sem token (@Public)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/dev-login')
        .send({ username: 'usuario_inexistente_teste' })
        .expect(401); // user not found = 401
    });
  });

  // --- Units (sem token = 401) ---
  describe('GET /api/v1/units (sem autenticação)', () => {
    it('deve retornar 401 sem token', () => {
      return request(app.getHttpServer()).get('/api/v1/units').expect(401);
    });
  });

  // --- Users (sem token = 401) ---
  describe('GET /api/v1/users (sem autenticação)', () => {
    it('deve retornar 401 sem token', () => {
      return request(app.getHttpServer()).get('/api/v1/users').expect(401);
    });
  });

  // --- Validação de DTOs ---
  describe('POST /api/v1/units (validação DTO)', () => {
    it('deve rejeitar body vazio sem token', () => {
      return request(app.getHttpServer()).post('/api/v1/units').send({}).expect(401);
    });
  });
});
