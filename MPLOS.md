# MPLOS — My Little POS

**A simple operating system for side hustlers and small business owners.**

MPLOS is multi-tenant SaaS: each business gets its own workspace and a customer-facing site on a subdomain (`yourbusiness.mplos.com`). Owners run the business from MPLOS; customers interact with *their* business—not with a generic platform.

---

## The problem

Side hustlers and small business owners (SBOs) rarely need enterprise software. They need to get paid, stay organized, and look professional without learning QuickBooks, stitching together five apps, or paying for features they will never use.

Most tools are built for either **big retail** (POS terminals, inventory warehouses) or **generic freelancing** (invoices only). Many real businesses sit in the middle: a mix of **services, products, quotes, and follow-up**—often handled with texts, Venmo, and spreadsheets.

---

## The grand play

MPLOS is the **first toolkit** an SBO actually finishes setting up.

1. **Sign up** — Create a business on MPLOS (one account, one brand).
2. **Run the business** — Customers, jobs/tickets, line items, payments, products, simple status tracking (quoted → sent → paid, and separately: waiting → in progress → done).
3. **Go live for customers** — The business gets **`{name}.mplos.com`**: a lightweight customer portal, not a full custom website project.

On that subdomain, *their* customers can (over time, as features ship):

- View past invoices and pay open balances  
- Browse and purchase products  
- Book or schedule services  
- Sign documents (quotes, waivers, agreements)  
- Or simply land on a clean **business page** with contact info and calls to action  

The owner uses MPLOS at the dashboard; the customer never needs to know what “MPLOS” is—they only see **the business they hired**.

---

## Who it’s for

| Audience | Role |
|----------|------|
| **Side hustlers** | Solo operators testing an idea; need professionalism on a budget. |
| **Small business owners** | 1–few person teams—especially **mobile service** work (come to the customer, quote, complete, get paid). |
| **Their customers** | People who want a normal link to pay, book, or review history—accounts only when repeat business makes it worth it. |

MPLOS is **not** for chains, franchises, or teams that need deep accounting, payroll, or warehouse ERP.

### Beachhead (who we build for first)

**Primary:** mobile service techs—**bicycle mechanics and bike service** are the reference customer (house calls, repair tickets, parts on the invoice, “picked up / in progress / done” separate from “quoted / sent / paid”).

**Natural overlap (same product, same flows):** any **product + service** operator—mobile detailing, small engine repair, tutors who sell materials, etc.

**Also fits:** small **makers selling physical goods online**—crystals, crafts, art prints—who need a simple shop and order flow without running a full e‑commerce platform.

We do not need separate products for each niche; we need **language and defaults** that feel right to bike techs first, then stay simple enough for the bleed-over cases.

---

## What MPLOS believes

- **Cheap** — Accessible subscription; no “contact sales” energy.  
- **Easy** — Obvious flows; minimal setup before “you’re live.”  
- **Crucial only** — Invoicing, getting paid, customer record, catalog/booking/docs as needed—not everything.  
- **Simply done** — One good way to do common tasks, not fifty settings.  

We are not trying to out-feature Square or out-account QuickBooks. We are trying to be the tool an SBO **actually uses every week** because it matches how they work.

---

## Merchant vs customer (two sides of one tenant)

```
┌─────────────────────────────────────────────────────────────┐
│  MPLOS (platform)                                           │
│                                                             │
│   Owner dashboard          Customer-facing site             │
│   (auth, manage business)  (subdomain, mostly public)      │
│                                                             │
│   app.mplos.com      →     {business}.mplos.com             │
│   · customers              · pay / view invoices            │
│   · tickets / jobs         · shop products                  │
│   · payments               · book services                  │
│   · products               · sign documents                 │
│   · settings               · landing / contact              │
└─────────────────────────────────────────────────────────────┘
```

Each **tenant** is one business. Data is isolated per tenant (shared infrastructure, strict separation in the database and application). Payments run through **Stripe Connect** so money goes to the business’s account; MPLOS can take a small platform fee where appropriate.

**Team access (v1 direction):** Multiple user logins per tenant from early on—partner, spouse, hired tech—all with the **same access** (read and write everywhere). **Role-based permissions** (admin vs staff vs read-only) are explicitly out of scope until later; keep the model simple while the product is small.

---

## How this is different (positioning)

- **Subdomain per business** — Customers get a dedicated front door, not “login to MPLOS.”  
- **Job/ticket mindset** — Built around quotes, work, and payment—not only a shopping cart.  
- **Payment and fulfillment are separate** — “Paid” and “done” are not the same thing (important for service businesses).  
- **Side-hustle scale** — Priced and scoped for people who will not adopt a 40-hour onboarding.  

---

## What’s in scope (vision) vs later

**Core (the wedge)**  
Customers, tickets/invoices, line items, recording payments, sending pay links, basic product catalog, business subdomain with at least a landing page and invoice visibility.

**Next rings (still “simple,” not “suite”)**  
Scheduling for service products, document signing via a trusted provider, storefront purchases, transactional email (confirmations, pay reminders).

**Later (customer-facing)**  
Repeat-customer accounts on `{business}.mplos.com`, then **rewards** and **subscriptions** for businesses that want loyalty or recurring revenue—not required for v1.

**Explicitly not the goal**  
Full accounting, payroll, marketing automation, enterprise inventory, custom mobile apps per tenant, or competing on feature checklists with incumbents.

---

## Business model (direction)

- **~$10 / month** per business as the anchor price—roughly a phone bill, not a software procurement. Tiering (limits, team size, features) is still being designed; details TBD.  
- Optional small fee on card payments via Stripe Connect (only where it stays fair and transparent).  
- **Custom domains** (e.g. `pay.yourbrand.com`) are not self-serve: businesses contact us for **custom pricing** and a tailored setup.

Pricing should feel obvious before signup: cheap, predictable, no sales call for the standard product.

---

## Status

MPLOS is in **active development**. The foundation exists (auth, tickets, customers, payments, Stripe Connect wiring, multi-account schema). Customer subdomains, scheduling, signing, and storefront flows are part of the product direction—not all shipped yet.

Phased delivery: **[ROADMAP.md](./ROADMAP.md)** (your pick-list) and **[AGENT_QUEUE.md](./AGENT_QUEUE.md)** (AI task order).

---

## Product decisions (locked)

| Topic | Decision |
|--------|----------|
| **First vertical** | Mobile service techs; **bicycle service** as the design reference. Same core product serves product+service bleed-over and small online makers (physical goods). |
| **Customer accounts** | Not required at launch. **Eventually:** repeat customers get accounts on the business subdomain; later still: rewards and subscriptions where the business wants them. |
| **Domains** | Standard: `{slug}.mplos.com`. **Custom domains:** by request only, custom pricing—not part of the self-serve $10 product. |
| **Pricing** | **~$10/month** target; tier structure still in progress. |
| **Team logins** | **Multiple users per tenant early**; flat access for all (no roles yet). RBAC deferred. |

### Still open

- **Free / trial tier** — Forever-free with caps vs time-limited trial only.  
- **Document signing** — Provider choice and whether cost is bundled in subscription or passed through.  

When these are decided, update this section and `ROADMAP.md` / `AGENT_QUEUE.md`.

---

## Name

**MPLOS** — *My Little POS* — small on purpose. Not “enterprise POS,” not “growth OS.” A little system that grows with a little business.

---

*Last updated: June 2026*
