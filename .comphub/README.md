# .comphub — session memory for this repo

This folder is **CompHub Continuity**: a committed, human-readable record of the work
done in this repo with AI assistance. It exists so any future session — human or AI — can
pick up with full context instead of starting cold.

## How it works

- **Git is the system of record.** Each session log lives here and is committed in the
  same change as the work it describes.
- **The `comphub` skill writes it.** Run [`/comphub`](../.claude/skills/comphub/SKILL.md)
  locally — `recall` to restore context, the `start` → `log` → `end` lifecycle (plus
  `resume`) to record a session, and `todo` / `pick` to manage the repo backlog. The
  CompHub app only *reads* this folder and can propose a one-time "standardize" PR; the
  app never writes logs.

## Layout

```
.comphub/
  README.md          # this file — the format (not edited per session)
  index.md           # rolling index, newest first; one line per session
  todo.md            # repo to-do backlog — open items first, then done
  sessions/
    NNNN-slug.md      # one file per session: zero-padded id + kebab slug
```

## Session file format

YAML frontmatter (`id`, `date`, `title`, `status`, `branch`, `commits`) followed by:
**Goal**, **Work done**, **Decisions** (with the *why*), **Files touched**, and
**Open threads / next steps**. Frontmatter is the machine-readable source of truth the
app reads; the index is regenerated from it.

## Rules

- Append-only history — don't rewrite past sessions except to fix an error.
- Same guardrails as the repo: no secrets, no proprietary specifics, genericize names.
- Absolute dates (`YYYY-MM-DD`). Keep entries durable, not a transcript.
