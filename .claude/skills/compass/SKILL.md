---
name: compass
description: Read and write this repo's committed AI session memory in .compass/. Use at the start of a work session to recall what happened last time, and at the end to log what was done. Triggers include the user typing /compass, or asking to "log this session", "save our progress", "what did we do last time", "pick up where we left off", or "standardize this repo for compass".
---

# Compass — per-repo session memory

Compass keeps a durable, human-readable log of what you and the user did in this repo,
committed alongside the work. **Git is the system of record.** The CompHub app only
*reads* `.compass/` and proposes a one-time "standardize" PR; it never writes logs.
**Writing logs is this skill's job, run locally, committed in the same change as the
work it describes.**

`.compass/` layout:

```
.compass/
  README.md            # what this is + the format (don't edit per-session)
  index.md             # rolling index, newest first — one line per session
  sessions/
    NNNN-slug.md       # one file per work session, zero-padded id, kebab slug
```

## Subcommands

Parse the text after `/compass`. With no argument, default to **recall**.

### `/compass recall`
Restore context from prior sessions before starting work.
1. If `.compass/` does not exist, say so and offer `/compass standardize`. Stop.
2. Read `.compass/index.md`, then read the newest 1–3 session files under
   `.compass/sessions/` (highest ids).
3. Summarize for the user: what was last done, the current branch/state, and any
   **open threads / next steps**. Do not start work — just surface the memory.

### `/compass log [title]`
Record the current session.
1. Ensure `.compass/` exists (run **standardize** first if not).
2. Determine the next id: max existing `sessions/NNNN-*.md` + 1, zero-padded to 4
   digits (start at `0001`). Build a kebab-case slug from the title (or the session's
   main theme).
3. If a session file for the *current* in-progress session already exists, **update it
   in place** rather than creating a duplicate. Otherwise create
   `.compass/sessions/NNNN-slug.md` from the template below.
4. Fill it from the actual session: the goal, concrete work done, decisions **with their
   why**, files touched, and unfinished threads. Be factual and concise — a future
   session must be able to resume from it.
5. Prepend a one-line pointer to `.compass/index.md` (newest first):
   `- [NNNN — Title](sessions/NNNN-slug.md) — short hook`
6. Stage the new/updated files. Do **not** create a separate commit — these are meant
   to land in the same commit/PR as the work. If the work is already committed, amend or
   add a follow-up commit per the user's preference.

Session file template:

```markdown
---
id: NNNN
date: YYYY-MM-DD
title: <short title>
status: complete | in-progress
branch: <git branch at time of logging>
commits: [<short sha>, ...]   # commits this session produced, if any
---

## Goal
<what this session set out to do>

## Work done
- <concrete change or outcome>

## Decisions
- <decision> — **why:** <reason>

## Files touched
- `path/to/file` — <what changed>

## Open threads / next steps
- [ ] <the next thing, specific enough to act on cold>
```

### `/compass standardize`
Create the `.compass/` skeleton if missing: `README.md` (from this skill's description of
the format), an empty `index.md` with a heading, and an empty `sessions/` directory.
Mirrors the app's "standardize repo" PR, done locally. Never overwrites existing logs.

## Rules
- **Append-only history.** Don't rewrite past session files except to correct an error.
- **Same guardrails as the repo:** no secrets, no proprietary/employer specifics,
  genericize names. When in doubt, leave it out.
- **Dates are absolute** (`YYYY-MM-DD`), never "today"/"yesterday".
- Keep entries short and durable — record decisions and next steps, not a transcript.
- One repo per session; `.compass/` belongs to this repo only.
