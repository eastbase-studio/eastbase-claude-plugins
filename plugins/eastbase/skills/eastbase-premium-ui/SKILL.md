---
name: eastbase-premium-ui
description: >-
  Eastbase Studio's REQUIRED house standard for premium, distinctive product UI
  (the skill ships fully-worked reference implementations). Read this BEFORE writing or
  editing ANY user-facing UI in an eastbase studio project — including small,
  routine-seeming tasks. Critical: eastbase UI uses specific, non-obvious house patterns
  you do NOT already know (instrument-cluster KPI grids, hand-built signature
  visualizations, deliberately typeset numerals, atmosphere without gradients,
  signature-branded empty / loading / error states); the stock-shadcn or generic-SaaS
  version you would write from memory is the wrong answer here, so consult the patterns
  first even for a single component or state. Covers: any page, dashboard, analytics or
  admin view, settings or onboarding screen; any chart, KPI row, stat cluster, or data
  table; ESPECIALLY empty states, loading skeletons, and error / 404 / 500 screens; and
  any request to review, polish, redesign, or de-genericize a component — even when the
  user never says "premium" or "design" or names this skill. Do NOT trigger for non-UI
  work (backend, DB migrations, business logic, data / metrics questions), purely
  functional bugfixes (e.g. a layout overflow), dependency or tooling setup (installing a
  chart library, adding a stock shadcn component), or UI for non-eastbase projects.
---

# Eastbase Premium UI

Eastbase ships software that should feel **made**, not assembled. The benchmark is
not "clean and usable" — most SaaS clears that bar and is instantly forgettable. The
benchmark is that someone screenshots a single panel and you can tell which product it
belongs to. This skill is how you get there, and how you keep every eastbase product
recognizably from the same studio without all looking the same.

This is a **method**, not a paint job. It ships with two deliberately *contrasting*
worked references — a dark, data-driven product (`references/burncap-ember-console.md`)
and a light, editorial one (`references/contrasting-signature-example.md`) — precisely so
you can see the same method produce two signatures with nothing in common. They exist to
teach the **moves**, not to be copied.

> **Derive first; reference for structure only.** Before you open either reference,
> derive *this* product's signature from *its own* domain (§1). Then use the references
> for the structural *how* — one hairline-divided cluster, designed states, a bespoke
> hero shape — never the *what*: a specific hue, metaphor, typeface, or dark/light
> choice. The fastest way to ship generic work in disguise is to copy the vivid example
> in front of you. If your result shares a palette, metaphor, typeface, or light/dark
> stance with a reference, you anchored instead of deriving — go back to the domain.

## The standard

Run every screen against one question: **could a competitor ship this exact UI by
swapping the logo?** If yes, it has failed — it has no product personality. Two ways
UI fails this test, and you must avoid both:

- **Generic.** Stock shadcn cards, default recharts, the Tailwind blue, evenly-rounded
  boxes floating on a flat page. Competent and anonymous.
- **Decorative but hollow.** Personality bolted on as gradients, glassmorphism, emoji,
  and animation that doesn't mean anything. Loud and still anonymous.

Personality at eastbase is **structural and earned**: it comes from the product's own
domain made legible in the layout, the typography of its data, and a restrained
signature — not from effects sprinkled on top.

## 1. Start from a signature, not a component library

Before placing a single component, derive the product's signature. This is the work
that makes everything downstream non-generic. Spend real thought here.

1. **Find the domain metaphor.** What does this product actually *do*, and what real
   instrument or object does that job? BurnCap monitors spend "burning down" → an
   **instrument console** with **gauges** and an **ember**. A scheduling product might
   be a *control board*; a reading tool a *printed page / margin*; a security product a
   *vault/perimeter*. The metaphor names the design language and decides what your
   components want to look like. Derive it from *this* product — not from a reference.
2. **Pick ONE signature hue + a small semantic set.** One brand/accent color the
   product owns, plus a *tiny* fixed vocabulary of meaning-colors (e.g. status:
   healthy / caution / critical / forecast). That's the whole palette. Resist adding
   hues — restraint is what reads as premium. Define them as tokens (oklch), never
   ad-hoc hex in components.
3. **Typeset the product, and decide how numerals read.** Choose a small type system
   with distinct roles: a **display** face for ceremony (hero, auth, big empty-state
   headlines) and a clean **UI** face for everything functional. Then make a *deliberate*
   choice for numerals/data — they are a signature surface. For data-driven / instrument
   products, **mono tabular** figures read as a precise readout (BurnCap's choice). For
   editorial or content products, old-style / proportional figures read as considered
   craft. The invariant is that numerals get an *intentional* treatment — not that they
   are always mono.
4. **Decide the atmosphere.** How does a flat page (dark *or* light) gain depth *without*
   gradient fills? Pick the product's texture kit: film grain, a hairline blueprint grid,
   a single blurred signature glow, hairline borders, soft shadows — or, for a light
   product, paper fiber, ledger rules, and letterpress deboss.
5. **Name a small component vocabulary.** The 5–8 bespoke primitives every screen
   reuses (panel chrome, a micro-label, a KPI tile, the signature data viz). Build
   these once in a shared `micro`/primitives module so the whole app inherits one
   chrome. See both reference examples for two very different vocabularies.

Capture this as a short "signature brief" at the top of the project's design notes
(or `globals.css`) so future work stays coherent. If a product already has a
signature, read it first and extend it — don't invent a second dialect.

## 2. House invariants

These hold across **every** eastbase product, whatever its signature. They are the
studio fingerprint — and note that none of them prescribes a *specific* hue, metaphor,
typeface, or light/dark stance; those are per-product.

- **Personality is structural.** It lives in layout, typography of data, and bespoke
  components — not in decoration laid over generic structure.
- **One signature hue + a small semantic palette.** Color carries meaning; it is never
  spent on decoration. If a color isn't the brand accent or a defined status, question
  it.
- **Atmosphere, not gradients.** Depth comes from grain, hairline grids/rules, a blurred
  signature glow or a letterpress deboss, hairline borders, and soft shadows — **no
  linear-gradient backgrounds** unless the user explicitly asks. Gradients are the house
  tell of generic AI UI; avoid them.
- **Numerals are typeset on purpose.** Figures get a deliberate treatment that fits the
  product — mono `tabular-nums` (aligned, instrument-like) for data products, considered
  old-style figures for editorial ones. Never leave numbers in the default body face by
  accident.
- **Bespoke over stock.** Prefer purpose-built, domain-fit components that embody the
  metaphor over dropped-in defaults — a signature visualization over a default chart, a
  designed panel over a stock card (see §3).
- **States are designed, never default** (see §4). Empty/error/loading are first-class
  surfaces with the product's signature, not afterthoughts.
- **Premium = restraint + precision.** Hairline borders over heavy ones, aligned grids,
  a consistent spacing rhythm, generous breathing room, type that's sized for
  hierarchy. Sweat the 1px details; remove anything that isn't earning its place.
- **The chosen theme is first-class.** Whether the product is dark- or light-primary,
  that theme (and any second one) is deliberately tuned and meets contrast (see §6) —
  never a `dark:`/`light:` afterthought.
- **Motion is purposeful and accessible.** Animation reveals or explains (a gauge
  sweeping to its value, content settling in) — never ambient noise. Always honor
  `prefers-reduced-motion`.

## 3. Build instruments, not widgets

*(This section is for data-driven surfaces — dashboards, analytics, admin. For
content/editorial products the same principle holds at one remove: bespoke, domain-fit
components over stock ones; see Example B.)*

This is where most dashboards go generic. Charts, tables, analytics, and admin views are
the heart of data products, so they get the most invention — not a dropped-in chart
library with default styling.

Principles (concrete code is in `references/burncap-ember-console.md` — adapt the moves,
don't paste):

- **KPI rows are an instrument cluster, not a row of cards.** Render tiles as a single
  hairline-divided grid (one bordered container, `gap-px` over a border-colored
  background) so they read as one connected gauge cluster. Mark the primary metric with
  a signature accent edge. Big, deliberately-set numerals.
- **Lead with one signature visualization.** Each product earns a hero data shape that
  encodes its core metric in its metaphor — BurnCap's radial **burn gauge** and
  **readiness ring** (hand-built SVG, `pathLength=100`, status-driven `currentColor`,
  animated by dash-array). This is the screenshot-able moment; invest in it.
- **Tables are ranked and typeset, not spreadsheets.** `01/02` rank numerals, the leader
  in the signature hue, right-aligned figures, and an **inline share bar** so each row
  shows magnitude at a glance. A dense table can be beautiful.
- **Show composition as one segmented bar**, not a pie — a single hairline-split bar
  with a legend gives "what's my mix" instantly.
- **When you do use a chart library** (recharts etc.), retheme it completely: chart
  colors from your tokens, typeset tooltips with a color swatch, axis lines off /
  hairline dashed grid only, a dashed signature reference line for forecast/targets.
  Default chart styling is a tell; erase it.
- **Admin/internal UIs get the same treatment.** Reuse the exact instrument cluster,
  panel chrome, and ranked tables. Internal tools are still eastbase products.

## 4. States carry the signature

This is the fastest way to tell a crafted product from a generic one. Empty, error, and
loading are not edge cases — they're the **first** thing a new user sees and the moments
a stressed user remembers. Give each the product's signature. Full patterns and code in
`references/state-ui-signatures.md`.

- **Empty / first-run is a designed moment**, not centered gray text. A full-bleed
  surface with the product's atmosphere (signature glow + grain, *or* a blank leaf with
  a deckle edge), the brand mark, a **display-font** headline, one human sentence, and a
  clear primary action (plus a "load demo data" escape hatch where it fits). Inline
  empties (an empty panel/table) get one *forward-looking* sentence — "No alerts yet.
  Budgets and spike rules will post here." — not a dead "No data".
- **Errors/404 stay on-brand.** A branded full-screen with the texture kit, the brand
  mark, a big display-font code, a calm explanation, and a route back home. A 500 is
  not where the design budget runs out.
- **Loading mirrors the real layout.** Skeletons shaped like the actual page (cluster,
  panels, varied-height chart bars — or ruled lines of placeholder text) so content pops
  in without jank — plus a small live branded indicator so it reads as the product
  *warming up*, not a frozen page. Reserve a centered branded loader for light pages
  (onboarding/invite).

## 5. Layout: premium and distinct

- **One shared chrome.** Every panel/section uses the same primitive (a `Panel` /
  `SectionPanel` with a hairline header + micro-label eyebrow), so the whole app feels
  like one machine. Never mix bespoke panels and raw stock cards on different pages —
  unify onto the chrome.
- **Make the shell intentional.** A grouped, labeled sidebar (with a live status pulse
  in the footer) reads as a console; a flat nav reads as a template. Whatever the
  structure, it should look chosen.
- **Structure with hairlines and rhythm.** Thin borders, aligned columns, a consistent
  spacing scale, and a clear type hierarchy do more for "premium" than any effect.
  Crowding and ragged alignment are what cheapen UI.
- **Reserve ceremony type for ceremony.** Display/serif faces belong on marketing,
  auth, and big empty-state headlines — not on dense functional data.

## 6. Quality gates

Before calling any UI done, verify (use the preview tools — don't eyeball from code):

- **Responsive.** The cluster reflows (e.g. 2-col → 5-col), tables stay legible or
  scroll deliberately, nothing overflows. Check a narrow viewport.
- **Both themes.** If the product ships dark and light, each is deliberately tuned —
  signature accent, borders, and status hues all read correctly in each. No invisible
  borders, no blown-out glows.
- **Contrast.** Body text, muted text on tinted surfaces, and status colors meet WCAG
  AA. Warm/desaturated and paper palettes are both easy to push too low — check.
- **Motion.** Reveals/transitions honor `prefers-reduced-motion`; reveal-on-load
  content is visible without JS (no permanently-hidden content if a script fails).
- **Accessibility.** Decorative atmosphere is `aria-hidden`; custom viz has `role`/
  `aria-label`; interactive elements are reachable and labeled.

## Self-review rubric

Run this before declaring UI finished. If you can't answer yes, it's not eastbase-done:

1. **Swap-the-logo test** — would this still look like a competitor's product? If yes, push the signature deeper into the structure.
2. **Signature present** — one hue + small semantic palette, deliberate numeral treatment, the texture kit (no stray gradients)?
3. **Bespoke, not stock** — is the hero shape purpose-built and metaphor-driven, or a default chart/card?
4. **States designed** — do empty, error, and loading each carry the signature?
5. **One chrome** — does every panel share the same primitives, or did stock cards sneak in?
6. **Didn't anchor** — does the result share *no* hue/metaphor/type with the reference examples? (If it does, you copied — re-derive from the domain.)
7. **Gates pass** — responsive, both themes, contrast, reduced-motion all verified in the browser?

## References

Two deliberately contrasting worked examples — read them for the **structural moves**,
not the specifics (see the derive-first rule up top). If your output resembles either
one's palette, metaphor, type, or light/dark stance, you copied instead of deriving.

- `references/burncap-ember-console.md` — **Example A: a dark, data-driven product.**
  Tokens, the shared primitive vocabulary, the instrument cluster, radial gauges, ranked
  mono tables, segmented composition, and a retheme'd recharts chart. The most concrete
  code reference.
- `references/contrasting-signature-example.md` — **Example B: a light, editorial
  product.** The same method on an opposite domain — paper palette, serif voice,
  proportional numerals, rule-and-deboss atmosphere — to prove the method generalizes and
  to break any "eastbase = the BurnCap look" reflex.
- `references/state-ui-signatures.md` — deep patterns for empty / error / loading,
  with the three empty-state tiers and the skeleton-that-mirrors approach.
