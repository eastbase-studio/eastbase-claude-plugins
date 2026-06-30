# Reference: A worked Eastbase launch review

> **⚠ This is ONE launch review of ONE product — not a template to fill in.** It exists to
> calibrate *judgment*: what becomes a P0 launch blocker, what's a high-priority fix, what is
> deliberately deferred, and what belongs in the Manual-verification / Production-config /
> Eastbase-specific sections. Copy the **shape and the signal/noise ratio**, not the specific
> findings — a real review only contains what the product actually supports.

## The product under review (context)

> **PostParrot** — a paid AI tool that turns one blog post into a week of social posts.
> Launching on Product Hunt in two days. Stack: Next.js App Router on Vercel, Neon + Drizzle,
> BetterAuth, Lemon Squeezy (one-time "Pro" unlock), Resend, OpenAI. The user asked: *"check
> before launch — is PostParrot ready to go live on Product Hunt?"*
>
> **Launch surface:** public landing page, sign-up/sign-in, a generator (`POST
> /api/generate` → loops over the requested post count, calls OpenAI per post), a Pro
> checkout, Terms/Privacy pages.

This is a **paid AI product**, so §4 (billing/entitlement) and §11 (AI cost) get the strict
pass. The review below is what that looks like.

---

## Launch review

**Launch verdict:** `Not ready`

**Summary:** PostParrot is close — the core idea is clear, the landing page reads well, and
the generate flow works. But two issues block a public launch: the generator enforces the
Pro unlock only in the UI, so anyone can call the API directly and use it for free, and it
has no rate limit or output cap, so a single user (or a curious Product Hunt crowd) can run
up an unbounded OpenAI bill. Both are small, targeted fixes. A few config items (webhook
idempotency, Resend domain, OG image) should land before you post the link.

**Launch blockers:**

- **P0 — Entitlement enforced only in the client** (`src/app/api/generate/route.ts`). The
  Pro check lives in the React component that hides the button; the route handler itself
  never verifies entitlement — it only checks that a session exists. Any signed-in free user
  can `POST /api/generate` directly and get unlimited paid generations. *Why it blocks:* the
  paid product is free to anyone who opens devtools. *Smallest fix:* in the route, load the
  user's Pro entitlement server-side and reject (402/403) when absent — the same check the UI
  already does, moved to where it's enforceable.

- **P0 — Generator has no rate limit or output ceiling** (`src/app/api/generate/route.ts`).
  The handler loops `for (post of requestedPosts)` and calls OpenAI once per post, with the
  count taken from the request body and no upper bound, no per-user rate limit, and no
  `max_tokens`. A user can ask for 500 posts; Product Hunt traffic can fan this out across
  many users at once. *Why it blocks:* a launch-day spike becomes an unbounded OpenAI bill.
  *Smallest fix:* clamp the post count (e.g. ≤14), set a sane `max_tokens`, and add a simple
  per-user rate limit on the route. A daily usage cap that fails closed is the stronger
  follow-up.

**High-priority fixes:**

- **P1 — Lemon Squeezy webhook isn't idempotent** (`src/app/api/webhooks/lemon/route.ts`).
  Signature *is* verified (good), but a replayed `order_created` re-grants Pro and re-sends
  the receipt email. *Fix:* dedupe on `event_id` (unique constraint or a processed ledger)
  and no-op on a seen id. Not strictly launch-blocking, but cheap and worth doing first.
- **P1 — Resend sender is still the sandbox domain** (`from: "PostParrot
  <onboarding@resend.dev>"`). Welcome and receipt emails will land in spam or bounce for real
  users. *Fix:* send from a verified `@postparrot.app` (or the chosen) domain before launch.
- **P2 — No OG image / social card metadata.** The Product Hunt and X shares will render a
  bare link. *Fix:* add an OG image + `openGraph`/`twitter` metadata — this *is* part of a
  launch.
- **P2 — API route errors aren't reaching Sentry.** Sentry is wired for the client but the
  `/api/generate` catch block just returns a 500. Launch-day failures will be invisible.

**Nice follow-ups:**

- **P3 —** No PostHog event on generate/activation — worth adding to read launch-day funnel.
- **P3 —** Settings page is a single "Sign out" button; fine for launch, flesh out later.

**Manual verification checklist:**

- **Auth + core flow:** sign up → generate a week of posts → sign out → sign back in; confirm
  prior output persists.
- **Billing:** buy Pro → confirm the unlock → request a refund in Lemon Squeezy test mode →
  confirm access behaves as intended.
- **Entitlement (after the P0 fix):** as a free signed-in user, call `POST /api/generate`
  directly (devtools/curl) and confirm it's rejected.
- **Mobile:** run the landing page + generator on a phone viewport.
- **Email:** confirm the welcome + receipt actually arrive (not spam) from the real domain.
- **Webhook:** resend an `order_created` from the Lemon Squeezy dashboard; confirm Pro isn't
  double-granted and no duplicate receipt.
- **Error path:** force an OpenAI timeout (bad key / network) and confirm the user sees a
  graceful message, not a blank screen.

**Production configuration checklist:**

- Env vars set in Vercel **production** (not just preview): `OPENAI_API_KEY`, `DATABASE_URL`
  (the Neon **prod** branch, not dev), `LEMON_SQUEEZY_WEBHOOK_SECRET`, `BETTER_AUTH_SECRET`,
  `RESEND_API_KEY`.
- Lemon Squeezy webhook URL points at the **production** domain and the secret matches.
- Custom domain + DNS configured; canonical URL set; `robots`/`sitemap` allow indexing.
- Resend sending domain verified (SPF/DKIM).
- Sentry DSN set for the server runtime; confirm a test error appears.

**Eastbase-specific notes:**

- Both P0s are the same root cause — trusting the client for a paid AI action. Worth a quick
  grep for any other route that gates on a client-passed flag rather than a server-side check.
- Support/contact: the footer links to `hello@example.com` and the Terms name "PostParrot
  LLC". Use the house conventions before launch — `support@eastbase.studio` for support and
  **Eastbase Studio** as the operator name — and drop the invented LLC unless it's real.
- The landing claim "generate unlimited posts" contradicts the post-count cap you're about to
  add — soften to "a week of posts in one click" so the copy matches behavior.
- Once the usage cap lands, log generations per user/model — this is exactly the surface a
  BurnCap-style cost view would watch on launch day.

---

## Why this launch review is calibrated, not noisy

- **Two P0s, both real.** The entitlement bypass (paid product is free) and the unbounded AI
  cost (launch-day bill) are the two things that actually hurt PostParrot on day one. They
  lead; everything else is downgraded.
- **It judged the product type.** Paid + AI → §4 and §11 got the strict pass; that's where
  both blockers came from. A free internal tool would have been graded very differently.
- **It split "blocker" from "before launch" from "later."** The webhook and Resend domain are
  P1 (fix first, but not strictly blocking the same way), the OG image and Sentry are P2, the
  PostHog event and settings page are P3.
- **It didn't pretend prod was configured.** Env vars, DNS, the live webhook, and the Sentry
  DSN went to Manual verification / Production configuration — the repo can't prove those.
- **The verdict matched the evidence.** The blockers here are visible in the code, so it's
  `Not ready`. Had the only blockers been things the repo *can't* prove — unconfigured
  production env, an unverified live webhook, an unverified email domain — the right verdict
  would be `Needs manual verification` instead.
- **It didn't invent work or give legal advice.** No enterprise rewrite, no demand for a test
  suite; the Terms note is a consistency/placeholder flag, not legal counsel.
- **The Eastbase-specific notes earn their place** — the shared root cause, the support-email
  / operator-naming conventions, the claim-vs-behavior mismatch, and the cost-visibility hook
  are exactly what a generic go-live checklist would miss.
