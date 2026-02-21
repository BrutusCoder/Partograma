# =====================================================================
# Dockerfile — @partograma/web (Next.js 15)
# Multi-stage build otimizado para monorepo pnpm + standalone output
# Build context: raiz do monorepo (docker build -f apps/web/Dockerfile .)
# =====================================================================

# ── Stage 1: base ─────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate
WORKDIR /app

# ── Stage 2: deps ─────────────────────────────────────────────────────
# Instala todas as dependências para o build
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
COPY libs/domain/package.json libs/domain/package.json
COPY libs/validators/package.json libs/validators/package.json
COPY libs/ui/package.json libs/ui/package.json
RUN pnpm install --frozen-lockfile

# ── Stage 3: build ────────────────────────────────────────────────────
# Compila libs de domínio + Next.js (output: standalone)
FROM deps AS build

# Build args para variáveis públicas injetadas em build time
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY libs/ libs/
COPY apps/web/ apps/web/
COPY tsconfig.base.json ./
RUN pnpm --filter @partograma/domain build \
 && pnpm --filter @partograma/validators build \
 && pnpm --filter @partograma/web build

# ── Stage 4: runtime ─────────────────────────────────────────────────
# Imagem final mínima — Next.js standalone server
FROM node:22-alpine AS runtime

LABEL maintainer="Equipe Partograma <partograma@equipe.dev>"
LABEL org.opencontainers.image.source="https://github.com/BrutusCoder/Partograma"
LABEL org.opencontainers.image.description="Partograma LCG Web (Next.js)"

# Segurança: rodar como non-root
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
WORKDIR /app

# Next.js standalone já inclui node_modules mínimos embutidos
COPY --from=build --chown=appuser:appgroup /app/apps/web/.next/standalone ./
# Assets estáticos (servidos diretamente pelo Next.js server)
COPY --from=build --chown=appuser:appgroup /app/apps/web/.next/static ./apps/web/.next/static
# Arquivos públicos
COPY --from=build --chown=appuser:appgroup /app/apps/web/public ./apps/web/public

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Next.js standalone gera server.js na raiz do app dentro do standalone
CMD ["node", "apps/web/server.js"]
