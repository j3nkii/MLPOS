# My Little POS (MPLOS) — Product Roadmap

> **Solo Founder Edition** | Stack: React · Node/Express · Serverless Lambda · AWS · PostgreSQL
> Last updated: April 2026

---

## Vision

MPLOS is a multi-tenant SaaS "first toolkit" for startup businesses and side hustlers. A tenant admin manages their entire business at `mplos.com/dashboard`, while their customers interact with a branded storefront and booking experience at `{tenant}.mplos.com`.

---

## Architecture Decisions (Locked)

| Concern | Decision | Notes |
|---|---|---|
| Multi-tenancy DB | Shared Postgres, `tenant_id` on every table | Enforce at app layer + Postgres RLS policies |
| Payments | Stripe Connect (Standard or Express) | Each tenant owns their Stripe account; MPLOS takes platform fee |
| Subdomain routing | Wildcard DNS → CloudFront + Lambda@Edge | Resolve tenant from hostname on every request |
| Doc signing (v1) | Third-party API (HelloSign / Dropbox Sign) | Cost passed to tenant; DIY migration in future phase |
| Hosting | AWS Lambda (serverless-express) + RDS Postgres + S3 + CloudFront | |
| Auth | JWT-based, separate auth contexts for tenant-admin vs end-user | |

---

## Known Risks & Plot Holes

These must be resolved **before or during Phase 1** or they will block everything downstream.

### 🔴 Critical

**1. Inventory data model ambiguity**
A "product" in MPLOS is not one thing. A tattoo shop sells *time* (appointment slot). A boutique sells *things* (physical SKU). Some sell both (custom candle + installation booking). Your `inventory` entity needs a `type` discriminator: `PHYSICAL | SERVICE | BUNDLE`. Scheduling links to `SERVICE` types; eCommerce links to `PHYSICAL` and `BUNDLE`. Design this schema before writing any feature code.

**2. Subdomain routing is infrastructure, not a feature**
Dynamically resolving `anytenant.mplos.com` requires a wildcard SSL cert (ACM), a wildcard CloudFront distribution, and a Lambda@Edge origin-request function that reads the hostname, looks up the tenant, and injects tenant context into the request. This must be built in Phase 0 — it cannot be bolted on later without rewriting your routing and auth layers.

**3. Stripe Connect onboarding is a UX flow, not just an API call**
Tenant onboarding is incomplete until they finish Stripe's OAuth/Connect flow. You need to handle: initiated-but-not-completed, restricted accounts, deauthorization, and webhook forwarding per-tenant. Build a "payment setup status" state machine into the tenant model from day one.

**4. Tenant data isolation enforcement**
Row-level isolation via `tenant_id` is only safe if it is enforced at *every* query. One missing `WHERE tenant_id = ?` is a data leak. Recommended mitigation: use Postgres Row-Level Security (RLS) with a `SET app.current_tenant` session variable, so the DB itself rejects cross-tenant queries. Do not rely solely on application-layer filtering.

### 🟡 Medium

**5. Notifications are missing from your feature list**
This is not optional for an MVP with scheduling. You need at minimum: appointment confirmation (customer), appointment reminder (customer, 24hr before), invoice "pay now" (customer), and new booking alert (tenant). This is a full sub-system: transactional email (SES or Postmark), optional SMS (Twilio), and a notification preferences model. Plan for it in Phase 2.

**6. Tenant onboarding wizard**
A non-technical side hustler cannot be dropped into a blank dashboard. You need a linear setup wizard: business info → Stripe Connect → first service/product → subdomain confirmation → "you're live" screen. This is arguably the most important UX in the entire product. Scope it explicitly — do not treat it as a nice-to-have.

**7. File/asset storage strategy**
Invoice PDFs, signed documents, product images, and logo uploads all need a home. S3 + pre-signed URLs is the right call on your stack. Define a bucket key structure per tenant (`/tenants/{tenant_id}/...`) early so you don't refactor storage paths mid-build.

**8. Freemium tier limits need a gating layer**
Even though pricing is out of scope for this document, your code needs a `plan` field on the tenant model and a central feature-gate utility from day one. Retrofitting usage limits into 10 features later is painful. Build the hook; leave the thresholds as config.

### 🟢 Low / Future

- **Tax handling**: Stripe Tax can cover this if you configure it in Connect — note it for post-MVP.
- **Doc signing DIY migration**: Viable after you have cash flow to justify infra cost. Design the signing schema so the provider is swappable (store `provider: 'hellosign' | 'internal'` on each document record).
- **Mobile app**: PWA-first is the right call for v1 given solo capacity.

---

## Core Entities

```
Tenant              — the business account (+ plan, subdomain, stripe_account_id)
User                — tenant admin users (role-based)
Customer            — end users tied to a tenant
Product             — inventory item (type: PHYSICAL | SERVICE | BUNDLE)
ServiceSlot         — bookable time block, linked to a SERVICE product
Appointment         — a customer booking of a ServiceSlot
Invoice             — line items, status, payment link
Payment             — Stripe PaymentIntent record, linked to Invoice
Document            — signable doc, linked to Appointment or Invoice
Notification        — outbound notification log (email/SMS)
StorefrontConfig    — tenant's public-facing site settings
```

---

## Phases

---

### Phase 0 — Foundation *(~3–4 weeks)*
> Goal: Infrastructure is live. A tenant can be created and their subdomain resolves.

- [ ] AWS environment setup (RDS Postgres, Lambda, S3, CloudFront, ACM wildcard cert)
- [ ] Wildcard subdomain routing (Lambda@Edge hostname → tenant resolution)
- [ ] Core DB schema with `tenant_id` on all tables + Postgres RLS
- [ ] Tenant provisioning (create record, assign subdomain)
- [ ] Auth system: tenant-admin login (`mplos.com`) + customer session (`{tenant}.mplos.com`) — separate JWT contexts
- [ ] Feature-gate utility stub (`canAccess(tenant, feature)`)
- [ ] S3 asset storage conventions (`/tenants/{id}/...`)
- [ ] CI/CD pipeline (GitHub Actions → Lambda deploy)

**Exit criteria:** Navigate to `demo.mplos.com` → see a tenant-specific response. Auth works on both contexts.

---

### Phase 1 — Tenant Dashboard MVP *(~5–6 weeks)*
> Goal: A tenant can manage their business entirely from the dashboard.

- [ ] Tenant onboarding wizard (business info → Stripe Connect → first product → go live)
- [ ] Stripe Connect OAuth flow + account status state machine
- [ ] Product/Inventory CRUD (with `type` discriminator: PHYSICAL | SERVICE | BUNDLE)
- [ ] Services management (linked to SERVICE products, define duration/price)
- [ ] Scheduling: tenant calendar view, availability configuration, block/unblock slots
- [ ] Invoice creation, line items, status tracking (draft → sent → paid → void)
- [ ] Basic customer record management (CRM lite)
- [ ] Tenant settings: branding (logo, colors), business info, subdomain config
- [ ] StorefrontConfig: toggle which features are public-facing

**Exit criteria:** A real business could run their back office entirely in the dashboard.

---

### Phase 2 — Customer-Facing Subdomain *(~4–5 weeks)*
> Goal: `{tenant}.mplos.com` is a functional, live-facing product.

- [ ] Public storefront shell (tenant branding applied, responsive)
- [ ] Service booking flow: browse services → pick slot → customer info → confirm
- [ ] Checkout: Stripe Payment Element (routed to tenant's Connect account + MPLOS platform fee)
- [ ] eCommerce product listing + cart + checkout (PHYSICAL products)
- [ ] Customer account creation + login on subdomain
- [ ] Customer booking/order history view
- [ ] Invoice pay-now flow (customer receives link, pays via Stripe)
- [ ] Notifications sub-system: transactional email via SES/Postmark
  - Booking confirmation
  - Appointment reminder (24hr)
  - Invoice payment link
  - New booking alert (to tenant)

**Exit criteria:** A customer can discover services, book an appointment, and pay — entirely on the subdomain.

---

### Phase 3 — Document Signing & eCommerce Polish *(~3–4 weeks)*
> Goal: Legally complete flows + full eCommerce feature parity.

- [ ] Doc signing integration (HelloSign/Dropbox Sign API)
  - Template upload by tenant
  - Send-for-signature triggered on appointment confirmation or manually
  - Signed doc stored to S3, linked to appointment/invoice
  - `provider` field on Document model (prep for future DIY migration)
- [ ] Product variants (size, color — for PHYSICAL products)
- [ ] Inventory quantity tracking + low-stock alerts
- [ ] Discount codes / simple promotions
- [ ] SMS notifications (Twilio, opt-in, tenant-configurable)
- [ ] Tenant dashboard analytics v0: revenue, bookings, top products (date-range filters)

**Exit criteria:** A tattoo shop can book a client, send a consent form for signature, collect payment, and have a record of the complete transaction.

---

### Phase 4 — Hardening & Public Launch *(~2–3 weeks)*
> Goal: Production-ready, publicly launchable.

- [ ] Rate limiting + abuse protection (API Gateway throttling, per-tenant limits)
- [ ] Full error boundary + fallback UI for subdomain (tenant not found, suspended, etc.)
- [ ] Tenant suspension / account lifecycle management
- [ ] GDPR/data basics: customer data export, delete-account flows
- [ ] Audit log for tenant admin actions
- [ ] End-to-end test suite (Playwright, critical customer paths)
- [ ] Load testing subdomain routing layer
- [ ] Runbook: deploy, rollback, DB migration procedure
- [ ] Pricing/plan config wired to feature-gate utility

**Exit criteria:** Product is stable enough for public beta with real tenants.

---

### Phase 5 — Post-Launch Backlog *(Future)*

- [ ] Doc signing: DIY internal implementation (swap `provider` to `'internal'`)
- [ ] Marketing & metrics tools (email campaigns, conversion tracking)
- [ ] Mobile PWA refinement
- [ ] Stripe Tax configuration
- [ ] Tenant-to-tenant marketplace / referral features
- [ ] White-label / custom domain support (`mybusiness.com` instead of `mybusiness.mplos.com`)
- [ ] Webhooks API for tenants (let them push events to their own tools)
- [ ] Public API for power-user tenants

---

## Solo Founder Guidance

Given that this is a solo build, the following principles apply to this roadmap:

- **Never work across two phases at once.** Each phase exit criteria is a forcing function. Resist feature creep into the next phase until the current one is done and stable.
- **Phase 0 is non-negotiable.** The temptation will be to skip infrastructure and prototype features. Don't. The subdomain routing and RLS decisions are load-bearing — changing them mid-build is a rewrite.
- **The onboarding wizard is your marketing.** The moment a new tenant is "live" is your word-of-mouth moment. Polish it before you polish anything else.
- **Defer Doc Signing DIY.** The third-party integration is a few API calls. Building compliant e-signature infrastructure is a months-long detour. Lock the Phase 3 scope to the integration only.
- **Ship Phase 2 to at least one real tenant before Phase 3.** Real usage will invalidate assumptions faster than any planning exercise.