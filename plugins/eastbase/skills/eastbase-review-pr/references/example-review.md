# Reference: A worked Eastbase PR review

> **⚠ This is ONE review of ONE PR — not a template to fill in.** It exists to calibrate
> *judgment*: what earns a P0, what's a follow-up, what is deliberately **not** flagged,
> and what belongs in "Eastbase-specific notes." Copy the **shape and the signal/noise
> ratio**, not the specific findings. A real review only contains findings the diff
> actually supports.

## The PR under review (context)

> **Title:** Add team invites + seat-based billing to BurnCap
> **Goal (from the issue):** Workspace owners can invite teammates by email; each accepted
> seat increments the Lemon Squeezy subscription quantity. Invited users land in the
> workspace with `member` role.
>
> **Diff touches:**
> - `src/app/(app)/team/page.tsx` — team list + invite form (client component)
> - `src/app/api/invites/route.ts` — `POST` create invite, `GET` list invites
> - `src/app/api/webhooks/lemon/route.ts` — handle `subscription_updated` quantity changes
> - `src/lib/team/invites.ts` — token generation, accept flow
> - `src/db/schema.ts` — new `invites` table; `memberships.role` column
> - one Drizzle migration

This is an auth + billing + database PR, so it gets a **strict pass**. The review below is
what that looks like.

---

## Review

**Verdict:** `Request changes`

**Summary:** Solid, well-scoped implementation of team invites that matches the stated
goal, and the seat→quantity sync is the right model. But two changes hold merge: the invite
listing endpoint leaks invites across workspaces (access-control bug), and the Lemon
Squeezy webhook isn't idempotent, so a replayed `subscription_updated` can desync seat
count and billing. Both are small, targeted fixes. UX and docs need a light follow-up.

**Must fix before merge:**

- **P0 — Cross-workspace data leak in `GET /api/invites`**
  (`src/app/api/invites/route.ts`). The handler does
  `db.select().from(invites).where(eq(invites.email, session.user.email))` but never
  scopes to the caller's workspace, and the `POST` path reads `workspaceId` straight from
  the request body without checking the caller owns it. A member of workspace A can list —
  and create — invites for workspace B. *Why it matters:* this exposes other tenants' data
  and lets anyone add seats to a workspace they don't pay for. *Smallest fix:* derive
  `workspaceId` from the session's active membership (never the body), and add
  `and(eq(invites.workspaceId, membership.workspaceId))` to the query plus an owner-role
  check on `POST`.

- **P0 — Lemon Squeezy webhook is not idempotent**
  (`src/app/api/webhooks/lemon/route.ts`). The handler applies the new `quantity` on every
  delivery. Lemon Squeezy retries and can deliver duplicates, so a replay re-applies the
  change and the local seat count drifts from what's billed. The signature *is* verified —
  good. *Why it matters:* seat/billing desync is a money + trust bug and is hard to debug
  after the fact. *Smallest fix:* record processed `event_id`s (unique constraint or a
  `processed_webhooks` ledger) and no-op on a seen id. (The apply is already a "set quantity
  to N", not a delta — so dedup, not the apply logic, is the gap.)

**Should fix soon:**

- **P2 — Invite acceptance doesn't handle the already-member / expired cases**
  (`src/lib/team/invites.ts`). Accepting a second time, or after expiry, throws an
  unhandled error to the user. *Fix:* check membership + `expiresAt` and return a friendly
  "this invite was already used / has expired" path.
- **P2 — No empty / pending / error states on the team page**
  (`src/app/(app)/team/page.tsx`). New workspaces see a bare table; a failed invite shows
  nothing. This is primarily UI — **pull in `eastbase-premium-ui`** for the empty + pending
  states rather than hand-rolling them here.

**Nice follow-ups:**

- **P3 —** `invites.token` is generated with `Math.random()`-based logic. It's a bearer
  token; prefer `crypto.randomUUID()` or `crypto.getRandomValues`. Low exploitability here
  but trivial to harden.
- **P3 —** No PostHog event on invite sent / accepted — worth adding to measure activation.

**Verification:**

- I did not run the app. Recommended before merge:
  - **Access check:** as a member of workspace A, call `GET /api/invites` and confirm you
    see only A's invites; attempt `POST` with another workspace's id and confirm it's
    rejected.
  - **Idempotency:** re-deliver the same `subscription_updated` event (Lemon Squeezy
    dashboard "resend") and confirm seat count + billed quantity don't drift.
  - **Lifecycle QA:** invite → accept → accept again → let one expire; confirm each path is
    handled.
- The migration is additive (new table + nullable `role` defaulting to `member`) — safe and
  backward-compatible with the currently-deployed code. No action needed.

**Eastbase-specific notes:**

- The seat→Lemon-Squeezy-quantity model is the right call and keeps billing as the source
  of truth — good instinct. The two P0s are both "trust the request instead of the session"
  variants; worth a quick grep for other handlers that read `workspaceId` from the body.
- No new env vars or setup steps, so `.env.example` / setup docs are fine as-is. If invite
  emails go through Resend, confirm the `from` domain is the one already verified for
  BurnCap before this ships, or invites will silently bounce.
- Seat billing is now a cost-adjacent surface: when usage tracking lands, this is a natural
  place to surface seat count in any BurnCap-style cost view.

---

## Why this review is calibrated, not noisy

- **Two P0s, not twenty findings.** The access leak and the non-idempotent webhook are real
  harm (data + money). They lead; everything else is explicitly downgraded.
- **It judged the goal first.** The summary confirms the change solves the stated problem
  before listing risks — a clean diff solving the wrong problem would have been called out
  here.
- **It deferred, didn't duplicate.** UI states point to `eastbase-premium-ui`; it didn't
  re-grade visual taste. The token-randomness note is P3, not a security lecture.
- **It didn't invent work.** No demand for a test suite on a small PR, no speculative
  "won't scale" architecture rewrite, no style nits. Each finding maps to a line in the
  diff.
- **The Eastbase-specific notes earn their place** — the source-of-truth observation, the
  Resend `from`-domain trap, and the cost-surface hook are exactly what a generic reviewer
  would miss.
