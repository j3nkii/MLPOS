# MPLOS roadmap (you)

This is **your** map: wander-friendly, pick what pulls you, no guilt.  
The guardrails live in **[AGENT_QUEUE.md](./AGENT_QUEUE.md)** — precise order for AI sessions.

**Product story:** [MPLOS.md](./MPLOS.md)

---

## How to use this (ADHD-friendly)

1. **You will go rogue.** That’s allowed. Dump ideas in [Parking lot](#parking-lot) and keep moving.
2. **Pick one “today” item** from the menu below—or tell the agent “I’m doing X” and let it update the queue.
3. **Don’t read the agent queue** unless you’re curious. It’s homework for the AI.
4. When something ships, move it to [Wins](#wins). Small wins count.
5. If you broke prod: note it under [Oops shelf](#oops-shelf), fix when bored—not instead of sleep.

**Session starters (copy into chat):**

- `I'm scattered — pick one small task from the queue and talk me through it.`
- `I went rogue on [X] — reconcile the queue and parking lot.`
- `I only have 30 minutes — what's the smallest useful thing?`
- `I want to play with [idea] — park it properly and tell me if it blocks v1.`

---

## North star (read when lost)

**v1:** Internal tool only (no customer subdomain yet). A mobile bike tech (or you) can run customers → appointments → tickets → pay links / payments → job status. ~$10/mo product later; **dogfood first**.

**Not v1:** `{business}.mplos.com`, public booking, doc signing, roles, custom domains, rewards/subscriptions.

---

## Suggested focus (soft default — override anytime)

```text
Now-ish:  Trust the core  →  Scheduling (internal)  →  Second login  →  Dogfood in prod
```

You can swap order. Agent queue assumes this unless you say otherwise.

---

## Menu (pick up anytime)

Check boxes when *you* feel done. Agent may also mark its queue—if they disagree, chat wins.

### 🧱 Foundation & sanity

- [ ] Schema matches code (`product_id`, ticket statuses, seeds run clean)
- [ ] Env cheat sheet (local vs Lambda: DB, Cognito, Stripe)
- [ ] “How we deploy” half-page (build fe → zip be → terraform/apply)
- [ ] Infra tighten when it bugs you (RDS public access, Stripe on Lambda)

### 🔐 Auth & trust

- [ ] Login works in `develop` and `production`
- [ ] `/api/user` returns the logged-in user reliably
- [ ] Every `:id` route checks “this belongs to my business”
- [ ] 401 handler / logout feels sane

### 🎫 Tickets & money (core loop)

- [ ] Create customer → ticket → line items → total makes sense
- [ ] Record payment / balance updates
- [ ] Send pay link (Stripe) without weird failures
- [ ] Invoice status updates when paid (quote → sent → paid)
- [ ] Products CRUD actually works
- [ ] Ticket detail doesn’t require loading every ticket (optional nice)

### 📅 Scheduling (v1 add-on)

- [ ] Service products (duration + price)
- [ ] Appointment: customer + time + service
- [ ] Calendar or list week view
- [ ] Blocked time / simple business hours
- [ ] Link appointment → ticket (can be manual at first)

### 👥 Team

- [ ] Two users, same business, same power (no roles yet)
- [ ] Queries scoped by account, not random `user_id` drift

### 🚲 Dogfood

- [ ] You run 5+ real jobs in prod (or one shop does)
- [ ] List of papercuts in parking lot or oops shelf

---

## Parking lot (rogue ideas go here)

*Not v1 unless you promote them. Getting them out of your head is the point.*

| Idea | Notes | Blocks v1? |
|------|--------|------------|
| | | |
| Customer subdomain | Phase 2 | No — park it |
| Pretty calendar drag-drop | Nice | No |
| | | |

---

## Wins (done = dopamine)

- [x] Product vision doc — `MPLOS.md`
- [x] AWS skeleton — `infra/` (CloudFront + S3 + Lambda + RDS + Cognito)
- [x] Dashboard prototype — customers, tickets, payments, products (rough)

---

## Oops shelf (broken / messy — fix later)

| What | When | Fixed? |
|------|------|--------|
| | | |

---

## Later horizon (Phase 2+)

Don't build these in a late-night spiral unless you **promote** them with a chat: “promote X from parking lot.”

- `{slug}.mplos.com` customer site  
- Customer accounts, rewards, subscriptions  
- Email/SMS notifications  
- Doc signing  
- Custom domains ($$$ manual)  
- Tiering above $10/mo  
- Roles / RBAC  

---

## You ↔ agent contract

| You | Agent |
|-----|--------|
| Pick from menu, go rogue, break things | Keeps [AGENT_QUEUE.md](./AGENT_QUEUE.md), says what’s **NEXT** |
| Say what you actually did | Updates queue + parking lot after sessions |
| “Promote” something from parking lot | Re-orders queue, warns about scope |
| Skip reading the long queue | Reads infra, schema, reviews, precise tasks |

**Rule:** Rogue work is fine. Untracked rogue work is what hurts—30 seconds in parking lot saves hours of confusion.

---

*Last updated: June 2026*
