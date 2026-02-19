#!/usr/bin/env bash
# =============================================================================
# Keycloak Provisioning Script — Partograma LCG
# Verifica se o realm "partograma" já existe e, caso contrário, importa via API.
# Útil como fallback caso o --import-realm não funcione ou para ambientes CI.
# =============================================================================
set -euo pipefail

KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8080}"
ADMIN_USER="${KEYCLOAK_ADMIN:-admin}"
ADMIN_PASS="${KEYCLOAK_ADMIN_PASSWORD:-admin}"
REALM="partograma"
MAX_RETRIES=30
RETRY_INTERVAL=5

echo "╔══════════════════════════════════════════════════╗"
echo "║   Keycloak Provisioning — Partograma LCG        ║"
echo "╚══════════════════════════════════════════════════╝"

# --- Wait for Keycloak to be ready ---
echo "⏳ Aguardando Keycloak em ${KEYCLOAK_URL}..."
for i in $(seq 1 $MAX_RETRIES); do
  if curl -sf "${KEYCLOAK_URL}/health/ready" > /dev/null 2>&1 || \
     curl -sf "${KEYCLOAK_URL}/realms/master" > /dev/null 2>&1; then
    echo "✅ Keycloak pronto!"
    break
  fi
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "❌ Keycloak não respondeu após $((MAX_RETRIES * RETRY_INTERVAL))s. Saindo."
    exit 1
  fi
  echo "   Tentativa $i/$MAX_RETRIES..."
  sleep $RETRY_INTERVAL
done

# --- Check if realm already exists ---
echo "🔍 Verificando realm '${REALM}'..."
HTTP_CODE=$(curl -sf -o /dev/null -w '%{http_code}' "${KEYCLOAK_URL}/realms/${REALM}" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Realm '${REALM}' já existe. Nada a fazer."
  exit 0
fi

echo "⚠️  Realm '${REALM}' não encontrado (HTTP ${HTTP_CODE}). Provisionando..."

# --- Get admin token ---
echo "🔑 Obtendo token de admin..."
TOKEN_RESPONSE=$(curl -sf -X POST \
  "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${ADMIN_USER}" \
  -d "password=${ADMIN_PASS}" \
  -d "grant_type=password" \
  -d "client_id=admin-cli")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null || \
               echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Falha ao obter token de admin. Resposta:"
  echo "$TOKEN_RESPONSE"
  exit 1
fi

echo "✅ Token obtido."

# --- Import realm ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REALM_FILE="${SCRIPT_DIR}/realm-export.json"

if [ ! -f "$REALM_FILE" ]; then
  echo "❌ Arquivo ${REALM_FILE} não encontrado."
  exit 1
fi

echo "📦 Importando realm de ${REALM_FILE}..."
IMPORT_RESPONSE=$(curl -sf -w '\n%{http_code}' -X POST \
  "${KEYCLOAK_URL}/admin/realms" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @"$REALM_FILE" 2>&1)

IMPORT_HTTP_CODE=$(echo "$IMPORT_RESPONSE" | tail -1)
IMPORT_BODY=$(echo "$IMPORT_RESPONSE" | sed '$d')

if [ "$IMPORT_HTTP_CODE" = "201" ] || [ "$IMPORT_HTTP_CODE" = "204" ]; then
  echo "✅ Realm '${REALM}' importado com sucesso!"
else
  echo "❌ Falha ao importar realm (HTTP ${IMPORT_HTTP_CODE}):"
  echo "$IMPORT_BODY"
  exit 1
fi

# --- Verify ---
echo "🔍 Verificando importação..."
VERIFY_CODE=$(curl -sf -o /dev/null -w '%{http_code}' "${KEYCLOAK_URL}/realms/${REALM}" 2>/dev/null || echo "000")

if [ "$VERIFY_CODE" = "200" ]; then
  echo ""
  echo "╔══════════════════════════════════════════════════╗"
  echo "║   ✅ Provisionamento concluído com sucesso!     ║"
  echo "╠══════════════════════════════════════════════════╣"
  echo "║   Realm: ${REALM}                               ║"
  echo "║   Clients: partograma-web, partograma-api       ║"
  echo "║   Roles: 5 realm roles configurados             ║"
  echo "║   Usuários de teste: 5                          ║"
  echo "╠══════════════════════════════════════════════════╣"
  echo "║   Credenciais de teste (senha: dev123):         ║"
  echo "║   ├ enfermeira.ana  → ENFERMEIRO_OBSTETRA       ║"
  echo "║   ├ dr.carlos       → MEDICO_OBSTETRA           ║"
  echo "║   ├ supervisor.maria→ SUPERVISOR                ║"
  echo "║   ├ auditor.pedro   → AUDITOR                   ║"
  echo "║   └ admin.julia     → ADMIN                     ║"
  echo "╚══════════════════════════════════════════════════╝"
else
  echo "❌ Verificação falhou (HTTP ${VERIFY_CODE})."
  exit 1
fi
