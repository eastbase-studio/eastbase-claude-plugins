---
name: eastbase-blog-post
description: >-
  Eastbase Studio's writing skill for practical, honest, product-led long-form content —
  blog posts, build-in-public notes, dogfooding stories, launch/update essays, AI/dev
  workflow posts, practical SaaS essays, and repurposing that content into X, LinkedIn, or
  Reddit drafts. Use this WHEN the user asks to write, draft, outline, review, improve, or
  repurpose a blog post or long-form piece for Eastbase (the Lab/blog), turn product notes
  or a PR/launch into a post, write a founder/dev essay, or adapt a post per platform. It is
  NOT a generic SEO/keyword blog generator and NOT sales copy — it is the Eastbase writing
  taste layer that makes content sound like a builder sharing real notes (specific, honest,
  useful even if the reader never buys the product), not a marketing department: no hype, no
  invented metrics, no overpromising, no obvious AI-writing tells. Produces titles + angle +
  target reader + draft (+ meta / repurposing) for new posts, a structured critique for
  reviews, and per-platform drafts for repurposing. Do NOT trigger for UI implementation, PR
  review, launch-readiness audits, legal/policy drafting, pure technical documentation, SEO
  keyword stuffing, short transactional emails, short marketing or page copy (hero lines,
  CTAs, button/label copy), or unrelated non-eastbase writing unless explicitly requested.
  Combine with eastbase-launch-check (announcing after a readiness
  check), eastbase-review-pr (a technical-change story), and eastbase-premium-ui (a
  UI/design decision post).
---

# Eastbase Blog Post

This is a **writing taste layer**, not a blog generator. Eastbase uses content to share
practical stories, product lessons, AI/dev-workflow insights, and behind-the-scenes notes —
so the bar isn't "ranks for a keyword," it's **would a smart builder find this useful even
if they never touch the product?** The test for every piece: does it sound like a thoughtful
builder sharing real notes, or like a marketing department that ran a template?

Content here supports Eastbase's products, but it is **not sales copy**. The product earns a
mention only when it genuinely belongs in the story. If a post reads like a funnel, it has
failed — even if every sentence is true.

> **Write from a real moment, not a topic.** The strongest Eastbase posts start from
> something that actually happened while building — a mistake, a decision, a tradeoff, a
> thing you noticed while dogfooding — not from "5 tips for X." Before drafting, pull the
> real moment from the project: the README, the notes, the diff, the product, what the user
> tells you. If there's no real observation to anchor on, **narrow the angle or ask for
> one** — don't fill the gap with fluff. A confident post about nothing is the one thing
> Eastbase content must never be.

## The voice

- **Founder / dev voice.** First person (I / we) where natural. Calm, practical, specific —
  slightly personal but not overly emotional. You're a builder writing notes, not a brand
  with a personality deck, and not a confessional.
- **Honest about stage and uncertainty.** "I'm still testing this," "this might change," "I
  don't know yet" are allowed and *build* trust. Name tradeoffs; don't pretend you solved a
  hard thing cleanly.
- **Concrete over broad.** One real example beats three general claims. Numbers, file names,
  the actual decision — the specifics are what make it not generic.
- **Respect the reader.** Assume they're smart and busy. No throat-clearing, no explaining
  the obvious, no manufactured urgency.
- **Product stays in the background** until it earns a line. Mention it because it's the
  natural next sentence, not because the post needs a CTA.

**Do not write like this** (the AI/SaaS tells — see `references/anti-patterns.md`):

- No hype adjectives — **no** "game-changing," "revolutionary," "seamless," "unlock your
  potential," "supercharge," "effortless" — unless the word is literally, defensibly true.
- No "In today's fast-paced digital world…" or any generic scene-setting intro. Start at the
  moment.
- No invented authority or data — no "studies show," no made-up percentages, no fake case
  studies or customer quotes.
- No aggressive CTA ("Sign up now and transform your workflow!"). Close soft.
- No symmetrical hype tricolons ("It's fast, it's simple, it's powerful"), no engagement-bait
  hooks, no LinkedIn-guru cadence.

## Default shape

- **800–1,500 words** unless the user asks otherwise.
- **Short sections with meaningful headings** (a heading is a promise about what's below —
  not "Introduction" / "Conclusion").
- **Narrative + practical analysis.** Tell what happened, then what it means — let the "why
  it matters" come through the story, not a bolted-on thought-leadership section.
- **Plain, natural English**, readable paragraphs. **Avoid dense bullet lists** unless a
  list genuinely reads better than prose.
- End on a **practical takeaway, an honest open question, or a soft product mention** — one,
  not all three stacked.

## What to write — content types

Pick the type that fits the real material; each has a natural shape.

1. **Product story** — why the product exists → the problem that triggered it → what the
   current version actually does → what you learned building it → who it's for → soft CTA.
2. **Dogfooding** — how Eastbase used its own product → what worked → what was awkward →
   what changed after using it → the lesson for other builders.
3. **Build-in-public** — one specific decision or mistake → a short honest timeline → the
   tradeoffs → current status → what's next. Small and true beats big and vague.
4. **Practical dev/SaaS essay** — a useful idea from building → an Eastbase example →
   the generalizable lesson, *without* pretending it's universal law.
5. **AI workflow** — where AI agents helped → where they failed → what still needed human
   taste/judgment → the cost / quality / risk tradeoff → a practical takeaway.
6. **Launch / update** — what changed → why it matters → who should care → **known
   limitations** (name them; it's what makes a launch post credible) → soft CTA.
7. **Repurposing** — turn one post into platform-native drafts (see below).

## How to write one — workflow

1. **Gather the real context first.** Read the project: README, notes, docs, product pages,
   the diff, whatever the user gives you. The specifics live here.
2. **Find the angle** — problem, product story, lesson, mistake, comparison, launch, or
   dogfooding. One angle, not a survey.
3. **Name the target reader** — solo dev, SaaS builder, freelancer, small team, AI-heavy
   builder, or a potential customer. Write to one of them.
4. **Commit to a thesis** — the single thing this post argues or shows.
5. **Outline first when the topic is complex** (offer the outline before a long draft).
6. **Draft in the Eastbase voice**, keeping the product mention natural.
7. **Add the practical takeaway** the reader can use tomorrow.
8. **Flag anything unsupported** — any claim, metric, or fact that needs the user's
   confirmation or a current source (mark it inline, don't quietly assert it).
9. **Offer 2–3 title options and a short meta description** when useful.

## Repurposing across platforms

Each platform gets a *different* piece, not the same text pasted three times. Worked examples
in `references/platform-repurposing.md`.

- **X** — sharper, shorter, more opinionated. One idea, tight. No thread padding, no
  engagement-bait hook.
- **LinkedIn** — a little more reflective and structured; still a real person, **not**
  guru-cadence or "Agree? 👇" bait.
- **Reddit** — **discussion-first, never an ad.** Lead with the real problem, lesson, or
  question — not the product name. Prefer "I noticed / I built / I learned" over "check out
  my product." Mention the product only if it's natural and the subreddit allows it. **No
  links unless the user explicitly asks.**

## Output format

**When writing a new post:**

1. **Suggested titles** (2–3).
2. **Recommended angle.**
3. **Target reader.**
4. **Draft blog post.**
5. **Meta description** (optional).
6. **Repurposing ideas** (optional).

**When reviewing an existing post:**

1. **Overall assessment** (is it Eastbase-credible, or does it read generic/promotional?).
2. **What works.**
3. **What feels generic or too promotional** — quote the lines.
4. **Accuracy / credibility risks** — unsupported claims, invented specifics, overpromises.
5. **Suggested structural improvements.**
6. **Rewritten version or targeted edits** if requested.

**When repurposing:**

1. **X version.**
2. **LinkedIn version.**
3. **Reddit version** (if requested).
4. **Notes on platform-specific tone.**

## Before you finalize (self-check)

- **Opening earns its place** — no generic filler; it starts at a real moment.
- **Anchored in something real** — a concrete insight, decision, or observation, not a
  topic.
- **Useful without the click** — the reader gains something even if they never open the
  product.
- **No overpromising, no fake metrics, no invented case studies.**
- **Product mention feels natural** and the **CTA is soft and credible.**
- **Claims are accurate** for the context you actually have (unsupported ones are flagged,
  not asserted).
- **Sounds like a real builder wrote it** — and it's **easy to scan.**
- **Marked where a concrete example would make it stronger** (and asked for it if missing).

## Rules

- **Invent nothing.** No product features, user numbers, revenue, benchmarks, case studies,
  or customer quotes that aren't in the source material.
- **Don't claim success** ("thousands of users," "10x faster") without evidence provided.
- **No legal / medical / financial / compliance claims.**
- **Not a sales funnel** — resist turning every post into a conversion path.
- **Thin source → narrow, or ask.** If the material is too thin for a real post, pick a
  smaller true angle or ask the user for the missing detail — never pad with broad fluff.
- **Recent AI / model / company news** → require current source verification before stating
  specific facts, versions, prices, or benchmarks; flag anything you can't verify.
- **Preserve the user's real POV.** When they hand you rough notes, keep their voice and
  their actual point — don't sand it into polished corporate nothing.

## References

- `references/example-eastbase-post.md` — a full worked dogfooding / build-in-public post in
  the Eastbase voice, with a short breakdown of *why* it works.
- `references/anti-patterns.md` — the generic-AI-writing tells, each with a concrete
  before → after rewrite. Read this to calibrate what "not generic" actually means.
- `references/platform-repurposing.md` — one idea repurposed into X, LinkedIn, and Reddit
  drafts, with the per-platform voice rules.
