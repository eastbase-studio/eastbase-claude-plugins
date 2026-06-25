# Eastbase Studio — Claude Code plugins

A Claude Code **plugin marketplace** for shared agent tooling across every eastbase
studio product. One install per machine, then `git pull` (or auto-update) keeps every
device and teammate in sync.

## Plugins

| Plugin | What it does |
| --- | --- |
| `eastbase-premium-ui` | The house standard for premium, personality-rich product UI — a transferable per-product *signature* method (metaphor → palette → type → bespoke components), creative charts/tables/analytics/admin, designed empty/loading/error states, and dark-mode/contrast gates. BurnCap's "Ember Console" is the worked reference. |

## Install (per device)

```bash
# Add this marketplace (once per machine)
claude plugin marketplace add eastbase-studio/eastbase-claude-plugins

# Install the eastbase plugin (ships the eastbase-premium-ui skill)
claude plugin install eastbase@eastbase-studio
```

Replace `eastbase-studio/eastbase-claude-plugins` with the actual GitHub `owner/repo`
once pushed. For local development you can instead point at this checkout:

```bash
claude plugin marketplace add "/path/to/eastbase-claude-plugins"
```

To update everywhere later: `claude plugin marketplace update eastbase-studio` then
`claude plugin update eastbase@eastbase-studio`. The skill is invoked as
`eastbase:eastbase-premium-ui` (Claude namespaces it `plugin:skill`), and auto-triggers
on UI work via its description regardless.

## Per-repo reinforcement

Skill auto-triggering is reliable for broad UI tasks but not for routine single surfaces
(a lone loading skeleton, a 404, one empty state). Add this to each eastbase repo's
`CLAUDE.md` so the skill is consulted deterministically:

```md
## UI work
For ANY user-facing UI in this repo — pages, components, charts, tables, and
**especially** empty / loading / error / 404 states — follow the `eastbase-premium-ui`
skill before writing or editing. Read it via the Skill tool; don't reproduce generic
shadcn / SaaS defaults from memory.
```

## Layout

```
.claude-plugin/marketplace.json          # marketplace manifest (lists plugins)
plugins/
└── eastbase/                            # the "eastbase" plugin (bundles studio skills)
    ├── .claude-plugin/plugin.json        # plugin manifest
    └── skills/eastbase-premium-ui/       # the skill (auto-discovered → eastbase:eastbase-premium-ui)
        ├── SKILL.md
        ├── references/
        └── evals/                        # trigger eval set (for re-optimizing the description)
```
