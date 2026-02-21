# Relatório de Auditoria — Ambiente de Desenvolvimento Partograma LCG (WHO 2020)

**Data**: 18/02/2026  
**Auditor**: Desenvolvedor Web Sênior / DevOps Sênior  
**Referência**: Plano_Implementacao_TS_LCG_2020.md

---

## 1. Resumo Executivo

**Status Geral: ⚠️ APROVADO COM RESSALVAS**

O ambiente possui uma **base sólida**: monorepo pnpm funcional, Docker Compose com PostgreSQL/Redis/Keycloak operacionais, libs de domínio com tipos e motor de alertas, build do frontend (Next.js) e backend (NestJS) passando. Porém há **10 lacunas críticas a impactantes** que precisam ser corrigidas antes de iniciar o desenvolvimento do Sprint 1:

- **P0 — ESLint completamente ausente** (nenhum `eslint.config.*` existe no projeto)
- **P0 — Realm "partograma" não configurado no Keycloak** (API e frontend dependem dele)
- **P0 — Nenhuma entidade TypeORM criada** (todos os 7 módulos estão vazios)
- **P1 — Nenhum arquivo `typeorm.config.ts`** para migrations (script existe mas o config não)
- **P1 — Prettier com 10 arquivos fora do padrão**
- **P1 — Entidade `Unit` ausente na lib domain** (multi-tenant exigido pelo plano)
- **P1 — Interface `Plan` (Seção 7) ausente** como entidade separada
- **P2 — Nenhum Dockerfile para web/api** (deploy Docker/K8s previsto no plano)
- **P2 — CI/CD ausente** (`.github/workflows/` não existe)
- **P3 — Nenhum Git hook ativo** (Husky removido, nenhum substituto)

---

## 2. Checklist de Conformidade

### 2.1 Sistema e Dependências

| #   | Requisito do Plano     | Evidência Esperada  | Como Verificar                                 | Status                            | Ação Corretiva |
| --- | ---------------------- | ------------------- | ---------------------------------------------- | --------------------------------- | -------------- | --- |
| 1   | Node.js (runtime TS)   | >= 20.x             | `node -v` → `v22.16.0`                         | ✅ OK                             | —              |
| 2   | TypeScript             | >= 5.x              | `npx tsc -v` no workspace                      | `typescript ^5.7` no package.json | ✅ OK          | —   |
| 3   | Package Manager (pnpm) | Instalado, monorepo | `pnpm -v` → `10.30.0`                          | ✅ OK                             | —              |
| 4   | Git configurado        | Repo inicializado   | `git log --oneline` → commit inicial           | ✅ OK                             | —              |
| 5   | Docker + Compose       | Versões funcionais  | `docker --version` → `29.2.0`, Compose `5.0.2` | ✅ OK                             | —              |

### 2.2 Repositório e Padrão de Projeto

| #   | Requisito do Plano                 | Evidência Esperada                | Como Verificar                                        | Status     | Ação Corretiva                                             |
| --- | ---------------------------------- | --------------------------------- | ----------------------------------------------------- | ---------- | ---------------------------------------------------------- |
| 6   | Monorepo com web, api              | Diretórios existem                | `ls apps/` → `web/ api/`                              | ✅ OK      | —                                                          |
| 7   | Libs: `domain`, `validators`, `ui` | Diretórios + código               | `ls libs/` → 3 libs                                   | ✅ OK      | —                                                          |
| 8   | pnpm-workspace.yaml correto        | apps/_ e libs/_                   | cat o arquivo                                         | ✅ OK      | —                                                          |
| 9   | .gitignore adequado                | node_modules, .env, dist, .next   | cat .gitignore                                        | ✅ OK      | —                                                          |
| 10  | .editorconfig                      | Configurado                       | cat .editorconfig                                     | ✅ OK      | —                                                          |
| 11  | README com passo-a-passo           | Reprodutível                      | Leitura do README.md                                  | ✅ OK      | —                                                          |
| 12  | **ESLint configurado**             | `eslint.config.*` na raiz ou apps | `find . -name "eslint.config.*"` fora de node_modules | ❌ NÃO OK  | **P0**: Criar `eslint.config.mjs` na raiz e/ou em cada app |
| 13  | Prettier configurado               | .prettierrc                       | cat .prettierrc                                       | ⚠️ PARCIAL | **P1**: 10 arquivos fora do padrão (`pnpm format`)         |
| 14  | **Git hooks (lint/format)**        | Husky, lint-staged ou similar     | Nenhum hook ativo encontrado                          | ❌ NÃO OK  | **P3**: Instalar husky + lint-staged                       |

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
| 22  | Scripts de DB migration | `db:migrate`, `db:seed` | Existem no package.json raiz                                  | ⚠️ PARCIAL | **P1**: `typeorm.config.ts` referenciado mas inexistente                     |

### 2.4 Banco de Dados e Infraestrutura

| #   | Requisito do Plano                 | Evidência Esperada                  | Como Verificar                                         | Status     | Ação Corretiva                                                     |
| --- | ---------------------------------- | ----------------------------------- | ------------------------------------------------------ | ---------- | ------------------------------------------------------------------ |
| 23  | PostgreSQL 16 rodando              | Container healthy                   | `docker compose ps` → healthy, porta 5432              | ✅ OK      | —                                                                  |
| 24  | Schema `lcg` criado                | Existe no DB                        | `psql ... schemata` → `lcg` presente                   | ✅ OK      | —                                                                  |
| 25  | Extensões `uuid-ossp`, `pgcrypto`  | Instaladas                          | `psql ... pg_extension` → ambas presentes              | ✅ OK      | —                                                                  |
| 26  | Redis 7 rodando                    | Container healthy                   | `redis-cli ping` → PONG                                | ✅ OK      | —                                                                  |
| 27  | Bull (filas) configurado           | BullModule no NestJS                | app.module.ts → `BullModule.forRootAsync`              | ✅ OK      | —                                                                  |
| 28  | Keycloak 23 rodando                | Container up, acessível             | `curl localhost:8080` → HTTP 200, realm master ativo   | ✅ OK      | —                                                                  |
| 29  | **Realm `partograma` no Keycloak** | Realm configurado com clients/roles | `curl /realms/partograma` → **"Realm does not exist"** | ❌ NÃO OK  | **P0**: Criar realm, clients, roles via Admin API ou import        |
| 30  | Healthchecks Docker                | Todos os serviços                   | `docker compose ps`                                    | ⚠️ PARCIAL | Keycloak `unhealthy` (healthcheck TCP falho, mas serviço funciona) |
| 31  | Portas sem conflito                | 3000, 4000, 5432, 6379, 8080        | `lsof -i :PORT`                                        | ✅ OK      | Apenas Docker nos esperados                                        |
| 32  | Volumes persistentes               | pgdata, redisdata                   | docker-compose.yml → volumes nomeados                  | ✅ OK      | —                                                                  |

### 2.5 Modelo de Dados e Entidades

| #   | Requisito do Plano                 | Evidência Esperada                     | Como Verificar                                                    | Status     | Ação Corretiva                                                                                   |
| --- | ---------------------------------- | -------------------------------------- | ----------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| 33  | **Entidade `Unit`** (multi-tenant) | TypeORM entity + interface domain      | grep "Unit" em types.ts → ausente                                 | ❌ NÃO OK  | **P1**: Criar interface `Unit` e entity no módulo                                                |
| 34  | **Entidade `Plan`** (Seção 7)      | Entidade separada (1:1 ObservationSet) | grep "Plan" → `Section7Data` existe, mas `Plan` como entidade não | ⚠️ PARCIAL | **P1**: Extrair `Plan` como entidade com relacionamento                                          |
| 35  | **Entidades TypeORM**              | `.entity.ts` em cada módulo            | `find . -name "*.entity.ts"` → **0 arquivos**                     | ❌ NÃO OK  | **P0**: Criar entities: Unit, User, Episode, LcgForm, ObservationSet, AlertEvent, Plan, AuditLog |
| 36  | **Migrations**                     | Ao menos migration inicial             | `find . -name "*migration*.ts"` → **0 arquivos**                  | ❌ NÃO OK  | Consequência do item 35                                                                          |
| 37  | Interfaces domain                  | Tipos TS para todas entidades          | types.ts → 18 interfaces                                          | ✅ OK      | Exceto Unit e Plan separada                                                                      |
| 38  | Enums completos                    | Enums LCG Seções 1-7                   | enums.ts → 175 linhas, todos os enums                             | ✅ OK      | —                                                                                                |
| 39  | Motor de alertas                   | Validações Seções 2-6                  | `alert-engine.ts` → 423 linhas                                    | ✅ OK      | —                                                                                                |

### 2.6 API e Módulos NestJS

| #   | Requisito do Plano            | Evidência Esperada            | Como Verificar                                       | Status    | Ação Corretiva                                              |
| --- | ----------------------------- | ----------------------------- | ---------------------------------------------------- | --------- | ----------------------------------------------------------- |
| 40  | Prefixo `/api/v1`             | setGlobalPrefix               | main.ts → `api/v1`                                   | ✅ OK     | —                                                           |
| 41  | Swagger/OpenAPI               | Configurado em `/api/docs`    | main.ts → SwaggerModule.setup                        | ✅ OK     | —                                                           |
| 42  | CORS configurado              | Origin do .env                | main.ts → enableCors                                 | ✅ OK     | —                                                           |
| 43  | Helmet + compression          | Middleware segurança          | main.ts → app.use(helmet/compression)                | ✅ OK     | —                                                           |
| 44  | ValidationPipe global         | whitelist + transform         | main.ts → useGlobalPipes                             | ✅ OK     | —                                                           |
| 45  | **Módulos implementados**     | Controller + Service + Module | `find modules -type f` → **0 arquivos**              | ❌ NÃO OK | **P0**: Implementar módulos (Sprint 1: Episode, Auth, User) |
| 46  | **TypeORM config standalone** | `typeorm.config.ts` para CLI  | `find . -name "typeorm.config.ts"` → **inexistente** | ❌ NÃO OK | **P1**: Criar `src/config/typeorm.config.ts`                |
| 47  | ScheduleModule                | Job async de alertas          | app.module.ts → ScheduleModule.forRoot               | ✅ OK     | —                                                           |

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
| 55  | Jest configurado (Web)            | Config p/ jsdom           | Script `test` existe, **sem jest.config**                        | ⚠️ PARCIAL | **P2**: Criar jest.config.ts no web             |
| 56  | Cobertura >= 80% (plano, seção 8) | coverageThreshold         | Não configurado                                                  | ⚠️ PARCIAL | **P2**: Adicionar threshold quando tiver testes |
| 57  | Testes E2E script                 | `test:e2e`                | Script existe, `test/jest-e2e.json` referenciado mas inexistente | ⚠️ PARCIAL | **P2**: Criar config e2e                        |
| 58  | **Dockerfiles (deploy)**          | Dockerfile para web e api | `find . -name Dockerfile` → **0 arquivos**                       | ❌ NÃO OK  | **P2**: Criar Dockerfiles multi-stage           |
| 59  | **CI/CD (GitHub Actions)**        | `.github/workflows/`      | Diretório inexistente                                            | ❌ NÃO OK  | **P2**: Criar pipeline básica                   |
| 60  | LGPD: criptografia em repouso     | DB SSL, pgcrypto          | pgcrypto instalado, DB_SSL=false (dev ok)                        | ✅ OK      | —                                               |

---

## 3. Plano de Correção Priorizado

### P0 — Bloqueadores (devem ser resolvidos ANTES do Sprint 1)

| #    | Ação                                                                                                                                                                                            | Onde                                                           | Como Validar                                                                        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| P0-1 | **Criar ESLint config** (flat config v9)                                                                                                                                                        | `eslint.config.mjs` na raiz (ou por app)                       | `pnpm lint` executa sem erro                                                        |
| P0-2 | **Criar realm "partograma" no Keycloak** com client `partograma-web` (public), client `partograma-api` (confidential), roles (ENFERMEIRO_OBSTETRA, MEDICO_OBSTETRA, SUPERVISOR, AUDITOR, ADMIN) | Keycloak Admin http://localhost:8080 ou via JSON export/import | `curl http://localhost:8080/realms/partograma` retorna dados do realm               |
| P0-3 | **Criar entidades TypeORM** — ao menos Unit, User, Episode, LcgForm (Sprint 1)                                                                                                                  | `apps/api/src/modules/*/entities/*.entity.ts`                  | `pnpm --filter @partograma/api build` sem erros, entidades registradas no AppModule |

### P1 — Alto Impacto

| #    | Ação                                                                         | Onde                                    | Como Validar                                                        |
| ---- | ---------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------- |
| P1-1 | **Criar `typeorm.config.ts`** para CLI de migrations                         | `apps/api/src/config/typeorm.config.ts` | `pnpm db:migrate` executa sem "config not found"                    |
| P1-2 | **Adicionar interface `Unit`** ao domain                                     | types.ts                                | `grep "interface Unit" libs/domain/src/types.ts` encontra resultado |
| P1-3 | **Extrair `Plan` como entidade** separada (1:1 ObservationSet quando alerta) | Domain + TypeORM                        | Interface Plan + entity Plan com FK para ObservationSet             |
| P1-4 | **Corrigir formatação** dos 10 arquivos                                      | Na raiz do projeto                      | `pnpm format && pnpm format:check` → 0 warnings                     |

### P2 — Médio Impacto

| #    | Ação                                          | Onde                                                                | Como Validar                                          |
| ---- | --------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| P2-1 | **Criar Dockerfiles** multi-stage (web + api) | `apps/web/Dockerfile`, `apps/api/Dockerfile`                        | `docker build -t partograma-api apps/api` → sucesso   |
| P2-2 | **Criar CI/CD pipeline** (GitHub Actions)     | `.github/workflows/ci.yml`                                          | Push no GitHub → pipeline executa                     |
| P2-3 | **Criar jest.config.ts** no frontend          | jest.config.ts                                                      | `pnpm --filter @partograma/web test` reconhece testes |
| P2-4 | **Criar ao menos 1 teste** por app (smoke)    | `apps/api/src/app.module.spec.ts`, `apps/web/src/app/page.test.tsx` | `pnpm test` → testes executados                       |
| P2-5 | **Criar config E2E** (`test/jest-e2e.json`)   | `apps/api/test/`                                                    | `pnpm test:e2e` funciona                              |
| P2-6 | **Corrigir healthcheck do Keycloak**          | docker-compose.yml                                                  | `docker compose ps` → Keycloak `(healthy)`            |

### P3 — Baixo Impacto

| #    | Ação                                                                                     | Onde                 | Como Validar                      |
| ---- | ---------------------------------------------------------------------------------------- | -------------------- | --------------------------------- |
| P3-1 | **Instalar husky + lint-staged** para Git hooks                                          | Raiz do projeto      | `git commit` roda lint antes      |
| P3-2 | **Adicionar commitlint** (Conventional Commits)                                          | `.commitlintrc.json` | Commit fora do padrão é rejeitado |
| P3-3 | Boa prática (fora do plano): **Adicionar `engines.node`** no `.nvmrc` ou `.node-version` | Raiz                 | `nvm use` carrega versão correta  |

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

### Resumo Final

| Categoria             | OK     | Parcial | Falha  |
| --------------------- | ------ | ------- | ------ |
| Sistema/Dependências  | 5      | 0       | 0      |
| Repositório/Padrões   | 9      | 1       | 2      |
| Build/DX              | 6      | 1       | 0      |
| Infraestrutura Docker | 8      | 1       | 1      |
| Modelo de Dados       | 3      | 1       | 3      |
| API/Módulos NestJS    | 5      | 0       | 2      |
| Frontend              | 5      | 0       | 1      |
| Qualidade/Segurança   | 2      | 3       | 2      |
| **TOTAL**             | **43** | **7**   | **11** |

**Aderência**: ~70% do plano coberto pela infraestrutura atual. Os 30% restantes são concentrados em **implementação de código** (entities, módulos, telas) que são trabalho dos sprints 1-2, e em **configuração de ferramentas de qualidade** (ESLint, CI/CD, Dockerfiles) que devem ser resolvidas antes de iniciar o desenvolvimento.
