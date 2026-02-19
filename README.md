# Partograma LCG - WHO Labour Care Guide 2020

## 🏗️ Estrutura do Projeto

```
Partograma/
├── apps/
│   ├── web/         # Frontend - Next.js 15 + React 19 + TypeScript
│   └── api/         # Backend  - NestJS 10 + TypeScript
├── libs/
│   ├── domain/      # Tipos, enums e constantes compartilhados
│   ├── validators/  # Motor de alertas e validações clínicas LCG
│   └── ui/          # Componentes UI reutilizáveis
├── docker/          # Scripts de inicialização Docker
├── Documentação_Protocolos/  # Documentação clínica e técnica
├── docker-compose.yml        # PostgreSQL + Redis + Keycloak
├── pnpm-workspace.yaml       # Monorepo workspaces
└── tsconfig.base.json        # TypeScript base config
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js >= 20
- pnpm >= 9
- Docker e Docker Compose
- Git

### Instalação

```bash
# Clonar e entrar no diretório
cd Partograma

# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env

# Subir serviços (PostgreSQL, Redis, Keycloak)
docker compose up -d

# Iniciar desenvolvimento
pnpm dev
```

### Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia frontend e backend em modo dev |
| `pnpm dev:web` | Apenas frontend (localhost:3000) |
| `pnpm dev:api` | Apenas backend (localhost:4000) |
| `pnpm build` | Build de produção |
| `pnpm test` | Executar testes |
| `pnpm lint` | Verificar linting |
| `pnpm format` | Formatar código |
| `pnpm docker:up` | Subir serviços Docker |
| `pnpm docker:down` | Parar serviços Docker |
| `pnpm db:migrate` | Rodar migrações |

### Acessos em Desenvolvimento

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |
| Swagger | http://localhost:4000/api/docs |
| Keycloak | http://localhost:8080 (admin/admin) |
| PostgreSQL | localhost:5432 (partograma/partograma_dev) |
| Redis | localhost:6379 |

## 📋 Stack Tecnológica

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: NestJS 10 + TypeScript + TypeORM
- **Banco**: PostgreSQL 16
- **Cache/Filas**: Redis 7 + Bull
- **Auth**: Keycloak 23 (OIDC/OAuth2)
- **Testes**: Jest + Testing Library + Supertest

## 📖 Documentação

- [Requisitos](Documentação_Protocolos/Documento%20de%20Requisitos%20para%20Aplicação%20Web%20de%20Partograma%20(WHO%20Labour%20Care%20Guide%20-%20LCG%202020).md)
- [Regras de Negócio](Documentação_Protocolos/Regras%20de%20Negócio.md)
- [Plano de Implementação](Documentação_Protocolos/Plano_Implementacao_TS_LCG_2020.md)
- [Plano Completo](Documentação_Protocolos/Plano_Completo_WHOO_Partograma.md)
