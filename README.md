# Eastbase Studio — Claude Code plugins

A Claude Code **plugin marketplace** for shared agent tooling across every eastbase
studio product. One install per machine, then `git pull` (or auto-update) keeps every
device and teammate in sync.

## Plugins

The `eastbase` plugin bundles the studio's skills:

| Skill | What it does |
| --- | --- |
| `eastbase-premium-ui` | The house standard for premium, personality-rich product UI — a transferable per-product *signature* method (metaphor → palette → type → bespoke components), creative charts/tables/analytics/admin, designed empty/loading/error states, and dark-mode/contrast gates. BurnCap's "Ember Console" is the worked reference. |
| `eastbase-review-pr` | The Eastbase **review overlay** for pull requests, diffs, branches, commits, and agent-generated changes — a product/SaaS/UX/billing/AI-cost/access-control/data-safety lens layered *on top of* your normal code-review, security, and testing tools. Produces a verdict + must-fix vs follow-up findings with P0–P3 severity. |
| `eastbase-launch-check` | The Eastbase **pre-launch readiness gate** — a practical, high-signal go-live review for small SaaS, AI tools, landing pages, internal tools, and Kits. Walks the real launch surface (clarity, core flow, auth, billing/entitlement, DB, env/deploy, email, legal, SEO/OG, observability, AI cost, polish, Kit completeness, docs) and returns a launch verdict, blockers vs follow-ups, and manual-verification + production-config checklists. Not a security/legal/compliance audit. |

## Install (per device)

```bash
# Add this marketplace (once per machine)
claude plugin marketplace add eastbase-studio/eastbase-claude-plugins

# Install the eastbase plugin (ships the eastbase studio skills)
claude plugin install eastbase@eastbase-studio
```

Replace `eastbase-studio/eastbase-claude-plugins` with the actual GitHub `owner/repo`
once pushed. For local development you can instead point at this checkout:

```bash
claude plugin marketplace add "/path/to/eastbase-claude-plugins"
```

To update everywhere later: `claude plugin marketplace update eastbase-studio` then
`claude plugin update eastbase@eastbase-studio`. Skills are invoked as
`eastbase:<skill-name>` (Claude namespaces them `plugin:skill`) and auto-trigger via
their descriptions — `eastbase-premium-ui` on UI work, `eastbase-review-pr` when a review
of a PR/diff/branch/commit is requested, `eastbase-launch-check` when a pre-launch /
go-live readiness review is requested.

## Per-repo reinforcement

Auto-triggering is reliable for explicit, broad requests but not for routine cases — a
lone loading skeleton or 404 (UI), or remembering to review a change before calling it
done. Add these to each eastbase repo's `CLAUDE.md` so the skills are consulted
deterministically:

```md
## UI work
For ANY user-facing UI in this repo — pages, components, charts, tables, and
**especially** empty / loading / error / 404 states — follow the `eastbase-premium-ui`
skill before writing or editing. Read it via the Skill tool; don't reproduce generic
shadcn / SaaS defaults from memory.

## Reviewing changes
When reviewing a PR, diff, branch, or an agent's changes in this repo — and before
declaring any non-trivial change done — apply the `eastbase-review-pr` skill as an overlay
on your normal review: check Eastbase product, auth, billing, AI-cost, data-safety, and UX
risk, not just code cleanliness. Read it via the Skill tool. It is a review overlay only —
it does not change how you implement.
```

## Layout

```
.claude-plugin/marketplace.json          # marketplace manifest (lists plugins)
plugins/
└── eastbase/                            # the "eastbase" plugin (bundles studio skills)
    ├── .claude-plugin/plugin.json        # plugin manifest
    └── skills/                           # auto-discovered → eastbase:<skill-name>
        ├── eastbase-premium-ui/
        │   ├── SKILL.md
        │   ├── references/
        │   └── evals/                    # trigger eval set (for re-optimizing the description)
        ├── eastbase-review-pr/
        │   ├── SKILL.md
        │   ├── references/
        │   └── evals/
        └── eastbase-launch-check/
            ├── SKILL.md
            ├── references/
            └── evals/
```
