# Reference: State UIs that carry the signature

Empty, error, and loading are not edge cases — they're the **first** thing a new user
sees (empty), the moment a stressed user remembers (error), and the impression of speed
(loading). Generic products treat them as defaults; eastbase products design them. These
are BurnCap's patterns — adapt the metaphor/hue, keep the structure.

## Empty states — three tiers

Match the tier to the surface. Don't use a giant first-run hero inside a small panel,
and don't use dead gray text where a first-run moment belongs.

### Tier 1 — first-run / whole-page empty (a designed moment)

Full-bleed dashed panel, the signature glow + grain, the brand mark in an accent chip, a
**display-font** headline, one human sentence, a primary action, and an escape hatch
("load demo data") where it fits. This is a screenshot-able first impression — invest in
it.

```tsx
<div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-dashed">
  <div aria-hidden className="bg-ember/8 absolute top-1/2 left-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]" />
  <div aria-hidden className="grain" />
  <div className="relative flex max-w-md flex-col items-center gap-5 px-6 py-20 text-center">
    <span className="border-ember/30 bg-ember/10 text-ember flex size-12 items-center justify-center rounded-2xl border">
      <LogoMark className="size-6" />
    </span>
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-3xl tracking-[-0.01em]">No usage data yet</h1>
      <p className="text-muted-foreground text-sm text-pretty">
        Import a CSV, connect OpenAI, or send a test event to see where your AI spend goes.
      </p>
    </div>
    <div className="flex flex-wrap justify-center gap-2">
      <Button className="rounded-lg" render={<Link href="/integrations" />}>Set up an integration</Button>
      <LoadDemoButton />
    </div>
  </div>
</div>
```

Why it works: the dashed border says "slot waiting to be filled", the glow+grain carry
atmosphere with no gradient, the display headline adds ceremony, and the copy is a
*next step* — not an apology. The icon should fit the surface (a chart icon for an
analytics page, the brand mark for the main dashboard).

### Tier 2 — inline panel/table empty (a forward-looking line)

Inside an existing panel or table, one sentence that tells the user what *will* appear
here. Never a bare "No data".

```tsx
<p className="text-muted-foreground px-4 py-6 text-sm">
  No alerts yet. Budgets and spike rules will post here.
</p>
```

```tsx
// table empty hint, passed into the panel chrome:
emptyHint="No usage this month."
```

The pattern: **state + promise.** "No alerts yet" (state) + "Budgets and spike rules
will post here" (promise). It turns an empty box into an explanation.

### Tier 3 — micro-empty (a label)

A status chip / footer pulse, e.g. `"No usage yet"`, `"No data yet · Connect a source"`.
Tiny, mono-friendly, never a whole illustration.

## Error / 404 — stay on-brand

A branded full-screen with the full texture kit, the brand mark, a big display-font code,
ember hairline rules flanking a micro-label, a calm explanation, and a route home. The
500 page is not where the craft budget runs out. BurnCap factors this into one reusable
`ErrorScreen` used by `not-found.tsx`, `error.tsx`, and `global-error.tsx`.

```tsx
<div className="relative flex min-h-svh flex-col items-center justify-center gap-8 overflow-hidden p-6">
  <div aria-hidden className="hairline-grid absolute inset-0" />
  <div aria-hidden className="bg-ember/8 absolute top-1/2 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]" />
  <div aria-hidden className="grain" />

  <Link href="/" aria-label="Home" className="relative"><LogoBadge className="size-9" /></Link>

  <div className="relative flex flex-col items-center gap-5 text-center">
    <span className="flex items-center gap-3">
      <span className="bg-ember h-px w-8" />
      <MicroLabel className="text-foreground/70">{label}</MicroLabel>
      <span className="bg-ember h-px w-8" />
    </span>
    <span aria-hidden className="font-display text-[clamp(5.5rem,18vw,10rem)] leading-none tracking-[-0.02em] select-none">
      {code}        {/* e.g. 404 / 500 */}
    </span>
    <h1 className="font-display text-2xl tracking-[-0.01em] sm:text-3xl">{title}</h1>
    <p className="text-muted-foreground max-w-md text-sm text-pretty sm:text-base">{description}</p>
    {children /* CTA(s) back to safety */}
  </div>
</div>
```

Framework note (Next.js): error boundaries are real surfaces — wire `not-found.tsx`,
`error.tsx`, `global-error.tsx`. (This project's Next passes `unstable_retry`, not
`reset` — read the local Next docs; APIs differ from training data.)

## Loading — mirror the real layout

Skeletons shaped like the *actual* page so content pops in without layout shift, plus a
small **live branded spinner + label** in the header so the page reads as an instrument
warming up, not frozen. Each skeleton mirrors its real component (cluster → cluster,
panel → panel, chart → varied-height bars).

```tsx
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-7 w-44" /><Skeleton className="h-4 w-72 max-w-[70vw]" />
      </div>
      <div className="flex items-center gap-2.5" role="status" aria-label="Loading">
        <EmberSpinner className="size-4" /><MicroLabel>Loading</MicroLabel>
      </div>
    </div>
  );
}

// Cluster skeleton reuses the SAME instrument-cluster shell as the real cluster:
<div className="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border lg:grid-cols-5">
  {cells.map(... <div className="bg-card flex flex-col gap-2.5 p-4">
    <Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-28" /><Skeleton className="h-3 w-32" />
  </div>)}
</div>

// Chart skeleton = real-feeling bars, varied heights so it doesn't look like a placeholder grid:
const BAR_HEIGHTS = [32,18,44,26,58,22,38,64,30,48,24,72,40,55,28,80,36,50,20,60];
<div className="flex h-64 items-end gap-2 p-4">
  {BAR_HEIGHTS.map((h,i) => <Skeleton key={i} className="w-full rounded-t-sm rounded-b-none" style={{ height: `${h}%` }} />)}
</div>
```

The branded spinner is the signature viz in motion — BurnCap's `EmberSpinner` is the
gauge arc spinning; `EmberLoader` (spinner + mono label, centered) is the route loader
for light pages (onboarding/invite). The loading state should *quote* the product's hero
viz, not drop in a generic ring.

## The throughline

Every state answers in the product's own voice:
- **Empty:** "here's what will live here, and the one action to fill it" — with ceremony.
- **Error:** "something broke, you're still in our world, here's the way back" — calm and branded.
- **Loading:** "the instrument is warming up" — a faithful preview, not a frozen page.
