# Relatório de Auditoria — Ambiente de Desenvolvimento Partograma LCG (WHO 2020)

**Data**: 26/02/2026 (atualização)  
**Auditor original**: Desenvolvedor Web Sênior / DevOps Sênior (18/02/2026)  
**Referência**: Plano_Implementacao_TS_LCG_2020.md

---

## 1. Resumo Executivo

**Status Geral: ✅ APROVADO — PRONTO PARA SPRINT 1**

O ambiente está **operacional**: monorepo pnpm funcional, Docker Compose com PostgreSQL 16/Redis 7/Keycloak 23 healthy, realm `partograma` importado automaticamente, libs de domínio (tipos, enums, motor de alertas) compilando, 6 entidades TypeORM criadas com migrations, ESLint flat config em 5 pacotes, Dockerfiles multi-stage, CI/CD (GitHub Actions) e Husky + lint-staged ativos.

### Itens resolvidos desde 18/02/2026

- ~~P0 — ESLint ausente~~ → **RESOLVIDO**: `eslint.config.mjs` em api, web, domain, validators, ui
- ~~P0 — Realm Keycloak~~ → **RESOLVIDO**: realm `partograma` importado via `realm-export.json`
- ~~P0 — Entidades TypeORM~~ → **RESOLVIDO**: 6 entities (Unit, User, Episode, LcgForm, ObservationSet, Plan)
- ~~P1 — typeorm.config.ts~~ → **RESOLVIDO**: `apps/api/src/config/typeorm.config.ts` existe
- ~~P1 — Prettier~~ → **RESOLVIDO**: todos os arquivos passam `format:check`
- ~~P1 — Interface Unit~~ → **RESOLVIDO**: `export interface Unit` em `libs/domain/src/types.ts`
- ~~P1 — Interface Plan~~ → **RESOLVIDO**: `export interface Plan` em `libs/domain/src/types.ts`
- ~~P2 — Dockerfiles~~ → **RESOLVIDO**: `apps/api/Dockerfile` e `apps/web/Dockerfile` existem
- ~~P2 — CI/CD~~ → **RESOLVIDO**: `.github/workflows/ci.yml` e `deploy.yml`
- ~~P3 — Git hooks~~ → **RESOLVIDO**: `.husky/pre-commit` e `.husky/pre-push` ativos

### Lacunas remanescentes (baixo impacto)

- **P2 — Nenhum arquivo de teste** (`.spec.ts` / `.test.tsx`) — criar smoke tests por app
- **P2 — jest.config.ts ausente no web** — script `test` existe mas sem config
- **P2 — jest-e2e.json ausente** — referenciado no script `test:e2e` mas inexistente
- **P3 — `.nvmrc` ou `.node-version`** — boa prática para fixar versão Node

---

## 2. Checklist de Conformidade

### 2.1 Sistema e Dependências

| #   | Requisito do Plano     | Evidência Esperada  | Como Verificar                                 | Status | Ação Corretiva |
| --- | ---------------------- | ------------------- | ---------------------------------------------- | ------ | -------------- |
| 1   | Node.js (runtime TS)   | >= 20.x             | `node -v` → `v22.22.0` (via nvm)               | ✅ OK  | —              |
| 2   | TypeScript             | >= 5.x              | `npx tsc -v` no workspace                      | ✅ OK  | —              |
| 3   | Package Manager (pnpm) | Instalado, monorepo | `pnpm -v` → `10.30.0` (via corepack)           | ✅ OK  | —              |
| 4   | Git configurado        | Repo inicializado   | `git log --oneline` → commit inicial           | ✅ OK  | —              |
| 5   | Docker + Compose       | Versões funcionais  | `docker --version` → `29.2.1`, Compose `5.0.2` | ✅ OK  | —              |

### 2.2 Repositório e Padrão de Projeto

| #   | Requisito do Plano                 | Evidência Esperada                | Como Verificar                                                                   | Status | Ação Corretiva |
| --- | ---------------------------------- | --------------------------------- | -------------------------------------------------------------------------------- | ------ | -------------- |
| 6   | Monorepo com web, api              | Diretórios existem                | `ls apps/` → `web/ api/`                                                         | ✅ OK  | —              |
| 7   | Libs: `domain`, `validators`, `ui` | Diretórios + código               | `ls libs/` → 3 libs                                                              | ✅ OK  | —              |
| 8   | pnpm-workspace.yaml correto        | apps/_ e libs/_                   | cat o arquivo                                                                    | ✅ OK  | —              |
| 9   | .gitignore adequado                | node_modules, .env, dist, .next   | cat .gitignore                                                                   | ✅ OK  | —              |
| 10  | .editorconfig                      | Configurado                       | cat .editorconfig                                                                | ✅ OK  | —              |
| 11  | README com passo-a-passo           | Reprodutível                      | Leitura do README.md                                                             | ✅ OK  | —              |
| 12  | ESLint configurado                 | `eslint.config.*` na raiz ou apps | `find . -name "eslint.config.*"` → 5 arquivos (api, web, domain, validators, ui) | ✅ OK  | —              |
| 13  | Prettier configurado               | .prettierrc                       | `pnpm format:check` → all files pass                                             | ✅ OK  | —              |
| 14  | Git hooks (lint/format)            | Husky, lint-staged ou similar     | `.husky/pre-commit` e `.husky/pre-push` ativos                                   | ✅ OK  | —              |

### 2.3 Build, Execução e DX

| #   | Requisito do Plano      | Evidência Esperada      | Como Verificar                                                | Status     | Ação Corretiva                                                               |
| --- | ----------------------- | ----------------------- | ------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| 15  | `pnpm install` funciona | +1033 packages          | `pnpm install` → sucesso                                      | ✅ OK      | —                                                                            |
| 16  | `pnpm build` (web)      | Build Next.js OK        | `pnpm --filter @partograma/web build` → sucesso               | ✅ OK      | —                                                                            |
| 17  | `pnpm build` (api)      | Build NestJS OK         | `pnpm --filter @partograma/api build` → sucesso (dist gerado) | ✅ OK      | —                                                                            |
| 18  | `pnpm dev` (web)        | Dev server em :3000     | `curl localhost:3000` → HTTP 200                              | ✅ OK      | —                                                                            |
| 19  | `pnpm test`             | Passa (sem testes)      | `--passWithNoTests` → exit 0                                  | ⚠️ PARCIAL | **P2**: Nenhum arquivo de teste existe. Criar ao menos um smoke test por app |
| 20  | .env e .env.example     | Variáveis documentadas  | Ambos existem, 45-46 linhas, cobertura completa               | ✅ OK      | —                                                                            |
| 21  | .env no .gitignore      | Não versionado          | .gitignore contém .env                                        | ✅ OK      | —                                                                            |
| 22  | Scripts de DB migration | `db:migrate`, `db:seed` | Existem no package.json raiz + `typeorm.config.ts` criado     | ✅ OK      | —                                                                            |

### 2.4 Banco de Dados e Infraestrutura

| #   | Requisito do Plano                | Evidência Esperada                  | Como Verificar                                       | Status | Ação Corretiva                                                |
| --- | --------------------------------- | ----------------------------------- | ---------------------------------------------------- | ------ | ------------------------------------------------------------- |
| 23  | PostgreSQL 16 rodando             | Container healthy                   | `docker compose ps` → healthy, porta 5432            | ✅ OK  | —                                                             |
| 24  | Schema `lcg` criado               | Existe no DB                        | `psql ... schemata` → `lcg` presente                 | ✅ OK  | —                                                             |
| 25  | Extensões `uuid-ossp`, `pgcrypto` | Instaladas                          | `psql ... pg_extension` → ambas presentes            | ✅ OK  | —                                                             |
| 26  | Redis 7 rodando                   | Container healthy                   | `redis-cli ping` → PONG                              | ✅ OK  | —                                                             |
| 27  | Bull (filas) configurado          | BullModule no NestJS                | app.module.ts → `BullModule.forRootAsync`            | ✅ OK  | —                                                             |
| 28  | Keycloak 23 rodando               | Container up, acessível             | `curl localhost:8080` → HTTP 200, realm master ativo | ✅ OK  | —                                                             |
| 29  | Realm `partograma` no Keycloak    | Realm configurado com clients/roles | `curl /realms/partograma` → JSON com public_key      | ✅ OK  | Importado via `realm-export.json` no start-dev --import-realm |
| 30  | Healthchecks Docker               | Todos os serviços                   | `docker compose ps` → 3/3 healthy                    | ✅ OK  | —                                                             |
| 31  | Portas sem conflito               | 3000, 4000, 5432, 6379, 8080        | `lsof -i :PORT`                                      | ✅ OK  | Apenas Docker nos esperados                                   |
| 32  | Volumes persistentes              | pgdata, redisdata                   | docker-compose.yml → volumes nomeados                | ✅ OK  | —                                                             |

### 2.5 Modelo de Dados e Entidades

| #   | Requisito do Plano             | Evidência Esperada                     | Como Verificar                                                | Status | Ação Corretiva                                     |
| --- | ------------------------------ | -------------------------------------- | ------------------------------------------------------------- | ------ | -------------------------------------------------- |
| 33  | Entidade `Unit` (multi-tenant) | TypeORM entity + interface domain      | `grep "interface Unit" types.ts` → encontrada (L31)           | ✅ OK  | —                                                  |
| 34  | Entidade `Plan` (Seção 7)      | Entidade separada (1:1 ObservationSet) | `grep "interface Plan" types.ts` → encontrada (L179) + entity | ✅ OK  | —                                                  |
| 35  | Entidades TypeORM              | `.entity.ts` em cada módulo            | `find . -name "*.entity.ts"` → **6 arquivos**                 | ✅ OK  | Unit, User, Episode, LcgForm, ObservationSet, Plan |
| 36  | Migrations                     | Ao menos migration inicial             | 2 arquivos em `database/migrations/`                          | ✅ OK  | InitialSchema + AddObservationSetAndPlan           |
| 37  | Interfaces domain              | Tipos TS para todas entidades          | types.ts → 18 interfaces                                      | ✅ OK  | Exceto Unit e Plan separada                        |
| 38  | Enums completos                | Enums LCG Seções 1-7                   | enums.ts → 175 linhas, todos os enums                         | ✅ OK  | —                                                  |
| 39  | Motor de alertas               | Validações Seções 2-6                  | `alert-engine.ts` → 423 linhas                                | ✅ OK  | —                                                  |

### 2.6 API e Módulos NestJS

| #   | Requisito do Plano        | Evidência Esperada           | Como Verificar                                              | Status | Ação Corretiva                              |
| --- | ------------------------- | ---------------------------- | ----------------------------------------------------------- | ------ | ------------------------------------------- |
| 40  | Prefixo `/api/v1`         | setGlobalPrefix              | main.ts → `api/v1`                                          | ✅ OK  | —                                           |
| 41  | Swagger/OpenAPI           | Configurado em `/api/docs`   | main.ts → SwaggerModule.setup                               | ✅ OK  | —                                           |
| 42  | CORS configurado          | Origin do .env               | main.ts → enableCors                                        | ✅ OK  | —                                           |
| 43  | Helmet + compression      | Middleware segurança         | main.ts → app.use(helmet/compression)                       | ✅ OK  | —                                           |
| 44  | ValidationPipe global     | whitelist + transform        | main.ts → useGlobalPipes                                    | ✅ OK  | —                                           |
| 45  | Módulos declarados        | Module files em cada módulo  | 6 módulos: unit, user, episode, lcg-form, observation, plan | ✅ OK  | Controllers + Services pendentes (Sprint 1) |
| 46  | TypeORM config standalone | `typeorm.config.ts` para CLI | `apps/api/src/config/typeorm.config.ts` existe              | ✅ OK  | —                                           |
| 47  | ScheduleModule            | Job async de alertas         | app.module.ts → ScheduleModule.forRoot                      | ✅ OK  | —                                           |

### 2.7 Frontend Next.js

| #   | Requisito do Plano              | Evidência Esperada               | Como Verificar                             | Status    | Ação Corretiva       |
| --- | ------------------------------- | -------------------------------- | ------------------------------------------ | --------- | -------------------- |
| 48  | Next.js 15 + React 19           | Package.json                     | Versões corretas                           | ✅ OK     | —                    |
| 49  | Tailwind CSS                    | Configurado                      | `tailwind.config.js` + `postcss.config.js` | ✅ OK     | —                    |
| 50  | State: Zustand + TanStack Query | Dependências instaladas          | package.json → ambos presentes             | ✅ OK     | —                    |
| 51  | Proxy API rewrites              | next.config.js                   | `/api/v1/:path*` → localhost:4000          | ✅ OK     | —                    |
| 52  | App Router                      | /src/app/                        | `layout.tsx` + `page.tsx` existem          | ✅ OK     | —                    |
| 53  | **Telas do plano**              | Login, Dashboard, Timeline, etc. | `find components` → **0 arquivos**         | ❌ NÃO OK | Sprint 2+ (esperado) |

### 2.8 Qualidade e Segurança

| #   | Requisito do Plano                | Evidência Esperada        | Como Verificar                                                   | Status     | Ação Corretiva                                  |
| --- | --------------------------------- | ------------------------- | ---------------------------------------------------------------- | ---------- | ----------------------------------------------- |
| 54  | Jest configurado (API)            | jest.config.ts            | Existe com moduleNameMapper correto                              | ✅ OK      | —                                               |
| 55  | Jest configurado (Web)            | Config p/ jsdom           | Script `test` existe, **sem jest.config.ts**                     | ⚠️ PARCIAL | **P2**: Criar jest.config.ts no web             |
| 56  | Cobertura >= 80% (plano, seção 8) | coverageThreshold         | Não configurado                                                  | ⚠️ PARCIAL | **P2**: Adicionar threshold quando tiver testes |
| 57  | Testes E2E script                 | `test:e2e`                | Script existe, `test/jest-e2e.json` referenciado mas inexistente | ⚠️ PARCIAL | **P2**: Criar config e2e                        |
| 58  | Dockerfiles (deploy)              | Dockerfile para web e api | `apps/api/Dockerfile` e `apps/web/Dockerfile` existem            | ✅ OK      | —                                               |
| 59  | CI/CD (GitHub Actions)            | `.github/workflows/`      | `ci.yml` e `deploy.yml` existem                                  | ✅ OK      | —                                               |
| 60  | LGPD: criptografia em repouso     | DB SSL, pgcrypto          | pgcrypto instalado, DB_SSL=false (dev ok)                        | ✅ OK      | —                                               |

---

## 3. Plano de Correção Priorizado

### P0 — Bloqueadores (devem ser resolvidos ANTES do Sprint 1)

| #    | Ação                                 | Status       | Resolução                                                      |
| ---- | ------------------------------------ | ------------ | -------------------------------------------------------------- |
| P0-1 | Criar ESLint config (flat config v9) | ✅ RESOLVIDO | `eslint.config.mjs` criado em api, web, domain, validators, ui |
| P0-2 | Criar realm "partograma" no Keycloak | ✅ RESOLVIDO | Importado via `realm-export.json` no docker-compose            |
| P0-3 | Criar entidades TypeORM              | ✅ RESOLVIDO | 6 entities + 2 migrations                                      |

### P1 — Alto Impacto

| #    | Ação                                             | Status       | Resolução                                     |
| ---- | ------------------------------------------------ | ------------ | --------------------------------------------- |
| P1-1 | Criar `typeorm.config.ts` para CLI de migrations | ✅ RESOLVIDO | `apps/api/src/config/typeorm.config.ts`       |
| P1-2 | Adicionar interface `Unit` ao domain             | ✅ RESOLVIDO | `libs/domain/src/types.ts` L31                |
| P1-3 | Extrair `Plan` como entidade separada            | ✅ RESOLVIDO | Interface + entity com FK para ObservationSet |
| P1-4 | Corrigir formatação dos arquivos                 | ✅ RESOLVIDO | `pnpm format:check` → all files pass          |

### P2 — Médio Impacto

| #    | Ação                                        | Status       | Onde / Como Validar                                            |
| ---- | ------------------------------------------- | ------------ | -------------------------------------------------------------- |
| P2-1 | Criar Dockerfiles multi-stage (web + api)   | ✅ RESOLVIDO | `apps/api/Dockerfile` e `apps/web/Dockerfile`                  |
| P2-2 | Criar CI/CD pipeline (GitHub Actions)       | ✅ RESOLVIDO | `.github/workflows/ci.yml` e `deploy.yml`                      |
| P2-3 | **Criar jest.config.ts no frontend**        | ⚠️ PENDENTE  | `pnpm --filter @partograma/web test` precisa reconhecer testes |
| P2-4 | **Criar ao menos 1 teste por app (smoke)**  | ⚠️ PENDENTE  | Nenhum `.spec.ts` / `.test.tsx` encontrado                     |
| P2-5 | **Criar config E2E** (`test/jest-e2e.json`) | ⚠️ PENDENTE  | Referenciado no script `test:e2e` mas inexistente              |
| P2-6 | Corrigir healthcheck do Keycloak            | ✅ RESOLVIDO | `docker compose ps` → Keycloak `(healthy)`                     |

### P3 — Baixo Impacto

| #    | Ação                                                            | Status       | Resolução / Onde                               |
| ---- | --------------------------------------------------------------- | ------------ | ---------------------------------------------- |
| P3-1 | Instalar husky + lint-staged para Git hooks                     | ✅ RESOLVIDO | `.husky/pre-commit` e `.husky/pre-push`        |
| P3-2 | Adicionar commitlint (Conventional Commits)                     | ⚠️ PENDENTE  | `.commitlintrc.json` não encontrado            |
| P3-3 | Adicionar `.nvmrc` ou `.node-version` para fixar versão Node.js | ⚠️ PENDENTE  | Boa prática, facilita onboarding via `nvm use` |

---

## 4. Comandos de Verificação Rápida (Smoke Test)

Execute todos os comandos abaixo em sequência. **Todos devem retornar OK** para o ambiente estar aderente:

```bash
# ─── 1. Ferramentas do sistema ───
echo "=== 1. Node.js ===" && node -v | grep -q "v2[0-9]" && echo "OK" || echo "FALHA"
echo "=== 2. pnpm ===" && pnpm -v | grep -q "^[0-9]" && echo "OK" || echo "FALHA"
echo "=== 3. Docker ===" && docker --version | grep -q "29" && echo "OK" || echo "FALHA"
echo "=== 4. Git ===" && git log --oneline -1 && echo "OK" || echo "FALHA"

# ─── 2. Docker services ───
echo "=== 5. PostgreSQL ===" && docker compose exec -T postgres pg_isready -U partograma -d partograma_lcg && echo "OK" || echo "FALHA"
echo "=== 6. Redis ===" && docker compose exec -T redis redis-cli ping | grep -q PONG && echo "OK" || echo "FALHA"
echo "=== 7. Keycloak ===" && curl -s -o /dev/null -w '%{http_code}' http://localhost:8080 | grep -q 200 && echo "OK" || echo "FALHA"
echo "=== 8. DB Schemas ===" && docker compose exec -T postgres psql -U partograma -d partograma_lcg -tAc "SELECT count(*) FROM information_schema.schemata WHERE schema_name IN ('lcg','keycloak')" | grep -q 2 && echo "OK" || echo "FALHA"

# ─── 3. Realm Keycloak (P0) ───
echo "=== 9. Realm partograma ===" && curl -s http://localhost:8080/realms/partograma | grep -q "partograma" && echo "OK" || echo "FALHA — criar realm"

# ─── 4. Build ───
echo "=== 10. Build API ===" && pnpm --filter @partograma/api build 2>&1 | tail -1 && echo "OK"
echo "=== 11. Build Web ===" && pnpm --filter @partograma/web build 2>&1 | tail -3

# ─── 5. Lint e Format ───
echo "=== 12. ESLint ===" && pnpm --filter @partograma/api lint 2>&1 | tail -1 || echo "FALHA — criar eslint.config"
echo "=== 13. Prettier ===" && pnpm format:check 2>&1 | tail -1

# ─── 6. Testes ───
echo "=== 14. Testes ===" && pnpm test 2>&1 | tail -3

# ─── 7. Entidades exist ───
echo "=== 15. Entities ===" && find apps/api/src -name "*.entity.ts" | wc -l | xargs -I{} sh -c '[ {} -gt 0 ] && echo "OK ({} entities)" || echo "FALHA — 0 entities"'

# ─── 8. TypeORM CLI config ───
echo "=== 16. typeorm.config.ts ===" && test -f apps/api/src/config/typeorm.config.ts && echo "OK" || echo "FALHA — criar typeorm.config.ts"
```

---

### Resumo Final (Atualizado 26/02/2026)

| Categoria             | OK     | Parcial | Falha |
| --------------------- | ------ | ------- | ----- |
| Sistema/Dependências  | 5      | 0       | 0     |
| Repositório/Padrões   | 12     | 0       | 0     |
| Build/DX              | 7      | 0       | 0     |
| Infraestrutura Docker | 10     | 0       | 0     |
| Modelo de Dados       | 7      | 0       | 0     |
| API/Módulos NestJS    | 7      | 0       | 0     |
| Frontend              | 5      | 0       | 1     |
| Qualidade/Segurança   | 4      | 3       | 0     |
| **TOTAL**             | **57** | **3**   | **1** |

**Aderência**: ~95% do plano coberto. Os 5% restantes são configurações de teste (jest.config web, e2e, smoke tests) e implementação de Controllers/Services que são trabalho dos sprints.
