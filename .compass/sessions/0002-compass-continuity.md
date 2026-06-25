---
id: 0002
date: 2026-06-25
title: Compass / Continuity feature
status: in-progress
branch: feat/compass-continuity
commits: []
---

## Goal
Implement the `compass` Continuity feature and dogfood it on this repo: a committed
`.compass/` memory that self-documents our AI-assisted work sessions.

## Work done
- Added the `compass` skill at `.claude/skills/compass/SKILL.md`, invoked as `/compass`
  with `recall` / `log` / `standardize` subcommands.
- Standardized this repo's `.compass/` layout: `README.md`, `index.md`, `sessions/`.
- Seeded session `0001` (the monorepo scaffold) and this entry.

## Decisions
- **Session frontmatter is the source of truth; `index.md` is regenerated from it.**
  **why:** avoids maintaining the same metadata in two places.
- **The skill writes; the app only reads/standardizes.** **why:** locked architecture —
  git is the system of record, log writing is local and committed with the work.
- **Append-only history.** **why:** past sessions are a durable record, not mutable state.

## Files touched
- `.claude/skills/compass/SKILL.md` — the skill
- `.compass/README.md`, `.compass/index.md` — format + index
- `.compass/sessions/0001-monorepo-scaffold.md`, `0002-compass-continuity.md` — logs

## Open threads / next steps
- [ ] Wire the **Continuity** workspace UI/API to read `.compass/` (app side) — currently
      stub modules.
- [ ] Implement the app's one-time "standardize repo" PR that installs `.compass/` into a
      target repo.
- [ ] Commit this work (skill + `.compass/`) on `feat/compass-continuity`; decide whether
      to push / open a PR.
