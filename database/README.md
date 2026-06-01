# Database

## Reset local DB (schema in flux — no migrations)

From repo root:

```bash
npm run db:reset
```

Drops **`mplos`** (or `DB_NAME` from `backend/.env`), runs `schema.sql` + `seeds/index.sql`.

Stop the backend first if it's connected (script terminates other sessions when possible).

## Manual

```bash
psql -d postgres -c 'DROP DATABASE IF EXISTS mplos;'
psql -d postgres -c 'CREATE DATABASE mplos;'
psql -d mplos -f database/schema.sql
psql -d mplos -f database/seeds/index.sql
```

## Multitenancy

- **Tenant** = `accounts` row; business data uses `account_id`.
- RLS needs `app.account_id` per request (`backend/middleware/tenant.middleware.js`).

Develop login Bearer token = seed email **`j3nkii`**.
