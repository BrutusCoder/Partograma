// =====================================================================
// TypeORM DataSource — Configuração para CLI de migrations
// Usado por: typeorm migration:generate / run / revert
// NÃO é usado pelo NestJS em runtime (AppModule tem seu próprio config)
// =====================================================================
// Carrega .env da raiz do monorepo automaticamente via dotenv.
// Precisa ser executado com ts-node + tsconfig-paths para resolver
// os path aliases (@partograma/domain) — ver tsconfig.typeorm.json.
// =====================================================================

import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

// Lê variáveis do .env (carregado por dotenv/config)
const options: DataSourceOptions = {
  type: 'postgres',

  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'partograma',
  password: process.env.DB_PASSWORD || 'partograma_dev',
  database: process.env.DB_NAME || 'partograma_lcg',
  schema: process.env.DB_SCHEMA || 'lcg',

  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  logging: process.env.DB_LOGGING === 'true',

  // Entidades — glob relativo ao diretório deste arquivo
  entities: [path.join(__dirname, '..', 'modules', '**', '*.entity{.ts,.js}')],

  // Migrations — diretório padrão do projeto
  migrations: [path.join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',

  // NUNCA synchronize em migrations config — o schema é gerido pelas próprias migrations
  synchronize: false,
};

export default new DataSource(options);
