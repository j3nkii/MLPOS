# MLPOS (monorepo)

Node 22 · React (Vite) · Express / Lambda · PostgreSQL · Stripe Connect · AWS

## Product

Read **[MPLOS.md](./MPLOS.md)** for what we’re building and why—side hustlers & small business owners, multi-tenant, `{business}.mplos.com` customer sites, simple crucial tools only.

Product vision: **[MPLOS.md](./MPLOS.md)**.  
**Your roadmap (flexible):** [ROADMAP.md](./ROADMAP.md) · **Agent queue (ordered):** [AGENT_QUEUE.md](./AGENT_QUEUE.md)

## Local dev

- PostgreSQL installed and running  
- Copy `backend/example.env` → `backend/.env` (`DB_NAME=mplos`)  
- Reset DB anytime: **`npm run db:reset`** (wipe + schema + seeds)  
- From repo root: `npm run backend` and `npm run frontend` (or run each package’s `npm run local`)

Frontend dev server proxies `/api` to port 8000.

## Packages

| Path | Role |
|------|------|
| `frontend/` | Owner dashboard (React) |
| `backend/` | API (Express; Lambda via `lambda.js`) |
| `database/` | Schema + seeds |
