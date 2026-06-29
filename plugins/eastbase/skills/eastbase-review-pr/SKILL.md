---
name: eastbase-review-pr
description: >-
  Eastbase Studio's review overlay for pull requests, diffs, branches, commits, and
  agent-generated code changes. Use this WHEN reviewing an existing change — the user asks
  to review a PR/diff/branch/commit, asks "does this look right / is this safe to merge",
  or an agent just finished a change and you're checking it before merge. It is NOT a
  linter and NOT a replacement for your normal code-review, security-review, framework, or
  testing skills — it is the Eastbase product, SaaS, UX, billing, AI-cost, access-control,
  data-safety, privacy, copy/marketing-claim, and maintainability LENS you layer ON TOP of
  them, so a change isn't merely clean code but actually safe and right to ship for an
  early-stage eastbase
  product (Next.js / App Router / Drizzle / Neon / BetterAuth / Lemon Squeezy / Resend /
  Cloudflare / Sentry / PostHog / OpenAI / Anthropic). Produces a verdict (Approve /
  Approve with follow-ups / Request changes / Needs more context) with must-fix vs
  follow-up findings and P0–P3 severity, focused on real risk over generic nitpicks.
  Do NOT trigger for ordinary implementation, refactoring/cleanup, design, scaffolding,
  debugging, or product/metrics/data-question tasks — even ones touching auth, billing, or
  maintainability; engage ONLY when a review/critique of an existing change is requested or
  clearly warranted. Defer deep visual taste to eastbase-premium-ui, and don't re-report
  what dedicated security/testing/framework reviewers already cover unless it changes the
  Eastbase risk picture. Not for non-eastbase projects.
---

# Eastbase Review PR

This is a **review overlay**, not a review system. Run your normal review machinery first
— Claude Code's own review habits, `code-review`, `security-review`, framework-specific
and testing skills, whatever you already use. This skill adds the layer those tools don't:
**Eastbase product, SaaS, and risk judgment.** Its job is not to re-grade abstract code
quality — it's to decide whether a change is *safe and right to ship for an early-stage
eastbase product*, and to say so in a way the author can act on in minutes.

Eastbase ships many small SaaS products fast. The bar is **practical quality, not
enterprise process**: move quickly, but never ship an obvious security, billing, data,
cost, or UX mistake. A good review protects that balance — it unblocks fast work and
catches the few things that would actually hurt a launch.

> **Review the change against the product intent, not just the code.** Read the PR
> description, the linked issue, the commit messages, or the task the agent was given.
> Decide first whether the change *solves the real user problem*. A clean diff that solves
> the wrong problem — or only the surface of the right one — is still a problem. If you
> can't tell what the change is *for*, the verdict is **Needs more context**, not a guess.

## How to use the overlay

- **Layer, don't duplicate.** Assume the generic reviewers ran. Only surface a generic
  issue (a null deref, a missing `await`) if it carries real Eastbase risk — a billing
  webhook that double-charges, an auth check that silently passes. Otherwise let the other
  tools own it. Repeating their checklist is noise.
- **Calibrate depth to risk.** A copy tweak or a contained UI fix gets a light pass. Code
  touching **auth, billing/entitlement, the database/migrations, AI/API spend, or
  security/privacy** gets a strict pass — these are where an early-stage product gets hurt,
  so slow down and look hard (see *Where to look harder*).
- **Be high-signal.** Every finding should trace to something in the diff. Prefer three
  real risks over twenty best-practice reminders. If you wouldn't hold or follow up on it,
  don't write it.
- **When uncertain, flag the uncertainty + the smallest check.** "I can't tell if the
  webhook is idempotent — confirm there's a unique constraint on `event_id` or a processed
  ledger" beats either silence or a confident wrong claim.
- **Separate must-fix from follow-up.** The author needs to know what blocks merge and
  what is a later improvement. Don't bury a P0 under polish.

## The questions a good Eastbase review answers

1. Does this actually **solve the intended product problem** — or just add code near it?
2. Does it introduce **user-facing risk** (regressions, broken flows, data shown wrong)?
3. Does it weaken **auth, billing, access control, data safety, or privacy**?
4. Does it create **hidden AI/API cost risk**?
5. Does it make the codebase **harder for future agents or humans to maintain**?
6. Does it degrade **UX, product clarity, performance, or perceived quality**?
7. Does it add **unnecessary complexity for the current product stage**?
8. Does it miss obvious **edge cases, empty / loading / error states, or mobile**?
9. Does it silently break **setup, env vars, deploy, webhooks, observability, or
   migrations**?
10. Is it **ready to merge**, or does it need targeted follow-up?

## What blocks merge, and what doesn't

Eastbase moves fast, so the blocking bar is deliberately narrow. **Block** (P0/P1) only on
real harm:

- Auth / session / access-control leaks (data or actions reachable by the wrong user).
- Billing or entitlement bypass (paid features free, or users charged wrong).
- Data loss or destructive / irreversible migrations.
- Serious functional regressions in a shipped flow.
- Dangerous AI/API cost loops (unbounded retries, runaway agents, user-triggered spend).
- Broken deploy / setup / migration / webhook paths that take the product down or block
  the next deploy.

**Do not block** on:

- Speculative architecture ("this won't scale to 1M users" on a pre-launch product).
- Style and naming nits that don't hurt readability, a11y, UX, or consistency.
- Missing tests for small, low-risk changes.
- Generic best-practice wishlists unconnected to a concrete risk in this diff.

When the current direction is workable, request the smallest targeted fix — **don't ask
for a large rewrite** unless the approach is meaningfully risky.

## Severity

Tag every must-fix item P0 or P1; use P2/P3 where it aids triage. Don't force a level onto
a minor note where it adds nothing.

- **P0** — must not merge. Security / data / billing / access / cost-disaster risk.
- **P1** — should not merge until fixed. Serious product or correctness issue.
- **P2** — should fix soon. Meaningful risk, not always blocking.
- **P3** — polish, readability, maintainability, or a future improvement.

## Where to look harder

A **risk map to consult selectively — not a checklist to run.** Open only the areas the
diff actually touches, and within each, raise only what carries real Eastbase risk: every
finding should fail the test *"would a generic reviewer already flag this?"* If it
wouldn't, it's noise — leave it to the tool that owns it.

### 1. Product intent & scope
- Does the implementation match the **stated goal**, or solve a different/adjacent thing?
- Did it solve the **real user problem**, or add surface code that looks done but isn't?
- Did the PR **grow past its scope** (unrelated refactors, drive-by changes) in a way that
  hides risk or makes the change hard to reason about?

### 2. Auth, permissions & account safety
- BetterAuth **session/auth checks present** on every protected server action and route
  handler — not assumed from the client.
- **Server/client boundary**: is an auth decision made only in a client component or
  client-fetched and therefore trivially bypassed?
- **Owner / team / membership checks** on every record access — does a query filter by the
  current user/org, or does it trust an ID from the request?
- **Purchased-kit / subscription access** actually enforced server-side.
- **Public vs protected** route mistakes; **admin-only** behavior reachable by normal
  users. (Defer generic vuln classes to your security skill; own the *access-model* logic.)

### 3. Billing & entitlement (Lemon Squeezy)
- **Webhook signature verified** before the body is trusted.
- **Idempotency**: replays / duplicate events don't double-grant or double-charge (unique
  event id, processed ledger, or upsert).
- **Entitlement enforced server-side** — never a client-only `isPro` gate.
- **Lifecycle states handled**: cancel, expire, downgrade, refund, past-due — not just the
  happy "subscription_created" path. Does access revoke when it should?
- Plan/subscription state is the **source of truth**, derived consistently wherever it's
  checked.

### 4. Database & migrations (Drizzle / Neon)
- **Schema correctness**: nullability, defaults, and types match how the app reads/writes.
- **Migration safety**: is it backward-compatible with the currently-deployed code during
  the deploy window? Any **destructive / irreversible** step (drop column, type narrowing,
  data backfill) flagged and justified.
- **Ownership / tenant fields** present and indexed on new tables; **unique constraints**
  where the app assumes uniqueness.
- **Cascade / delete behavior** intentional (no accidental orphan rows or accidental wipes).
- **Query performance at expected scale** — N+1s, unindexed filters on hot paths, full-table
  scans. Don't over-optimize for scale the product doesn't have yet.

### 5. AI / API cost & safety
This is an Eastbase-specific blind spot — give it real attention on any AI feature.
- **Bounded loops**: retries, tool/agent loops, and background jobs have a hard cap — no
  path that can spin forever or fan out without limit.
- **Sane `max_tokens` / output caps** — an oversized limit is a per-call cost blowout, not
  a tidiness nit; and the expensive model isn't used where a cheaper one is plainly enough.
- **Rate limits** on user-triggered generation, plus a **budget / spend guard that fails
  closed**, so **user-controlled prompts** can't drive runaway or recursive calls.
- **Usage is logged** (tokens / cost / model) so spend is observable — and where relevant,
  wire in or leave a hook for a cost-tracking surface (BurnCap-style) rather than flying
  blind.
- **Background / cron jobs that call AI** are the classic cost trap — check trigger
  frequency and the per-run ceiling.

### 6. UX & product polish
- **Empty / loading / error states** exist and aren't dead "No data" / spinners.
- **Mobile** behavior and **responsive** reflow; forms are **accessible** with clear,
  specific **validation messages**.
- Dashboards / charts / tables keep the product's **personality / identity** and read as a
  real product, not a stock template; no **generic SaaS regression** of an already-polished
  surface.
- For anything primarily visual, **defer deep UI taste to `eastbase-premium-ui`** — here,
  just flag that the states/polish are missing or regressed and point to that skill.

### 7. Next.js / React — where a boundary becomes a product risk
Leave ordinary App Router correctness (hydration, suspense, unnecessary client components,
render churn) to your framework skill. Here, flag only the boundary mistakes that turn into
*product* risk:
- **Secrets / server-only env leaking to the client** — read in a `"use client"` file or
  passed as props into one. The highest-stakes boundary mistake; this is the §8 secret check
  showing up at the RSC boundary.
- **Per-user data over-cached** — a personalized response cached globally (wrong scope,
  missing `revalidate`/tag) can serve one user's data to another. A caching bug here is an
  access-control bug.
- **Server actions treated as trusted** — input unvalidated, or auth/ownership assumed from
  the caller. This is the §2 access model showing up in an action.
- **Stale state after a mutation** — a write with no revalidation leaves the user on old
  data, which reads as a broken product.

### 8. Security & privacy
(Lean on your dedicated security skill for the heavy classes — own the Eastbase-flavored
risks.)
- **Secret handling & env exposure**: nothing sensitive in client bundles, logs, or error
  messages.
- **File upload / storage (R2)**: type/size limits, no public-by-default buckets, scoped
  access.
- **Unsafe redirects**, **SSRF-like** fetches of user-supplied URLs, and **unsafe HTML /
  markdown** rendering (`dangerouslySetInnerHTML`, un-sanitized model output).
- **PII**: don't log it, don't collect more than needed, don't retain it without reason.

### 9. Observability & operations
- **Errors reach Sentry** with enough context; failures degrade **gracefully** instead of
  blank-screening the user.
- **Logging is useful without leaking** secrets/PII; meaningful **PostHog events** added
  where a new flow needs measuring.
- **Deploy / env assumptions** are documented (new env var → `.env.example` + setup note);
  **cron / job reliability** and **webhook debuggability** considered.

### 10. Agent maintainability
- Clear structure, **readable naming**, low hidden coupling; comments only where they earn
  their place.
- Docs updated when behavior/setup changed: `README`, `AGENTS.md`, `DESIGN.md`,
  `/architecture`, `.env.example`, integration/setup docs.
- The change is **easy for a future AI agent to inspect and safely modify** — not a clever
  one-off that the next agent will misread and break.

## Adapt by PR type

Beyond weighting the areas above — **mostly UI** leans on §6 and pulls in
`eastbase-premium-ui` for the design call (this skill owns risk + states, that one owns
taste); anything **touching auth / billing / AI cost / database / security** gets the
strict pass and a real willingness to **Request changes** — some PR types need a different
lens entirely:

- **Copy / content only** → skip the code lens. Focus on **clarity, trust, outdated or
  overstated claims, product positioning, consistent support/legal email & operator
  naming, and broken links.**
- **Terms / Privacy / legal pages** → check the visible **operator/support naming matches
  Eastbase conventions** and is internally consistent. **Do not give legal advice** — flag
  inconsistencies and defer substance to the operator.
- **Public marketing pages** → check **claim accuracy & credibility, CTA clarity, SEO/OG
  basics (title, description, OG image), and whether the product promise is too broad** to
  back up.
- **Templates / kits** → check **purchased-access enforcement, setup clarity, AI-agent
  support files (AGENTS.md / docs), and whether the kit feels complete** — a real,
  working product — rather than a thin landing page.

## Output format

Produce the review in this shape. Keep each section tight; omit a section if it's empty
(except Verdict and Summary).

**Verdict:** `Approve` · `Approve with follow-ups` · `Request changes` · `Needs more
context`

**Summary:** 2–4 sentences — what changed and the overall risk level.

**Must fix before merge:** only serious issues, each tagged **P0/P1**. For each: the
file/function/area, *why it matters*, and the **smallest practical fix**.

**Should fix soon:** important but not merge-blocking (often P2).

**Nice follow-ups:** optional improvements (P3).

**Verification:** tests/checks you ran, or the **exact checks to run** — including manual
QA flows (e.g. "subscribe → cancel → confirm access revokes") where relevant.

**Eastbase-specific notes:** product / UX / business / cost / security observations a
generic reviewer would miss — the reason this overlay exists.

A worked example in the house format is in `references/example-review.md`.

## Before you post the review (self-check)

- **No invented issues.** Every finding is supported by the diff. If it's a hunch, label
  it as one and give the smallest verification step.
- **No generic checklist** in the output — only what's relevant to *this* change.
- **Deferred, didn't duplicate** — left generic correctness to security/testing/framework
  skills and deep visual taste to `eastbase-premium-ui`, surfacing them only where they
  change the Eastbase risk picture.
- **Didn't demand tests** for every tiny change, or a rewrite for a workable approach.
- **Blocked only on real harm** (auth/data/billing/access/cost/deploy) — and said plainly
  what is must-fix vs. follow-up.

## References

- `references/example-review.md` — a full worked review in the house format on a realistic
  eastbase PR (team invites + seat billing), showing the signal/noise calibration: what
  gets a P0, what's a follow-up, what is deliberately *not* flagged, and how the
  Eastbase-specific notes earn their place.
