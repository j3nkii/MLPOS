# MPLOS v1 checklist

**Your reference when working solo.** Last synced: August 2026.

Product story: [MPLOS.md](./MPLOS.md) · Flexible notes: [ROADMAP.md](./ROADMAP.md) · Otto queue (if you get AI help again): [AGENT_QUEUE.md](./AGENT_QUEUE.md)

---

## What v1 is

**Internal dashboard only** — no customer subdomain yet.

A mobile bike tech (or you) can run:

**customer → ticket → line items → payment or pay link → invoice status → (internal) appointment**

Target later: ~$10/mo SaaS. **Right now:** dogfood on real jobs, not public launch.

### Not v1 (park these)

- `{business}.mplos.com` customer site  
- Public booking  
- Customer accounts / rewards / subscriptions  
- Email/SMS notifications  
- Doc signing  
- Roles / RBAC  
- Custom domains  

---

## What’s already done

Check these off mentally — don’t rebuild them.

- [x] Product vision — `MPLOS.md`
- [x] AWS skeleton — `infra/` (CloudFront, S3, Lambda, RDS, Cognito)
- [x] Dashboard prototype — customers, tickets, items, payments, products, modals
- [x] **Block 0** — multi-tenant: `account_id`, Postgres RLS, `tenant.middleware`, routers use `req.db`
- [x] Schema + seeds aligned (`invoice_status`, `product_id`, etc.)
- [x] `npm run db:reset` — wipe DB and reload schema + seeds
- [x] **B1.5** — invoice status module (`backend/modules/invoiceStatus.js`) updates on payment changes
- [x] Products PUT works
- [x] Merged PRs: `agent/b0-tenant-align`, `agent/b1.5-invoice-status`

---

## Shippable = this works without hacks

You’re v1-ready when **all** of these are true:

- [ ] Login works locally (`develop`) and on prod (Cognito) if you deploy
- [ ] Full loop: customer → ticket → line items → total is correct
- [ ] Record payment **or** send Stripe pay link
- [ ] `invoice_status` moves logically (`quote` → `partially_paid` → `paid`)
- [ ] **Internal scheduling** — staff books appointment (customer + time + service)
- [ ] You ran **5+ real jobs** (or one shop did) and logged papercuts below
- [ ] Deployed once using `00DOCS/DEPLOY.md` (optional but real “shippable”)

Nice-to-have for v1, not blocking:

- [ ] Second user login, same business, flat access (no roles)
- [ ] `GET /api/ticket/:id` so detail page doesn’t load every ticket

---

## Your todo list (in order)

Work top to bottom. Skip ahead only if something below is already done when you touch it.

### Phase A — Trust the core (~1–2 weeks)

Frontend polish and bug fixes so daily use doesn’t lie to you.

| Done | ID | Task | Where to look |
|------|-----|------|----------------|
| [ ] | A1 | **Full-page loading spinner** while queries/mutations run | `frontend/src/components/library/`, wire in `Layout` or `App` |
| [ ] | A2 | **Toast system** — bones in `library/`, manager in `template/` (like `ModalManager`) | New: `Toast.jsx`, `useToastZussy` or similar, `ToastManager.jsx` |
| [ ] | A3 | **Success/error toasts** after mutations (create/update/delete) | `frontend/src/api/reactQuery/sub/*.js` `onSuccess` / `onError` |
| [ ] | A4 | **Modals close only on mutation success** (not immediately on click) | e.g. `TicketItemFormModal.jsx` — use `mutateAsync` or `onSuccess` in hook |
| [ ] | A5 | **List/detail loading + error states** | Pages using `use*Query` — check `isPending`, `isError`, `error` |
| [ ] | A6 | Smoke test full loop manually | Customers → Tickets → Items → Payments → Send |
| [ ] | A7 | Auth sanity: logout, bad token, `/api/user` | `auth.middleware.js`, `user.router.js`, `Layout.jsx` |
| [ ] | A8 | *(Optional)* Ticket detail by ID | `GET /api/ticket/:id` + `SelectedTicketPage.jsx` |

**A1–A2 spec (from your notes):**

- One large spinner takes over the page while loading.  
- When done, toast notification appears.  
- Toast “engine” isolated; implementation mounted like `ModalManager`.

---

### Phase B — Internal scheduling (~2–3 weeks)

Required for v1 per product plan. **Staff only** — no customer self-booking.

| Done | ID | Task | Where to look |
|------|-----|------|----------------|
| [ ] | B1 | Schema: `appointments` table | `database/schema.sql` then `npm run db:reset` |
| [ ] | B2 | Service products: duration, `is_bookable` (or use existing flags) | `products` table + product form |
| [ ] | B3 | API: CRUD appointments, scoped by `account_id` / RLS | New router, register in `app.js` |
| [ ] | B4 | UI: week or list view; create / edit / cancel | New page or section in dashboard |
| [ ] | B5 | Simple business hours or blockouts (keep dumb) | API + minimal UI |
| [ ] | B6 | Manual link: appointment → same customer → new ticket | UX only at first is fine |

**Keep out of scope:** public booking, email reminders, Google Calendar sync.

---

### Phase C — Prod & dogfood (~1 week)

| Done | ID | Task | Where to look |
|------|-----|------|----------------|
| [ ] | C1 | Add `STRIPE_SECRET_KEY` to Lambda env in Terraform | `infra/main.tf` |
| [ ] | C2 | Run deploy checklist end-to-end | `00DOCS/DEPLOY.md` |
| [ ] | C3 | Prod login (Cognito) + one pay link send | Stripe Connect flow |
| [ ] | C4 | **Dogfood:** 5+ real jobs; write papercuts in [Papercuts](#papercuts) | — |

---

### Phase D — Multi-user (optional for v1)

| Done | ID | Task | Where to look |
|------|-----|------|----------------|
| [ ] | D1 | Second `users` row, same `account_id` | `database/seeds` or manual SQL |
| [ ] | D2 | Both can log in and see same customers/tickets | Already scoped by account if RLS + middleware OK |
| [ ] | D3 | Invite/signup flow (can be manual SQL for v1) | `auth.router.js`, signup if wired |

---

## 15-minute “get back in” ritual

```bash
# from repo root
cp backend/example.env backend/.env   # if missing; DB_NAME=mplos

npm run db:reset

npm run backend    # terminal 1 — port 8000
npm run frontend   # terminal 2 — port 4200
```

1. Open http://localhost:4200  
2. Login: **`develop`** mode uses email as token → seed user **`test`**  
3. Click through customers → tickets → one ticket → add item → add payment  
4. Note breaks in [Papercuts](#papercuts)

---

## Key commands

| Command | What |
|---------|------|
| `npm run db:reset` | Drop DB `mplos`, run `schema.sql` + seeds |
| `npm run backend` | API on :8000 |
| `npm run frontend` | Vite on :4200, proxies `/api` |
| `cd backend && npm run package` | Build `lambda.zip` |
| `cd frontend && npm run deploy` | S3 sync (needs AWS creds) |

Env reference: [00DOCS/ENV.md](./00DOCS/ENV.md)

---

## Architecture reminders (so you don’t rediscover)

```
Login → auth.middleware (who) → tenant.middleware (sets app.account_id on req.db)
     → router uses req.db + req.accountId
Postgres RLS blocks cross-tenant rows even if a query forgets WHERE account_id = ...
```

- **Tenant** = `accounts` row  
- **Business data** = `customers`, `tickets`, `products` have `account_id`  
- **Invoice status** = recomputed in `handleTicketStatus` via `invoiceStatus.js` when payments change  
- **Modals** = `ModalManager` + `useModalZussy` — copy this pattern for toasts  

---

## Git workflow (you + Otto)

When you had AI help:

- **Your lane:** `master` / `main` — commit before handoff  
- **Otto lane:** `agent/<task>` branches — merge when reviewed  

Handoff phrase if credits return:

```text
Handoff to Otto: saved on main. Branch agent/b1.7-toast. Do Phase A (A1–A5).
```

---

## Papercuts

| Date | What broke / felt wrong | Fixed? |
|------|-------------------------|--------|
| | | |
| | | |

---

## Parking lot (ideas — not v1 unless you promote them)

| Idea | Blocks v1? |
|------|------------|
| Customer subdomain | No — Phase 2 |
| Pretty drag-drop calendar | No |
| | |

---

## If you’re stuck

1. Read the error in browser Network tab + terminal.  
2. Run `npm run db:reset` if schema drift is suspected.  
3. Check `backend/.env` has `NODE_ENV=develop` and `DB_NAME=mplos`.  
4. Grep for `pool.query` in routers — protected routes should use `req.db`.  
5. Compare your change to `AGENT_QUEUE.md` exit criteria for that task.

---

## After v1 (Phase 2 — don’t start until dogfood is boring)

- Wildcard DNS + `{tenant}.mplos.com`  
- Customer auth on subdomain  
- Public service booking  
- Transactional email  
- Doc signing  

---

*You built a real foundation. Finish Phase A, then scheduling, then dogfood. That’s the path.*
