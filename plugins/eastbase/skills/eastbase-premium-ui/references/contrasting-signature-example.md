# Reference: "Marginalia" — Example B (light, editorial)

> **⚠ This product is hypothetical**, written for one purpose: to prove the eastbase
> method (§1–§5 of `SKILL.md`) produces signatures with *nothing* in common. It is the
> deliberate opposite of Example A (BurnCap) on every axis. Read it for the **moves**, not
> the specifics — and definitely don't blend the two. If you're building a real product,
> derive *its* signature from *its* domain; these two examples just mark the range.

**Marginalia** is a close-reading and annotation tool — you read long documents and leave
notes in the margin. Its signature reads like a well-set printed page being marked up by
an editor.

## 1. The signature brief

- **Metaphor:** the **printed page + the editor's proof**. Notes live in the margin;
  actions feel like pencil marks and proof corrections.
- **Signature hue:** **vermilion** (a proof-mark red), used sparingly like an editor's
  red pencil — carets, the active margin rule, the one primary action. Text is ink
  (near-black), never pure `#000`.
- **Semantic palette:** annotation states only — `open` (ink), `resolved` (muted sage),
  `flagged` (vermilion). Nothing else.
- **Type:** an old-style / transitional **serif** for both display *and* body (this is an
  editorial product — the serif *is* the brand); a small humanist **sans** only for UI
  labels and chrome. **Numerals are old-style (text) figures, proportional — never mono.**
  (This is the exact inverse of BurnCap's mono-tabular readout, and both are correct for
  their product.)
- **Atmosphere (no gradients):** warm **paper** background (oat/cream), faint paper-fiber
  texture, hairline **ledger rules**, a subtle **letterpress deboss** on raised cards, and
  a single vermilion **margin rule**. No glow, no grain-on-black.
- **Component vocabulary:** `Leaf` (a page-card with a hairline rule frame), `MarginRail`
  (the gutter where annotations and proof-marks live), `ProofMark` (a vermilion caret /
  asterisk — the counterpart to BurnCap's `SeverityDot`), `RuleLabel` (a small-caps serif
  eyebrow — the counterpart to `MicroLabel`), and a `GutterBar` reading-progress shape.

## 2. Same move, opposite result

The method is identical; only the derived specifics differ. That's the whole point.

| Structural move (the method) | Example A · BurnCap | Example B · Marginalia |
| --- | --- | --- |
| Signature section marker | `MicroLabel` — uppercase **mono**, ash | `RuleLabel` — small-caps **serif**, ink, on a hairline rule |
| Atmosphere (not gradients) | grain + blurred ember **glow** on near-black | paper fiber + **letterpress deboss** + ledger rules on cream |
| Hero visualization | radial **burn gauge** (SVG dial) | vertical **gutter bar** of reading progress with chapter ticks |
| Status token | `SeverityDot` (healthy/caution/critical colors) | `ProofMark` (open/resolved/flagged carets) |
| Numerals | **mono** `tabular-nums`, instrument readout | **old-style** proportional figures, set in running text |
| Primary surface | `Panel` — `bg-card/40` hairline border, dark | `Leaf` — cream card, hairline rule frame + faint deboss |
| Accent usage | ember on the #1 row / live indicator | vermilion on the active margin rule / proof caret |

## 3. States carry the signature (the same three tiers, re-derived)

- **Empty / first-run:** not BurnCap's glowing dashed panel — instead a **blank leaf with
  a deckle edge**, a single vermilion margin mark, a serif headline ("Nothing in the
  margins yet"), one line, and a quiet primary action. Paper, not console.
- **Error / 404:** an **errata slip** motif — a torn-edge card, a big serif numeral, one
  vermilion rule, a calm line, a route home.
- **Loading:** **ruled lines** of placeholder text settling in (like ruled paper filling),
  with a quiet vermilion **caret** blinking at the insertion point — never an instrument
  spinner.

## 4. What this proves

BurnCap and Marginalia share **zero** surface DNA — dark vs light, ash vs paper, ember vs
vermilion, console vs page, mono vs serif, glow/grain vs deboss/rules, gauge vs gutter bar.
Yet both pass the eastbase house invariants identically: one signature hue + a tiny
semantic set, atmosphere without gradients, numerals typeset on purpose, bespoke
domain-fit components over stock widgets, designed empty/error/loading states, one shared
chrome, restraint and precision. **That gap is the deliverable.** When you build a real
eastbase product, your signature should sit *somewhere in that range on its own terms* —
not next to either example.
