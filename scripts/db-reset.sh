#!/usr/bin/env bash
# Wipe and recreate local Postgres from schema.sql + seeds.
# Usage: npm run db:reset   (from repo root)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f backend/.env ]]; then
  set -a
  # shellcheck disable=SC1091
  source backend/.env
  set +a
fi

DB_NAME="${DB_NAME:-mplos}"
PGHOST="${DB_HOST:-localhost}"
PGPORT="${DB_PORT:-5432}"
PGUSER="${DB_USER:-${PGUSER:-$(whoami)}}"
export PGPASSWORD="${DB_PASSWORD:-}"

PSQL=(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -v ON_ERROR_STOP=1)

echo "Resetting database \"$DB_NAME\" on $PGHOST:$PGPORT as $PGUSER"

# Drop active connections so DROP DATABASE succeeds
"${PSQL[@]}" -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" \
  2>/dev/null || true

"${PSQL[@]}" -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
"${PSQL[@]}" -d postgres -c "CREATE DATABASE \"$DB_NAME\";"

"${PSQL[@]}" -d "$DB_NAME" -f database/schema.sql
"${PSQL[@]}" -d "$DB_NAME" -f database/seeds/index.sql

echo "OK — \"$DB_NAME\" rebuilt from schema.sql + seeds."
