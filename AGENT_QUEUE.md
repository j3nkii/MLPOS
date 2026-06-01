# MPLOS agent queue

**Audience:** AI assistant (Cursor / agent).  
**Human map:** [ROADMAP.md](./ROADMAP.md) — do not expect linear execution.

## Operating rules

1. **Single NEXT item** — Only one task should be `NEXT` at a time unless the human explicitly parallelizes.
2. **Human goes rogue** — When they report off-queue work: (a) capture outcome in ROADMAP parking lot or wins, (b) mark affected items `DONE` / `BLOCKED` / add `DEBT`, (c) do not lecture—reconcile.
3. **Session scope** — One queue ID per session when possible (e.g. `B1.3`). Ask if unclear.
4. **v1 gate** — Reject or park work that ships customer subdomain, public booking, RBAC, or doc signing unless human says **promote**.
5. **After each session** — Update statuses here; suggest one-line entry for human ROADMAP wins/oops.

## Status legend

| Status | Meaning |
|--------|---------|
| `NEXT` | Do this now |
| `READY` | Unblocked, not started |
| `BLOCKED` | Waiting on dependency ID |
| `DONE` | Meets exit criteria |
| `DEBT` | Known mess; human chose to defer |
| `PARKED` | Out of v1 scope |

---

## v1 definition (agent)

Internal dashboard on existing CloudFront/S3/Lambda/RDS stack. Features: customers, tickets, line items, payments, Stripe pay link, products, **internal scheduling**, multi-user same account (flat ACL). **Exclude:** tenant subdomains, customer portal, notifications, signing, roles.

---

## Queue

### Block 0 — Align reality

| ID | Task | Exit criteria | Touch | Status |
|----|------|---------------|-------|--------|
| B0.0 | Tenant lock (RLS + middleware) | `app.account_id` per request; `account_id` on business tables; RLS policies + FORCE | `database/`, `tenant.middleware.js`, routers | DONE |
| B0.1 | Audit schema vs API | `schema.sql` includes `ticket_items.product_id`; seeds apply; ticket columns match API (`invoice_status` not `status`) | `database/` | DONE |
| B0.2 | Env inventory | List vars for local + Lambda; note gaps (e.g. `STRIPE_SECRET_KEY` in Terraform) | `00DOCS/ENV.md` | DONE |
| B0.3 | Deploy checklist doc | Short steps: migrate DB, build fe, zip lambda, apply | `00DOCS/DEPLOY.md` | DONE |

### Block 1 — Trust the core

| ID | Task | Exit criteria | Touch | Status |
|----|------|---------------|-------|--------|
| B1.1 | Auth middleware | All `NODE_ENV` paths call `next()` or 401; no hang | `backend/middleware/auth.middleware.js` | READY |
| B1.2 | User endpoint | `GET /api/user` works develop + prod (Bearer, not body) | `backend/routers/user.router.js` | BLOCKED B1.1 |
| B1.3 | Resource ownership | All `:id` routes verify user/account owns row | `backend/routers/*.js` | BLOCKED B1.1 |
| B1.4 | Transactions | Ticket/payment mutators: BEGIN/COMMIT/ROLLBACK on one client | `backend/routers/ticket.router.js`, `payments.router.js` | READY |
| B1.5 | Invoice status | Payment mutations update `tickets.invoice_status` correctly | `backend/models/ticket.model.js`, payments router | BLOCKED B1.4 |
| B1.6 | Products PUT | Update name/price works; schema allows insert | `products.router.js`, `schema.sql` | DONE |
| B1.7 | Frontend async UX | Loading/error on queries; modals close on mutation success | `frontend/src/` | READY |
| B1.8 | Ticket by ID (optional) | `GET /api/ticket/:id` scoped; detail page uses it | ticket router, `SelectedTicketPage` | READY |

**Block 1 exit:** Scriptable happy path—customer → ticket → items → payment or send link—in prod.

### Block 2 — Scheduling (internal)

| ID | Task | Exit criteria | Touch | Status |
|----|------|---------------|-------|--------|
| B2.1 | Scheduling schema | `appointments` (+ bookable service fields on products) migrated | `database/schema.sql` | BLOCKED B0.1 |
| B2.2 | Scheduling API | CRUD appointments; scoped to account/user | new router, models | BLOCKED B2.1 |
| B2.3 | Scheduling UI | Week/list view; create/edit/cancel | `frontend/` | BLOCKED B2.2 |
| B2.4 | Business hours v0 | Simple weekly hours + block slot | API + UI | BLOCKED B2.2 |

**Block 2 exit:** Staff books appointment; same day creates ticket for that customer manually or via link.

### Block 3 — Multi-user account

| ID | Task | Exit criteria | Touch | Status |
|----|------|---------------|-------|--------|
| B3.1 | Account scoping | Lists/mutations filter by `account_id` consistently | schema, routers | DONE (B0.0; verify under B1.3) |
| B3.2 | Add second user | Second login same account (invite or admin insert) | auth, users | BLOCKED B3.1 |

### Block 4 — Dogfood & infra hygiene

| ID | Task | Exit criteria | Touch | Status |
|----|------|---------------|-------|--------|
| B4.1 | Stripe on Lambda | `STRIPE_SECRET_KEY` in TF env; send link works prod | `infra/main.tf`, stripe | READY |
| B4.2 | RDS ingress | Remove `0.0.0.0/0` on 5432 if human wants | `infra/main.tf` | PARKED |
| B4.3 | Dogfood log | Human records 5+ jobs; papercuts filed | ROADMAP oops/parking | BLOCKED B1.* B2.* |

---

## Current pointer

```text
NEXT: B1.1
```

*Agent: update this line at end of every session.*

---

## Phase 2 backlog (do not START without promote)

| ID | Item |
|----|------|
| P2.1 | Wildcard DNS + `{tenant}.mplos.com` |
| P2.2 | Customer auth on subdomain |
| P2.3 | Public service booking |
| P2.4 | Transactional email |
| P2.5 | Doc signing integration |
| P2.6 | RBAC roles |

---

## Rogue reconciliation protocol

When human says they changed X outside queue:

1. Diff or inspect X.  
2. If it completes a queue item → mark `DONE`, note debt.  
3. If it conflicts → add ROADMAP **Oops shelf** + queue `DEBT` with one-line fix.  
4. If it's new scope → ROADMAP **Parking lot** only.  
5. Propose new `NEXT` (don't leave blank).

---

## Infra reference (agent)

| Resource | Purpose |
|----------|---------|
| CloudFront | SPA + `/api/*` → Lambda URL |
| S3 `mlpos-frontend` | Static build |
| Lambda `mlpos-backend` | Express, VPC, Node 22 |
| RDS Postgres 16 | `mlposdb` |
| Cognito pool | Prod auth |
| TF state | S3 `mplos-terraform-bucket` |

Missing for later: custom domain ACM, tenant routing, Stripe in TF, CI deploy.

---

*Last updated: June 2026 — Block 0 complete on branch `agent/b0-tenant-align`*
