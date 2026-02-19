import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Segurança
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Timezone'],
  });

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Partograma LCG API')
    .setDescription(
      'API REST para o Partograma WHO Labour Care Guide (LCG 2020). ' +
        'Gerencia episódios de parto, observações clínicas, alertas e auditoria.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e autorização')
    .addTag('episodes', 'Gerenciamento de episódios de parto (Seção 1)')
    .addTag('lcg-forms', 'Formulários LCG')
    .addTag('observations', 'Observações clínicas (Seções 2-7)')
    .addTag('alerts', 'Sistema de alertas clínicos')
    .addTag('audit', 'Trilha de auditoria')
    .addTag('users', 'Gerenciamento de usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 API rodando em http://localhost:${port}`);
  logger.log(`📖 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
