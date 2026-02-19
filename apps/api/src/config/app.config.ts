import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.API_PORT || '4000', 10),
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  apiPrefix: 'api/v1',
}));

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'partograma',
  password: process.env.DB_PASSWORD || 'partograma_dev',
  name: process.env.DB_NAME || 'partograma_lcg',
  schema: process.env.DB_SCHEMA || 'lcg',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true',
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
}));

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'partograma-dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  keycloakUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
  keycloakRealm: process.env.KEYCLOAK_REALM || 'partograma',
  keycloakClientId: process.env.KEYCLOAK_CLIENT_ID || 'partograma-api',
  keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
}));
