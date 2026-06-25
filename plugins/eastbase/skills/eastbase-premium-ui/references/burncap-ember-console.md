# Reference: BurnCap "Ember Console"

The fully-worked reference implementation of the eastbase premium-UI method. BurnCap is
an AI-cost monitor; its signature reads spend as something *burning down* on an
instrument console. Use this as the proof of how the §1–§5 moves come together in real
code. **Adapt the moves; re-derive the specifics** (hue, metaphor, type) for the
product you're building — don't paste ember into an unrelated app.

## Contents
1. The signature brief
2. Design tokens (oklch, dark-only)
3. Atmosphere utilities (no gradients)
4. Shared chrome primitives
5. Instrument cluster (KPI grid)
6. Signature visualization: radial gauges
7. Ranked, typeset table + inline share bar
8. Segmented composition bar
9. Retheme'd recharts chart
10. How to transfer this to a new product

---

## 1. The signature brief

- **Metaphor:** an operations/instrument **console** monitoring cost "burn".
- **Signature hue:** `ember` (warm orange). Means brand + confirmed-burn data.
- **Semantic palette:** four status hues — `healthy` / `caution` / `critical` /
  `forecast`. Nothing else.
- **Type:** Fraunces (display/ceremony), Hanken Grotesk (UI), IBM Plex Mono (all
  numerals/data).
- **Atmosphere:** dark-only warm-ash neutrals; depth from film grain, a hairline
  blueprint grid, blurred ember glows, hairline borders, soft panel shadows. No
  gradient fills.
- **Vocabulary:** `Panel`/`SectionPanel`/`PanelHeader`/`PageHeader`, `MicroLabel`,
  `ShareBar`, `SeverityDot`, the instrument cluster, `BurnGauge`/`ScoreRing`.

Lives in `src/app/globals.css` (tokens + utilities) and
`src/components/dashboard/micro.tsx` (primitives).

## 2. Design tokens (oklch, dark-only)

One signature hue + four status hues, defined as oklch tokens — never ad-hoc hex in
components. Numerals are mono everywhere. (Excerpt; full set in `globals.css`.)

```css
@theme inline {
  --font-sans: var(--font-hanken), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;
  --font-display: var(--font-fraunces), Georgia, serif;
  --color-ember: var(--ember);          /* signature hue */
  --color-healthy: var(--healthy);
  --color-caution: var(--caution);
  --color-critical: var(--critical);
  --color-forecast: var(--forecast);
}

:root, .dark {                           /* dark-only: both carry the same values */
  --background: oklch(0.1500 0.0055 65); /* warm ash, not neutral gray */
  --foreground: oklch(0.9560 0.0090 85);
  --card:       oklch(0.1840 0.0070 70);
  --border:     oklch(0.9200 0.0300 80 / 11%);  /* hairline, low-alpha */
  --ember:      oklch(0.7150 0.1900 42);
  --healthy:    oklch(0.7600 0.1500 158);
  --caution:    oklch(0.8200 0.1450 88);
  --critical:   oklch(0.6500 0.2100 26);
  --forecast:   oklch(0.7300 0.1150 235);
}
```

Transferable rule: warm or cool, the neutral should be *tinted toward the signature*
(BurnCap's "ash" is warm), borders are low-alpha hairlines, and the status set is tiny
and fixed.

## 3. Atmosphere utilities (no gradients)

Depth without a single gradient fill. Drop these into any `relative` container.

```css
/* Film grain — <div aria-hidden class="grain" /> */
@utility grain { /* fractalNoise SVG data-uri, opacity ~0.05, position:absolute inset-0 */ }

/* Hairline blueprint grid for hero/section backdrops */
@utility hairline-grid { /* 56px SVG grid, stroke-opacity .05 */ }

/* Signature glow for CTAs / live indicators */
@utility glow-ember { box-shadow: 0 0 22px -6px color-mix(in oklch, var(--ember) 60%, transparent), ...; }

/* Soft elevated-panel shadow */
@utility shadow-panel { box-shadow: 0 1px 0 0 oklch(1 0 0 / 4%) inset, 0 8px 24px -12px oklch(0 0 0 / 55%), ...; }
```

For a *spot* glow, a blurred solid circle beats a gradient:

```tsx
<div aria-hidden
  className="bg-ember/8 absolute top-1/2 left-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]" />
```

## 4. Shared chrome primitives

The whole app inherits one chrome from `micro.tsx`. The **`MicroLabel`** — uppercase
mono 11px with letter-spacing — is the single most recognizable eastbase marker; it
eyebrows every panel and section.

```tsx
/** Signature section marker: uppercase mono microlabel. */
export function MicroLabel({ children, className }) {
  return (
    <span className={cn(
      "text-muted-foreground font-mono text-[11px] font-medium tracking-[0.08em] uppercase",
      className)}>
      {children}
    </span>
  );
}

/** Panel chrome — every card/section is one of these, never a raw shadcn Card. */
export function Panel({ children, className }) {
  return <div className={cn("bg-card/40 overflow-hidden rounded-xl border", className)}>{children}</div>;
}
export function PanelHeader({ children, className }) {
  return <div className={cn("flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3", className)}>{children}</div>;
}
```

`SectionPanel` is the config-page counterpart (titled header, mono eyebrow, optional
icon/action/anchor) so Settings/Integrations share the same chrome as analytics pages
— **the rule is: one chrome everywhere, no stray stock cards.**

## 5. Instrument cluster (KPI grid)

KPI tiles are a single hairline-divided grid, not a row of floating cards: one bordered
container with `gap-px` over a `bg-border` background paints the hairlines between
tiles. The primary metric gets a signature accent edge.

```tsx
<div className="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border lg:grid-cols-5">
  <div className="bg-card relative flex flex-col gap-1 p-4">
    <span aria-hidden className="bg-ember absolute top-0 left-0 h-full w-0.5" /> {/* accent edge */}
    <MicroLabel>Month-to-date spend</MicroLabel>
    <span className="font-mono text-2xl font-semibold tabular-nums">{value}</span>
    <span className="text-muted-foreground text-xs">{hint}</span>
  </div>
  {/* …more tiles… */}
</div>
```

## 6. Signature visualization: radial gauges

The screenshot-able hero. Hand-built SVG (not a chart lib), `pathLength={100}` so the
dash-array *is* the percentage, color driven by a status class through `currentColor`,
and animated by transitioning `stroke-dasharray` on the DOM node. Center holds a mono
numeral + a tiny uppercase unit. Always `role="img"` + `aria-label`.

```tsx
const ARC = 100 * (240 / 360);          // 240° dial
// fill arc: strokeDasharray sweeps 0→ratio*ARC via a 1s transition,
// className="transition-[stroke-dasharray] duration-1000 ease-out motion-reduce:transition-none"
<div className={cn("relative shrink-0", STATE_CLASS[state])}  /* text-healthy|caution|critical */
     role="img" aria-label={`${pct}% of budget used`}>
  <svg viewBox="0 0 100 100" className="size-full -rotate-[210deg]">
    <circle r="42" stroke="var(--secondary)" pathLength={100} strokeDasharray={`${ARC} 100`} .../>
    <circle r="42" stroke="currentColor" strokeLinecap="round" pathLength={100} strokeDasharray="0 100" .../>
  </svg>
  <span className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="font-mono text-sm font-semibold tabular-nums">{pct}%</span>
    <span className="text-muted-foreground font-mono text-[9px] tracking-[0.08em] uppercase">used</span>
  </span>
</div>
```

`ScoreRing` (full-circle readiness 0–100) is the same recipe at `-rotate-90` with
`strokeDasharray={`${score} 100`}`. The branded spinner is *the same gauge arc spinning*
(`EmberSpinner`) — the loading state literally echoes the hero viz.

## 7. Ranked, typeset table + inline share bar

Dense but composed: mono `01/02` ranks (leader in the signature hue), right-aligned mono
figures, and a `ShareBar` so each row shows magnitude visually.

```tsx
<span className={cn("mr-2 font-mono text-[11px] tabular-nums",
  i === 0 ? "text-ember" : "text-muted-foreground/60")}>
  {String(i + 1).padStart(2, "0")}
</span>
<span className="font-medium">{row.key || "(untagged)"}</span>
{/* cost cell: */}
<TableCell className="py-2 text-right font-mono text-xs tabular-nums">{fmtUsd(row.costUsd)}</TableCell>
```

```tsx
/** Inline magnitude bar for dense tables. */
export function ShareBar({ share, tone = "neutral" }) {
  const fill = tone === "ember" ? "bg-ember" : tone === "critical" ? "bg-critical" : "bg-foreground/70";
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
        <div className={cn("h-full rounded-full", fill)} style={{ width: `${Math.max(2, share*100)}%` }} />
      </div>
      <span className="text-muted-foreground w-9 text-right font-mono text-xs tabular-nums">{Math.round(share*100)}%</span>
    </div>
  );
}
```

## 8. Segmented composition bar

"What's my mix" as one hairline-split bar (not a pie) + a mono legend. Top-N segments in
the chart palette, the rest collapse into a muted "Other".

```tsx
<div className="bg-border flex h-3 w-full gap-px overflow-hidden rounded-full">
  {segments.map((s) => (
    <div key={s.key} className={cn("h-full", s.color)} style={{ width: `${Math.max(2, s.share*100)}%` }} title={`${s.label} · ${Math.round(s.share*100)}%`} />
  ))}
</div>
{/* legend: square swatch + label + mono "$x · y%" per segment */}
```

## 9. Retheme'd recharts chart

When a chart library is warranted, erase its defaults: token colors, axis lines off,
hairline dashed grid only, mono tabular tooltip with a color swatch, dashed signature
reference line for the trailing average / forecast.

```tsx
<BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
  <CartesianGrid vertical={false} strokeDasharray="3 3" />
  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
  <YAxis tickLine={false} axisLine={false} width={56} fontSize={11} tickFormatter={fmtUsd} />
  {/* tooltip row: <div className="size-2.5 rounded-[2px]" style={{background:item.color}}/> label
      <span className="ml-auto font-mono tabular-nums">{fmtUsd(value)}</span> */}
  <Bar dataKey="billed" stackId="spend" fill="var(--color-billed)" />        {/* confirmed = ember */}
  <Bar dataKey="estimated" stackId="spend" fill="var(--color-estimated)" radius={[2,2,0,0]} /> {/* estimate = ash */}
  <ReferenceLine y={trailingAvg} stroke="var(--forecast)" strokeDasharray="5 4" strokeWidth={1.5} />
</BarChart>
```

Note the *semantics in color*: confirmed/billed data uses the signature hue; estimates
stay neutral ash; forecast is the dashed forecast hue. Color always means something.

## 10. How to transfer this to a new product

Keep the **structure**, replace the **specifics**:

| BurnCap specific | Re-derive for the new product |
| --- | --- |
| Console/burn metaphor | The product's own domain instrument |
| `ember` hue | The product's single signature hue |
| healthy/caution/critical/forecast | That product's real status vocabulary |
| Radial burn gauge / score ring | A hero viz that encodes *its* core metric |
| Fraunces / Hanken / Plex Mono | Its own display + UI + mono trio |
| Warm-ash dark palette | Its tuned palette (warm/cool, dark or light-primary) |

What stays identical every time: the instrument cluster pattern, hairline panel chrome,
the mono `MicroLabel` eyebrow, mono tabular numerals, atmosphere-not-gradients,
designed states, and one shared chrome across the whole app.
