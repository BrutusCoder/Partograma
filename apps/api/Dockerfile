# =====================================================================
# Dockerfile — @partograma/api (NestJS)
# Multi-stage build otimizado para monorepo pnpm
# Build context: raiz do monorepo (docker build -f apps/api/Dockerfile .)
# =====================================================================

# ── Stage 1: base ─────────────────────────────────────────────────────
# Imagem base com pnpm habilitado via corepack
FROM node:25-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate
WORKDIR /app

# ── Stage 2: deps ─────────────────────────────────────────────────────
# Instala TODAS as dependências (dev + prod) para build
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
COPY libs/domain/package.json libs/domain/package.json
COPY libs/validators/package.json libs/validators/package.json
COPY libs/ui/package.json libs/ui/package.json
RUN pnpm install --frozen-lockfile

# ── Stage 3: build ────────────────────────────────────────────────────
# Compila libs de domínio + API, depois gera deploy bundle via pnpm deploy
FROM deps AS build
COPY libs/ libs/
COPY apps/api/ apps/api/
COPY tsconfig.base.json ./
RUN pnpm --filter @partograma/domain build \
 && pnpm --filter @partograma/validators build \
 && pnpm --filter @partograma/api build
# pnpm deploy cria diretório auto-contido sem symlinks (ideal para Docker)
RUN pnpm --filter @partograma/api deploy --legacy --prod /app/deployed

# ── Stage 4: runtime ─────────────────────────────────────────────────
# Imagem final mínima — apenas artefatos compilados + deps de produção
FROM node:25-alpine AS runtime

LABEL maintainer="Equipe Partograma <partograma@equipe.dev>"
LABEL org.opencontainers.image.source="https://github.com/BrutusCoder/Partograma"
LABEL org.opencontainers.image.description="Partograma LCG API (NestJS)"

# Segurança: rodar como non-root
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
WORKDIR /app

# Copiar deploy bundle (node_modules reais, sem symlinks)
COPY --from=build /app/deployed/node_modules ./node_modules
# Copiar artefatos compilados da API
COPY --from=build /app/deployed/dist ./dist
# Copiar package.json para metadata
COPY --from=build /app/deployed/package.json ./package.json

# Variáveis de ambiente padrão (overrideable em runtime)
ENV NODE_ENV=production
ENV API_PORT=4000

EXPOSE 4000

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/v1 || exit 1

CMD ["node", "dist/main.js"]
