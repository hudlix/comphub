---
id: 0004
date: 2026-06-25
title: CompHub command — lifecycle, backlog, loop, plugin packaging, and rename
status: complete
branch: feat/compass-help
commits: []
---

## Goal
Grow the `/compass` command into a full session tool, package it so it works across all
repos, and rebrand it off the old "compass" name onto CompHub.

## Work done
- **Session lifecycle:** added `start`, `end`, and `resume` around the existing `log`.
  One active session at a time, tracked by `status: in-progress` (no separate state file).
- **To-do backlog:** added `todo` (`add` / `list` / `done`) + `pick`, backed by a single
  repo-level `.comphub/todo.md` with stable `T###` ids. Seeded T001–T003 from prior open
  threads.
- **Git in the lifecycle:** `start` opens a `feat/<slug>` branch; `end` commits signed-off
  (DCO) and opens a PR (proposes, never merges/force-pushes).
- **Autonomous batch runner:** added `loop` — digests a task list, confirms once, then
  runs unattended, one branch + PR per task; skips-don't-guess on secrets / large refactor
  / locked-decision changes; bounded by an N-consecutive-failure stop.
- **Plugin packaging:** built a Claude Code marketplace repo at sibling `comphub-plugins/`
  (marketplace `hudlix`, plugin `comphub`) bundling the skill, so `/comphub` installs in
  any repo via `/plugin install comphub@hudlix`.
- **Rename compass → comphub:** the `/comphub` command, the skill dir
  (`.claude/skills/comphub/`), and the data folder (`.compass/` → `.comphub/`), plus every
  reference in CLAUDE.md (×2), README, CONTRIBUTING, build-prompt, `continuity.ts`, and the
  public `docs/` site.

## Decisions
- **One active session via `status: in-progress`, no pointer file** — **why:** reuse the
  frontmatter that's already the source of truth.
- **`loop` opens PRs but never merges; one up-front confirmation** — **why:** reconciles
  "no human intervention" with the locked "propose-a-PR, human-in-the-loop" guardrail —
  the PR is the review gate; decisions get logged with their *why* as the audit trail.
- **Plugin, not npm, for the command; marketplace named `hudlix`** — **why:** a SKILL.md is
  LLM instructions, and only a plugin registers a slash command; org-scoped marketplace
  avoids colliding with the `comphub` plugin name and stays extensible.
- **Full rename incl. `.compass/` → `.comphub/` and locked-decision text in CLAUDE.md** —
  **why:** user-directed rebrand off "compass"; flagged the locked-decision edit. Left
  historical session bodies (append-only) and the guardrail line that names the forbidden
  word untouched.

## Files touched
- `.claude/skills/comphub/SKILL.md` — renamed from `compass/`; added start/end/resume/todo/pick/loop; rebranded
- `.comphub/` — renamed from `.compass/`; added `todo.md` (T001–T003); README/index rebranded
- `CLAUDE.md` (this repo + parent), `CONTRIBUTING.md`, `README.md`, `comphub-build-prompt.md` — `.comphub/` + `/comphub`
- `apps/api/src/modules/continuity.ts` — comment ref `.comphub/`
- `docs/index.html`, `docs/demo/index.html` — public site rebranded
- `../comphub-plugins/` — new marketplace + plugin (`marketplace.json`, `plugin.json`, `SKILL.md`, `README.md`)

## Open threads / next steps
- [ ] Commit this repo's work (signed-off) and open a PR — pending base-branch choice (repo
      default is `scaffold/monorepo-foundation`) and whether to use a new branch vs the
      current `feat/compass-help`.
- [ ] `git init` + commit `comphub-plugins/`, then push to `hudlix/comphub-plugins` so the
      plugin is installable by others (it's a separate repo, not part of this PR).
- [ ] (T001) Wire the Continuity workspace to read `.comphub/`.
- [ ] (T002) Implement the app's one-time "standardize repo" PR.
- [ ] (T003) Repo housekeeping: set default branch to `main`; delete merged/redundant branches.
