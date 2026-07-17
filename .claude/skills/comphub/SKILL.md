---
name: comphub
description: Read and write this repo's committed AI session memory in .comphub/. Use at the start of a work session to recall what happened last time, and at the end to log what was done. Triggers include the user typing /comphub, or asking to "log this session", "save our progress", "what did we do last time", "pick up where we left off", "start a new session", "end/resume this session", "add a to-do", "what's on my to-do list", "pick a task to work on", "work through my to-do list automatically", "run a batch of tasks", "loop through these tasks and open PRs", "standardize this repo for comphub", or "what can comphub do / list comphub commands".
---

# CompHub Continuity — per-repo session memory

CompHub Continuity (the `/comphub` command) keeps a durable, human-readable log of what
you and the user did in this repo,
committed alongside the work. **Git is the system of record.** The CompHub app only
*reads* `.comphub/` and proposes a one-time "standardize" PR; it never writes logs.
**Writing logs is this skill's job, run locally, committed in the same change as the
work it describes.**

`.comphub/` layout:

```
.comphub/
  README.md            # what this is + the format (don't edit per-session)
  index.md             # rolling index, newest first — one line per session
  todo.md              # repo to-do backlog — open items first, then done
  sessions/
    NNNN-slug.md       # one file per work session, zero-padded id, kebab slug
```

## Subcommands

Parse the text after `/comphub`. With no argument, default to **recall**. The commands
fall into four groups: **memory** (`recall`), the **session lifecycle**
(`start` → `log` → `end`, plus `resume`), the **to-do backlog** (`todo`, `pick`), and
**automation** (`loop`) — which runs a confirmed batch of tasks autonomously, one PR each.
Use **help** to list every command, or `help <command>` for example usage.

There is **at most one active session** at a time — the one with `status: in-progress`.
`start` opens it **on a fresh `feat/<slug>` branch**, `log` checkpoints it, `end` closes
it by **committing (signed-off) and opening a PR**, `resume` re-enters it.

### `/comphub help [command]`
Show what comphub can do, and example usage on request.
1. With **no command argument**, print the command list — one line each:
   - `recall` — restore context from prior sessions (the default when you type `/comphub`)
   - `start [title]` — branch `feat/<slug>` and begin a new session (becomes the active one)
   - `log [title]` — checkpoint the active session into `.comphub/sessions/`
   - `end` — finalize the active session, commit it (signed-off), and open a PR
   - `resume [id]` — re-enter the active (or a named) in-progress session
   - `todo [add <text> | list | done <id>]` — manage the repo to-do backlog
   - `pick [id]` — pull a to-do item into the active session and start on it
   - `loop [tasks]` — work a confirmed batch of tasks autonomously, one branch + PR each
   - `standardize` — create the `.comphub/` skeleton if missing
   - `help [command]` — show this list, or example usage for one command

   Then invite the user to choose: "Reply with a command name — or run
   `/comphub help <command>` — to see example usage."
2. If the user names a command (via `/comphub help <command>`, or by replying with the
   name after the list), show that command's **Example** block. If the name is unknown,
   list the valid command names.

**Example**
```text
> /comphub help
→ lists recall / start / log / end / resume / todo / pick / loop / standardize / help, then:
  "Reply with a command name — or run /comphub help <command> — to see example usage."
> log                     (or: /comphub help log)
→ prints the log Example block below.
```

### `/comphub recall`
Restore context from prior sessions before starting work.
1. If `.comphub/` does not exist, say so and offer `/comphub standardize`. Stop.
2. Read `.comphub/index.md`, then read the newest 1–3 session files under
   `.comphub/sessions/` (highest ids). If a session is `status: in-progress`, call it out
   as active and suggest `/comphub resume`.
3. Summarize for the user: what was last done, the current branch/state, and any
   **open threads / next steps**. Do not start work — just surface the memory.

**Example**
```text
> /comphub recall
→ "Last session (0002): added the /comphub skill and .comphub/ memory; merged to
   main via PR #1. Branch is now main. Open threads: make the Continuity workspace
   read .comphub/, and build the app's standardize-repo PR."
```

### `/comphub start [title]`
Begin a new work session **on its own branch** and make it the **active** session.
1. Ensure `.comphub/` exists (run **standardize** first if not).
2. If a session is already `status: in-progress`, don't open a second one — name the
   active session and offer `/comphub resume` to continue it or `/comphub end` to close
   it first. Stop.
3. Determine the next id (max `sessions/NNNN-*.md` + 1, zero-padded to 4 digits, start at
   `0001`). Build a kebab `<slug>` from the title (or from the goal you and the user agree
   on).
4. **Create and switch to the working branch `feat/<slug>`** (`git checkout -b feat/<slug>`),
   branched from the current base. First confirm you're on the intended base (e.g. the
   default branch, up to date) and that the tree is clean — if there are uncommitted
   changes, ask before carrying them onto the new branch. If `feat/<slug>` already exists,
   switch to it instead of recreating.
5. Create `.comphub/sessions/NNNN-slug.md` from the template below with `status: in-progress`,
   `date` set to today (absolute), `branch` set to `feat/<slug>`, the **Goal** filled in,
   and the remaining sections stubbed.
6. Prepend the index line and stage. The session stays open — checkpoint it with
   `/comphub log` and close it (commit + PR) with `/comphub end`.

**Example**
```text
> /comphub start Delivery read-only slice
→ runs `git checkout -b feat/delivery-read-only-slice`, creates
   sessions/0004-delivery-read-only-slice.md (status: in-progress, branch:
   feat/delivery-read-only-slice, goal filled), prepends the index line, and stages both.
   It's now the active session — checkpoint with /comphub log, close with /comphub end.
```

### `/comphub log [title]`
Record (checkpoint) the active session without necessarily closing it.
1. Ensure `.comphub/` exists (run **standardize** first if not).
2. If a session is `status: in-progress`, **update it in place**. Otherwise determine the
   next id (max `sessions/NNNN-*.md` + 1, zero-padded to 4 digits, start at `0001`), build
   a kebab slug from the title (or the session's main theme), and create
   `.comphub/sessions/NNNN-slug.md` from the template below.
3. Fill it from the actual session: the goal, concrete work done, decisions **with their
   why**, files touched, and unfinished threads. Be factual and concise — a future
   session must be able to resume from it.
4. Prepend a one-line pointer to `.comphub/index.md` (newest first), unless the session
   already has an index line (then refresh its hook if the scope changed):
   `- [NNNN — Title](sessions/NNNN-slug.md) — short hook`
5. Stage the new/updated files. Do **not** create a separate commit — these are meant
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

**Example**
```text
> /comphub log Delivery read-only slice
→ creates (or updates) sessions/0004-delivery-read-only-slice.md (goal, work, decisions
   with why, files, next steps), prepends a line to .comphub/index.md, and stages
   both so they land in the same commit as the work.
```

### `/comphub end`
Finalize the active session, **commit it on its branch, and open a PR**.
1. Find the `status: in-progress` session (the active one). If none exists, say so and
   offer `/comphub start`. Stop.
2. Update it in place: fill **Work done**, **Decisions** (with the *why*), **Files touched**,
   and **Open threads / next steps** from the actual session; flip `status` to `complete`.
3. If open threads remain, offer to push them onto the backlog via `/comphub todo add` so
   they aren't lost between sessions.
4. Refresh the session's index hook if its scope changed, then **stage** the work + the
   `.comphub/` changes together.
5. **Commit with sign-off** (`git commit -s`, DCO) using a concise message (the session
   title + a one-line summary). Show the message for confirmation first. Record the
   resulting short sha in the session's `commits:` (amend, or add a follow-up commit, per
   the user's preference).
6. **Push the branch** (`git push -u origin feat/<slug>`) and **open a PR** with
   `gh pr create` — title from the session, body summarizing **Goal / Work done / next
   steps** and linking the session log. Surface the PR title + body for confirmation before
   pushing (human-in-the-loop — never force-push, never auto-merge). Report the PR URL.

**Example**
```text
> /comphub end
→ flips sessions/0004 to status: complete, fills work / decisions / files / next-steps,
   stages everything, commits with `git commit -s`, pushes feat/delivery-read-only-slice,
   and runs `gh pr create` — returning the PR link. Offers to add any leftover open
   threads to .comphub/todo.md.
```

### `/comphub resume [id]`
Re-enter an in-progress session and continue it.
1. With **no id**, find the newest `status: in-progress` session; with an **id**, use that
   one. If the target is already `complete`, say so and suggest `/comphub start` for new
   work (only re-open a complete session to correct an error).
2. Read it and summarize: the **Goal**, what's been done so far, and the **Open threads /
   next steps** — like `recall`, but focused on this single session.
3. Treat it as the active session again; subsequent `log` / `end` operate on it. Don't
   start work — surface the memory first.

**Example**
```text
> /comphub resume
→ "Resuming 0004 (Delivery read-only slice, in-progress): goal …; done so far …;
   next: …" Then continue checkpointing into 0004 and close it with /comphub end.
```

### `/comphub todo [add <text> | list | done <id>]`
Manage the repo to-do backlog in `.comphub/todo.md` (open items first, then done). IDs are
stable `T###`. If `todo.md` is missing, create it from the skeleton on the first `add`.
- **`todo add <text>`** — append a new open item with the next id (max `T###` + 1, start
  `T001`) and today's date. Stage `todo.md`.
- **`todo`** or **`todo list`** — print the open items (id + text). Add `all` to include
  the done items too.
- **`todo done <id>`** — check the item off and move it to **Done** with today's date (and
  the session id if it had one). Stage `todo.md`.

`todo.md` skeleton:

```markdown
# CompHub to-do

Repo backlog — open items first, then done. Maintained by the `comphub` skill
(`/comphub todo`). IDs (`T###`) are stable; checked items are done.

## Open
- [ ] (T001) <task> — added YYYY-MM-DD

## Done
```

**Example**
```text
> /comphub todo add Wire Continuity to read .comphub/
→ appends "- [ ] (T004) Wire Continuity to read .comphub/ — added 2026-06-25" under
   ## Open in .comphub/todo.md and stages it.
> /comphub todo
→ lists the open items, e.g. "T004 — Wire Continuity to read .comphub/".
> /comphub todo done T004
→ checks T004 off and moves it under ## Done with the date.
```

### `/comphub pick [id]`
Pull a to-do item into the active session and start on it.
1. With **no id**, list the open to-do items and ask which to pick. With an **id**, use it.
2. If there's no active session, offer `/comphub start` first (you can seed its goal from
   the item's text). Annotate the picked item in `todo.md` as in progress, tagged with the
   active session id — e.g. `· in progress → session 0004`. Stage `todo.md`.
3. Surface the item and begin the work. When it's done, `/comphub todo done <id>` checks it
   off and `/comphub end` records the session.

**Example**
```text
> /comphub pick T004
→ marks T004 in .comphub/todo.md as "in progress → session 0004", surfaces it, and you
   start the work. Close it with /comphub todo done T004, then /comphub end.
```

### `/comphub loop [task list]`
Work through a **batch** of tasks autonomously — one branch + one PR per task — after a
**single** up-front confirmation. It's `start` + `end` run in a loop, with no per-task
prompting in between.

1. **Gather the tasks.** In order of precedence: tasks given inline / pasted with the
   command; a list the user points to; otherwise the **open items in `.comphub/todo.md`**.
   Normalize each to `{id, title, slug}` (reuse the `T###` id for backlog items; assign one
   otherwise).
2. **Confirm once — the only human gate.** Print the ordered task list and ask for a single
   go/no-go. The user may trim, reorder, or cap it here. After they confirm, **run the rest
   without further prompts.**
3. **Loop, per task (autonomous):**
   - **Start:** branch `feat/<slug>` from a clean base, open a session (`status:
     in-progress`), mark the backlog item in progress (as `/comphub pick`).
   - **Do the work and take the best call:** make the reasonable default decision yourself
     and **record it — with the *why* — in the session's Decisions**. That log is the audit
     trail that stands in for live confirmation.
   - **End:** finalize the session, commit signed-off (`git commit -s`), push, and **open a
     PR** (never merge). Mark the backlog item done (as `/comphub todo done`).
   - Return to the base branch before the next task so each PR is independent.
4. **Report.** When the batch finishes (or a stop condition hits), print a table: task →
   branch → PR link → outcome (done / skipped / failed). Nothing is merged — the open PRs
   are the review queue.

**Bounds & safety — the loop stays inside the repo guardrails:**
- **Propose, never merge.** Every task ends as an open PR; the human gate moves to
  review/merge, not the work loop. No force-push, no auto-merge.
- **Skip, don't guess, when a call exceeds autonomy.** A task that needs
  secrets/credentials, implies a **large refactor**, would **reopen a locked architecture
  decision**, or is too ambiguous to action safely → skip it, record why, and continue.
  Surface every skip in the final report.
- **Bounded run.** Stop at the confirmed list's end and after **N consecutive failures**
  (default 2) so a broken loop can't run away. A task that balloons past a small change →
  open a **draft PR** with progress + remaining notes instead of looping on it.
- One session + one branch + one PR per task; same DCO sign-off and review-gated PR as
  `end`.

**Example**
```text
> /comphub loop
→ reads the open items in .comphub/todo.md, prints them, and asks once to confirm. On
   "go", for each item it branches feat/<slug>, does the work (recording decisions with
   their why), commits signed-off, and opens a PR — looping with no further prompts. Ends
   with a table: T001 → feat/wire-continuity → PR #12 (done); T002 → — (skipped: needs
   credentials).
```

### `/comphub standardize`
Create the `.comphub/` skeleton if missing: `README.md` (from this skill's description of
the format), an empty `index.md` with a heading, an empty `todo.md` with the backlog
heading, and an empty `sessions/` directory. Mirrors the app's "standardize repo" PR, done
locally. Never overwrites existing logs.

**Example**
```text
> /comphub standardize
→ on a repo with no .comphub/: creates README.md, an empty index.md, an empty todo.md,
   and sessions/. On a repo that already has them: reports "already standardized" and
   changes nothing.
```

## Rules
- **One active session at a time.** `start` opens it (`status: in-progress`), `end` closes
  it (`status: complete`), `resume` re-enters it. Don't leave two sessions in-progress.
- **Branch per session.** `start` works on `feat/<slug>`; `end` commits there with
  sign-off (`git commit -s`, DCO) and opens a PR — it **proposes**, never merges or
  force-pushes. Confirm the commit message and PR before pushing.
- **`loop` is autonomous but bounded.** One confirmation up front, then no per-task
  prompts; every task still ends as an **open PR (never merged)**, decisions are logged
  with their *why*, and anything needing secrets / a large refactor / a locked-decision
  change is **skipped and reported**, not guessed.
- **Append-only history.** Don't rewrite past session files except to correct an error.
- **To-do ids are stable** (`T###`) and the backlog is repo-level, not session-scoped;
  don't renumber items when they're completed.
- **Same guardrails as the repo:** no secrets, no proprietary/employer specifics,
  genericize names. When in doubt, leave it out.
- **Dates are absolute** (`YYYY-MM-DD`), never "today"/"yesterday".
- Keep entries short and durable — record decisions and next steps, not a transcript.
- One repo per session; `.comphub/` belongs to this repo only.
