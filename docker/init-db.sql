-- =============================================================================
-- Partograma LCG - Script de inicialização do PostgreSQL
-- Cria schemas e extensões necessárias
-- =============================================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schema principal do LCG
CREATE SCHEMA IF NOT EXISTS lcg;

-- Schema do Keycloak (será gerenciado pelo próprio Keycloak)
CREATE SCHEMA IF NOT EXISTS keycloak;

-- Comentários
COMMENT ON SCHEMA lcg IS 'Schema principal do Partograma LCG (WHO 2020)';
COMMENT ON SCHEMA keycloak IS 'Schema gerenciado pelo Keycloak para autenticação';

-- Garante que o usuário tem acesso aos schemas
GRANT ALL ON SCHEMA lcg TO partograma;
GRANT ALL ON SCHEMA keycloak TO partograma;

-- Define search_path padrão
ALTER USER partograma SET search_path TO lcg, public;
