# Plano de Implementacao Completo - Aplicacao Web Partograma OMS (LCG 2020)

Data: 2026-02-10
Versao: 1.0
Autor: Arquiteto de Software Senior
Stack: Next.js (TypeScript) + NestJS (TypeScript) + PostgreSQL
Base: Regras clinicas LCG (OMS 2020), requisitos funcionais, validacoes, Gherkin e modelos do LCG.

---

## 1. Visao geral e escopo

### 1.1 Objetivo

Desenvolver e implantar uma aplicacao web full-stack para o partograma OMS (WHO Labour Care Guide - LCG 2020), com registro em tempo real das secoes 1-7, motor de alertas automatico, auditoria por adendo (imutavel) e RBAC por unidade. O MVP foca em registro + alertas + auditoria + exportacao basica.

### 1.2 Escopo funcional (MVP)

- Secao 1: identificacao e admissao (Episode).
- Secoes 2-6: observacoes temporais (ObservationSet).
- Secao 7: avaliacao e plano (Plan) obrigatorio quando ha alerta.
- Motor de alertas: limiares por secao e regra de progressao cervical por tempo.
- Regra das 12 horas: bloqueio do LCG atual e criacao de novo LCG encadeado.
- Auditoria por adendo: registros imutaveis, correcoes via adendo.
- RBAC: enfermeiro, medico, supervisor, auditor, admin.
- Exportacao: PDF simples do LCG (tabela + plano).
- IA para sugestao clinica (apoio ao plano, nao substitui decisao).
- Mobile app nativo (iOS/Android) com fluxo essencial de registro.

### 1.3 Fora do escopo (MVP)

- Integracoes externas (HIS/PEP/monitor fetal).
- Relatorios analiticos avancados.

### 1.4 Requisitos nao funcionais

- LGPD: criptografia em repouso e transito, RBAC rigoroso, auditoria completa.
- Performance: p95 < 500 ms para operacoes criticas.
- Disponibilidade: 99.9%.
- Escalabilidade: multi-unidade hospitalar.

---

## 2. Arquitetura tecnica

### 2.1 Visao geral

- Front-end: Next.js (SSR/CSR) com TypeScript.
- Back-end: NestJS com modulos por dominio.
- Banco: PostgreSQL (schema lcg).
- Filas: Bull + Redis para alertas assincronos.
- Auth: Keycloak (OIDC) com roles e unidade.

Fluxo:
Cliente -> Next.js -> NestJS API -> PostgreSQL
| |
Keycloak Bull/Redis

### 2.2 Monorepo (recomendado)

- Nx (opcional) para padrao TS unico.
- apps/web (Next.js)
- apps/api (NestJS)
- libs/domain (tipos e contratos)
- libs/validators (regras do LCG)
- libs/ui (componentes)

---

## 3. Modelo de dados (PostgreSQL)

### 3.1 Entidades principais

- Unit: unidade hospitalar (multi-tenant).
- User: usuario com role e unidade.
- Episode: cabecalho (Secao 1).
- LcgForm: formulario LCG (1 por 12h, encadeado).
- ObservationSet: rodada de observacoes (Secoes 2-6).
- AlertEvent: alerta disparado por limiar.
- Plan: Secao 7 (avaliacao e plano).
- AuditLog: adendos imutaveis e operacoes.

### 3.2 Relacionamentos

- Unit 1:N User
- Episode 1:N LcgForm
- LcgForm 1:N ObservationSet
- ObservationSet 1:N AlertEvent
- ObservationSet 1:1 Plan (quando alerta)

### 3.3 Regras de imutabilidade

- ObservationSet e Plan nao podem ser editados.
- Correcoes via AuditLog (adendo) + novo ObservationSet.

---

## 4. API (padrao /api/v1/lcg)

### 4.1 Auth

- OIDC via Keycloak; JWT no header Authorization.

### 4.2 Endpoints principais

- POST /episodes
- GET /episodes
- GET /episodes/:id
- POST /episodes/:id/lcg-forms
- GET /lcg-forms/:id
- POST /lcg-forms/:id/observations
- GET /alerts?lcgFormId=
- POST /alerts/:id/ack (cria Plan)
- GET /audit-logs?entityType=&entityId=
- GET /lcg-forms/:id/export/pdf

### 4.3 Permissoes (RBAC)

- Enfermeiro/Medico: CRUD Episode, ObservationSet, Plan.
- Supervisor: visualiza audit/logs.
- Auditor: somente leitura.
- Admin: gerencia usuarios.

---

## 5. Motor de alertas

### 5.1 Execucao sincrona

- Ao criar ObservationSet, avaliar limites das Secoes 2-6.

### 5.2 Execucao assincrona (Bull)

- Job a cada 30 min para progressao cervical e regra 12h.

### 5.3 Regras criticas

- Limiar por secao (ex: FCF <110 ou >=160, PA >=140, etc.).
- Progressao cervical por tempo (5->6: 6h; 6->7: 5h; 7->8: 3h; 8->9: 2.5h; 9->10: 2h).
- Regra das 12h: bloqueio do LCG atual e sugestao de novo LCG.
- Ocitocina: exige registro de FCF + contracoes na mesma rodada.

---

## 6. UI/UX (Next.js)

### 6.1 Telas

- Login (Keycloak)
- Dashboard (episodios ativos)
- LCG Timeline (grade temporal)
- Modal Nova Rodada (Secoes 2-7)
- Alertas (lista + status)
- Auditoria (somente SUP/AUD/ADM)

### 6.2 Regras de interface

- Destaque visual para alertas.
- Bloqueio de salvar se alerta sem Plan.
- Botao para novo LCG ao exceder 12h.

---

## 7. Sprints (2 semanas)

### Sprint 1: Setup e base

- Monorepo Nx, Docker Compose, Postgres, Redis.
- Keycloak OIDC.
- Entidades basicas (Unit, User, Episode, LcgForm).

### Sprint 2: Secoes 1-4

- CRUD Episode.
- ObservationSet com secao 2-4.
- Validacoes clinicas iniciais.
- UI grade basica.

### Sprint 3: Secoes 5-6

- Progressao cervical.
- Ocitocina + vigilancias.
- UI tabela interativa.

### Sprint 4: Secao 7 + Alertas

- Plan obrigatorio.
- AlertEngine completo.
- Listagem e ack de alertas.

### Sprint 5: Auditoria + RBAC

- AuditLog append-only.
- Guards de role + unidade.

### Sprint 6: Refinos + MVP

- Exportacao PDF.
- Testes E2E.
- Performance tuning.

---

## 8. Testes e qualidade

- Unit: Jest (NestJS) e RTL (Next.js).
- Integracao: supertest (NestJS).
- Aceitacao: Gherkin com 20+ cenarios.
- Cobertura: >= 80%.

---

## 9. Deploy e operacao

- Docker + Kubernetes.
- CI/CD (GitHub Actions).
- Observabilidade: Prometheus + Grafana + Sentry.
- Backup diario (Postgres).

---

## 10. Riscos e mitigacoes

- Regras LCG mal interpretadas: revisao clinica semanal.
- Complexidade temporal: testes com fixtures de tempo.
- LGPD: criptografia e auditoria forte.

---

## 11. Metricas de sucesso

- p95 < 500 ms.
- 99.9% uptime.
- Cobertura > 80%.
- 0 alertas falsos em validacao clinica.

---

Fim do plano.
