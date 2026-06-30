---
name: eastbase-launch-check
description: >-
  Eastbase Studio's practical pre-launch readiness gate. Use this WHEN someone is about to
  launch, publish, announce, ship, sell, or meaningfully update an eastbase product and
  asks whether it's ready — "check before launch", "pre-launch check", "ready to release /
  can I publish this", "production / go-live readiness", "final audit", "release check",
  "go-live checklist", "before the Product Hunt / Reddit / X / LinkedIn launch", "check
  this SaaS / Kit before selling", or "can users cheat purchase/access". It runs a
  high-signal readiness review across the real launch surface of a small SaaS, AI tool,
  landing page, internal tool, or Eastbase Kit (Next.js / App Router / Drizzle / Neon /
  BetterAuth / Lemon Squeezy / Resend / Cloudflare / Sentry / PostHog / OpenAI / Anthropic /
  Vercel): product clarity, core user flow, auth/access, billing/entitlement,
  database/migrations, env/deploy, email, legal/trust pages, SEO/OG, observability, AI cost,
  UX polish, kit completeness, and docs. It is NOT a security audit, legal audit,
  penetration test, or enterprise compliance framework — it answers one question: is this
  safe, clear, functional, and credible enough to launch? Produces a verdict (Ready to
  launch / Ready with caveats / Not ready / Needs manual verification) with launch blockers
  vs follow-ups, P0–P3 severity, and manual-verification + production-config checklists.
  Do NOT trigger for ordinary implementation, code review, UI polish, migration design,
  copywriting, metrics/data questions, or explaining how existing code works UNLESS the user
  is explicitly asking whether the product/page/update is ready to launch. For reviewing a
  specific PR/diff before merge, defer to eastbase-review-pr; when the blocker is UI quality,
  defer to eastbase-premium-ui. Not for non-eastbase projects.
---

# Eastbase Launch Check

This is a **practical launch gate**, not an audit. It is not a security audit, legal
review, penetration test, or enterprise compliance framework — it is the fast, high-signal
pass that catches the handful of mistakes that actually embarrass a launch. It answers one
question: **is this product safe, clear, functional, and credible enough to launch?**

Eastbase ships small products fast. An early-stage product is *allowed* to launch with rough
edges — a thin settings page, a missing nicety, a feature marked "coming soon." It is **not**
allowed to launch with broken auth, broken billing, a broken core flow, misleading public
claims, leaked secrets, data-loss risk, or an AI feature that can run up an unbounded bill.
The gate's whole job is to separate the rough edges (fine) from the launch blockers (not).

> **Check the real launch surface, not a theoretical one.** Walk the product the way a first
> user will — land on the page, sign up, do the core thing, hit an error, try it on a phone.
> Then check the things a user can't see but a launch depends on — env vars, webhooks, the
> production database, the AI cost ceiling. Judge *what this product actually is* (paid SaaS,
> free beta, internal tool, Kit), not an enterprise checklist it was never meant to be.

## How to use this gate

- **High-signal, not exhaustive.** Don't dump a 100-line generic checklist unless asked.
  Surface the blockers, the few high-priority fixes, and the things only a human can verify.
- **What you can't verify from the code, you don't get to pass.** Production env vars,
  domain/DNS, the live webhook, the deployed AI limits — if you can't see them in the repo,
  put them in **Manual verification** or **Production configuration**, never in "done."
- **Calibrate to the product type.** A paid SaaS, a free beta, an internal tool, and a Kit
  each get a different weighting — what the product *is* decides which surfaces get the
  strict pass. See *Adapt by product type* below.
- **Smallest fix that makes launch safer.** Don't recommend enterprise architecture; a
  pre-launch product needs the guardrail, not the platform.
- **Combine, don't duplicate.** Use `eastbase-review-pr` to gate a specific PR/diff before
  merge, `eastbase-premium-ui` when the blocker is UI quality / generic-demo appearance, and
  your security/testing/framework skills for deeper implementation checks. Stay on launch
  readiness.
- **No legal advice.** On Terms/Privacy/legal pages, only check consistency, placeholders,
  support email, operator naming, broken links, and obvious mismatch with how the product
  behaves.

## The launch question, in twelve checks

1. Can a real user **understand the product quickly**?
2. Can a real user **sign up, sign in, run the core flow, and recover from errors**?
3. If paid, can a user **buy correctly and access only what they bought**?
4. Are **auth, billing, entitlements, and protected routes enforced server-side**?
5. Are **env vars, webhooks, domains, email, storage, database, and deploy** configured?
6. Are the **important failure states** handled clearly?
7. Is **error tracking / analytics** enough to understand early usage and failures?
8. Are **marketing claims credible** and not overpromising?
9. Are **Terms, Privacy, support email, and operator naming** consistent enough to launch?
10. Are **AI/API costs bounded and observable**?
11. Is it **polished enough not to look like a generic unfinished demo**?
12. Is it **ready to launch now, launch with caveats, or not ready**?

## What blocks a launch, and what doesn't

**Block** (P0/P1) only on things that actually hurt real users or the business at launch:

- A **broken core flow** — signup, sign-in, the primary success path, or checkout fails.
- **Auth / access bypass** — protected data or actions reachable by the wrong (or no) user.
- **Billing broken or bypassable** — wrong charges, or paid features/Kits reachable for free
  by guessing a URL or API call; missing server-side entitlement checks.
- **Secret exposure** — keys in the client bundle, logs, or the repo.
- **Production env / data risk** — destructive migration with no plan, dev DB wired to prod,
  storage bucket public by default.
- **Uncontrolled AI cost** — a user-triggered or background path that can run up an unbounded
  bill.
- **Misleading public claims** — the landing page promises something the product doesn't do.

**Do not block** on: polish, missing-but-non-essential features, speculative scale ("won't
handle 1M users"), enterprise architecture, or best-practice wishlists. Those are
high-priority fixes or follow-ups, not launch blockers.

## Severity

Tag every launch blocker P0 or P1; use P2/P3 where it aids triage. Don't force a level onto
a minor note.

- **P0** — must not launch. Security / billing / data / access / cost-disaster risk.
- **P1** — should fix before launch. Serious user-facing or operational risk.
- **P2** — fix soon. Meaningful, not always launch-blocking.
- **P3** — polish or post-launch improvement.

## Launch surfaces to check

A **risk map to walk selectively — not a checklist to read aloud.** Cover the surfaces this
product actually exposes, and raise only what carries real launch risk. Each area names its
Eastbase-specific angle; defer generic depth to the skill that owns it.

### 1. Product clarity & positioning
- Is the **value clear above the fold**, the **target user** obvious, and the **primary CTA**
  unmistakable?
- Are **claims realistic** (not "the only X you'll ever need") and is **pricing / trial /
  free / beta** status clear where it applies?
- Do **screenshots / demo / examples** look real, and does the product **read as a product,
  not a placeholder demo**?

### 2. Core user flow
Walk it end to end as a brand-new user, on desktop *and* a phone:
- **Sign up → onboarding → the primary success path → sign out**, then back in — including
  the **core create/read/update/delete** on the main record. Does a new user know their
  **first action**?
- The **first-run empty state**, **loading**, **form validation**, and the **error path** all
  behave (not dead "No data", not a blank screen on failure).
- **Permission-denied** and **account/settings** flows behave where they exist.

### 3. Auth & access control
- **BetterAuth session checks** on every protected route, server action, and route handler —
  enforced **server-side**, never client-only.
- **Owner / team / resource checks** on each record (filter by the current user/org, don't
  trust an ID from the request); **public vs private** boundaries correct.
- **Admin-only** behavior unreachable by normal users; **redirects** are safe (no open
  redirect); **account deletion/export** behaves if implemented.

### 4. Billing & entitlements (Lemon Squeezy)
Strict for any paid product or Kit:
- **Webhook signature verified** and **idempotent** (replays don't double-grant/charge).
- **Entitlement enforced server-side** — a user **cannot reach a paid product / Kit by
  guessing a URL or API call**; no client-only `isPro` gate.
- **Lifecycle handled**: cancel / expire / refund / past-due / up- & downgrade — and the
  **stored subscription/purchase state is the source of truth** for entitlement, so access
  revokes when it should.
- **Product/variant mapping** is correct and the **pricing page matches the actual billing
  setup** (plans, prices, what each unlocks).

### 5. Database & migration readiness (Drizzle / Neon)
- **Schema + migrations exist** and apply cleanly; **fields / defaults / nullability** are
  sane; **ownership fields** and **unique constraints** present where the app assumes them.
- **Cascade / delete** behavior is intentional; **no destructive / irreversible migration**
  ships without a backup or a documented plan.
- **Production DB is separate from dev**, and **seed/demo data isn't accidentally required**
  in production.

### 6. Environment & deployment (Vercel)
- **`.env.example` is current** and every **required production env var is documented**; **no
  secrets committed**.
- **Domain configured**, **canonical / redirects** correct, **preview vs production** behavior
  clear; **cron / background jobs** scheduled if the product needs them.
- **File upload / storage (R2) settings are production-safe** (not public-by-default);
  **region / runtime** assumptions reasonable.

### 7. Email & support (Resend)
- **Sender domain verified** and **from / reply-to** appropriate — or transactional mail
  silently bounces at launch.
- **Support uses the house convention** `support@eastbase.studio` where a shared address
  fits; **transactional copy isn't still placeholder**, and **support/contact links work**.
- Emails fire **only when appropriate** and **failures degrade gracefully** (a failed email
  doesn't break the signup).

### 8. Legal, trust & public pages
*(Consistency only — not legal advice.)*
- **Terms** exists if the product is public/paid; **Privacy** exists if it collects user
  data; **support/contact** info is present.
- **Operator naming is consistent** — use **`Eastbase Studio`** where a public
  operator/company name is needed; **no fake legal entity**, **no outdated placeholders**,
  **no broken legal links**, and **no unsupported compliance claims**.
- Legal pages **roughly match actual behavior** (don't claim "we never store X" if the app
  stores X).

### 9. SEO, sharing & metadata
- The **social-share card renders intentionally** — the Product Hunt / X / LinkedIn share
  isn't a bare link: **OG / Twitter card + OG image**, plus **title / description**,
  **canonical URL**, **favicon / app icons**, and **sitemap / robots** where relevant.
- **Public pages carry no internal/demo wording** — no "test", "lorem", "TODO", or a
  localhost link shipped to real visitors.

### 10. Observability & analytics
- **Errors reach Sentry** (or equivalent) with context; server errors are **handled
  meaningfully**, not swallowed.
- **Analytics covers the core funnel** (signup → activation → purchase, plus failure points
  and AI usage where relevant) so launch day is measurable — with **no secrets/PII in
  logs or events**.

### 11. AI / API cost & safety
Strict for any AI feature — this is where an Eastbase launch quietly bleeds money:
- **Rate limits** on user-triggered generation and **a budget / usage cap that fails closed**
  — a user (or a loop) **cannot explode cost**.
- **Sane `max_tokens` / output caps**, **timeouts**, and **bounded retries** — no path that
  spins or fans out forever; **background / cron AI calls** have a per-run ceiling.
- **Reasonable model choice** (not the flagship where a cheaper model is plainly enough) and a
  **graceful fallback** when the provider errors or times out.
- **Usage logged** by feature / user / model so spend is observable — wire in or leave a hook
  for a cost-tracking surface (BurnCap-style) rather than launching blind.

### 12. UX polish & credibility
- Does it **read as a real product, not an unfinished template** — product-specific detail,
  **human copy**, clear **dashboard / table / chart** states, unbroken **mobile**, and
  **accessibility basics**? (The functional empty / loading / error walk lives in §2.)
- If **UI quality is the blocker**, this gate flags it and **hands off to
  `eastbase-premium-ui`** for the actual design judgment.

### 13. Templates / Eastbase Kits
Strict — a Kit is a product the buyer has to run themselves:
- The Kit is **more than a landing page**: sign-in / sign-up, Terms / Privacy, and
  **niche-relevant screens** are present where appropriate.
- **Setup docs are clear** and the buyer can **fill in env and run it** (`.env.example`
  complete, per §6), and **AI-agent support files** (`AGENTS.md` / `DESIGN.md` / relevant
  docs) exist so a future agent can extend it.
- The buyer can **understand how to customize and deploy**, **purchased access is enforced**,
  and **demo content doesn't look like unfinished placeholder**.

### 14. Documentation & maintainability
- **README + setup instructions are current and actually work** (env/setup completeness
  per §6); architecture/workflow changes reflected in **`AGENTS.md` / `DESIGN.md` /
  `/architecture`**.
- **Key integrations documented** and **launch-affecting known limitations written down**, so
  a future agent (or you, in a month) doesn't have to rediscover the project.

## Adapt by product type

The gate weights differently depending on what's launching:

- **Paid SaaS / Kit** → §4 and §13 get the strict pass; a billing/entitlement bypass is a P0.
- **AI product** → §11 gets the strict pass; an unbounded user- or cron-triggered cost path
  is a P0.
- **Internal-only tool** → §4 (billing), §8 (legal), and §9 (SEO) may be optional — but §3
  (auth), §5 (data), §6 (env), and §2 (core flow) still hold.
- **Free / beta** → make sure the **public copy says so**; don't hold it to paid-product bars.

## Output format

Produce the launch review in this shape. Keep each section tight; omit a section that's
genuinely empty (except Launch verdict and Summary).

**Launch verdict:** `Ready to launch` · `Ready with caveats` · `Not ready` · `Needs manual
verification`

**Summary:** 3–5 sentences — readiness, the main risk level, and whether it can be safely
announced/published now.

**Launch blockers:** must fix before launch — only serious issues (broken core flow,
auth/access bypass, broken/bypassable billing, missing entitlement checks, secret exposure,
production-env or data-loss risk, uncontrolled AI cost, or misleading public claims). For
each: the file/area, *why it blocks*, the **smallest fix**, and a **P0/P1** tag.

**High-priority fixes:** should fix before or right after launch — important, not always
blocking (often P2).

**Nice follow-ups:** polish or post-launch improvements (P3).

**Manual verification checklist:** concrete flows to test in the browser before launching —
auth, billing/checkout, the core flow, mobile, email delivery, the live webhook, the error
path, and the public pages, where relevant.

**Production configuration checklist:** env vars, domains, webhooks, email sender, storage,
analytics/error tracking, cron jobs, and deploy settings to confirm in the live
environment — the things the repo can't prove for you.

**Eastbase-specific notes:** product trust, launch messaging, AI cost, Kit completeness,
support-email / operator naming, and agent maintainability — the observations a generic
readiness checklist would miss.

A worked example in this format is in `references/example-launch-review.md`.

## Before you finalize (self-check)

- **No invented blockers.** Every blocker is supported by the code or a concrete launch risk.
- **Didn't claim production is configured** when the repo can't prove it — those went to
  Manual verification / Production configuration.
- **Didn't turn every best practice into a blocker**, or recommend enterprise architecture a
  pre-launch product doesn't need.
- **Calibrated to the product type** (paid → billing, AI → cost, Kit → setup/access,
  internal → auth/data/env/core).
- **No legal advice** — only flagged consistency, placeholders, and obvious mismatch.
- **Smallest practical fix** named for each blocker, and **launch blockers separated from
  follow-ups**.

## References

- `references/example-launch-review.md` — a full worked launch review in the house format on
  a realistic paid AI product about to go live, showing the calibration: what becomes a P0
  launch blocker, what's a high-priority fix, what is deliberately deferred, and how the
  Manual-verification, Production-configuration, and Eastbase-specific sections earn their
  place.
