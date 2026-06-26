---
id: 0003
date: 2026-06-25
title: compass help command
status: complete
branch: feat/compass-help
commits: []
---

## Goal
Add a `/compass help` command that lists every supported command and lets the user pick
one to see example usage.

## Work done
- Added the `### /compass help [command]` subcommand to the skill: with no argument it
  prints the command list and invites the user to choose; with a command name it shows
  that command's example.
- Gave every command (`help`, `recall`, `log`, `standardize`) a compact **Example** block
  so `help <command>` has concrete usage to surface.
- Updated the skill description triggers to include "what can compass do / list commands"
  and noted `help` in the Subcommands intro.

## Decisions
- **Example blocks live inside each command's own section** (not a separate cheatsheet) —
  **why:** one source of truth; `help <command>` just surfaces the adjacent block.
- **`help` is explicit; the no-arg default stays `recall`** — **why:** recall is the
  high-frequency start-of-session action; discoverability is opt-in via `help`.

## Files touched
- `.claude/skills/compass/SKILL.md` — added `help` subcommand + per-command examples
- `.compass/sessions/0003-compass-help-command.md`, `.compass/index.md` — this log

## Open threads / next steps
- [ ] Wire the Continuity workspace (app side) to read `.compass/`.
- [ ] Implement the app's one-time "standardize repo" PR.
- [ ] Repo housekeeping: set default branch to `main`; delete merged/redundant branches.
