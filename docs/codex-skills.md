# Codex Skills

Status: current

Eastbase skills are authored once in `plugins/eastbase/skills/`. The Claude plugin
marketplace continues to use the existing `.claude-plugin` and `plugins/eastbase`
structure as the source of truth.

Codex can use the same `SKILL.md` files through its normal skill discovery paths. The
current Codex skill docs describe user-level skills in `$HOME/.agents/skills`,
repository-level skills in `.agents/skills`, and support for symlinked skill folders:
https://developers.openai.com/codex/skills

## Canonical Skill Folders

- `plugins/eastbase/skills/eastbase-premium-ui`
- `plugins/eastbase/skills/eastbase-review-pr`
- `plugins/eastbase/skills/eastbase-launch-check`

Each folder contains the canonical `SKILL.md` plus any `references/`, `evals/`, and
lightweight Codex metadata under `agents/openai.yaml`.

## Install For Codex

Default install creates user-level links from `$HOME/.agents/skills/<skill-name>` to the
canonical folders in this repo:

```sh
node scripts/install-codex-skills.mjs
```

If your environment cannot create symlinks, use the explicit copy fallback:

```sh
node scripts/install-codex-skills.mjs --copy
```

Copy mode is only a fallback. It duplicates the skill folders into the Codex skills
directory, so prefer symlinks when possible. The installer never overwrites unrelated
existing folders; conflicts are reported and skipped.

## Repo-Level Discovery

Codex also supports repo-level `.agents/skills` discovery. This repo does not commit
`.agents/skills` symlinks because this Windows checkout has Git symlink support disabled
(`core.symlinks=false`), which can make committed links unsafe or turn them into duplicate
content on some machines.

To create repo-local links for this checkout, run:

```sh
node scripts/install-codex-skills.mjs --repo
```

Do not use `--copy --repo`; the installer refuses to copy skill content into repo-level
discovery because that would create a second source of truth.

## Verify In Codex

After installing, restart Codex if the skills do not appear immediately. Then check one of:

- Run `/skills` and look for `eastbase-premium-ui`, `eastbase-review-pr`, and
  `eastbase-launch-check`.
- If explicit skill invocation is supported in your Codex environment, try
  `$eastbase-premium-ui`, `$eastbase-review-pr`, or `$eastbase-launch-check`.
- Ask test prompts that should trigger each skill:
  - `In an Eastbase app, design a premium empty state for a dashboard.`
  - `Review this Eastbase PR diff for product, SaaS, billing, access-control, and AI-cost risk.`
  - `Run a pre-launch readiness check before publishing this Eastbase SaaS.`

## Uninstall

Remove the installed entries. For the default user-level install:

```sh
rm "$HOME/.agents/skills/eastbase-premium-ui"
rm "$HOME/.agents/skills/eastbase-review-pr"
rm "$HOME/.agents/skills/eastbase-launch-check"
```

For repo-level links, remove the entries from `.agents/skills/` instead.

On Windows Command Prompt, the equivalent user-level uninstall is:

```bat
rmdir "%USERPROFILE%\.agents\skills\eastbase-premium-ui"
rmdir "%USERPROFILE%\.agents\skills\eastbase-review-pr"
rmdir "%USERPROFILE%\.agents\skills\eastbase-launch-check"
```
