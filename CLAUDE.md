# CLAUDE.md — CompHub

Project memory for Claude Code. Read this at the start of every session and follow it.

## What we're building
CompHub is an **open-source** control plane that helps engineering teams stay compliant
and in control of their apps **without replacing the tools they already use**. It stitches
together vulnerability SLAs, delivery cadence, health, observability, reporting, and
persistent AI session memory into one launcher. Open core now; a paid enterprise tier
comes later.

Org: **hudlix**. Repo: **hudlix/comphub**. License: **Apache-2.0**.
Name is **CompHub** — never use the old working names ("DJ Compass" / "Compass") in any
artifact.

## Product shape
A launcher shell + independently enableable workspaces:
- **Delivery** — Epic → Story → Task from the PM provider; lifecycle stage
  (Planning → Scoping → Dev → QA → Prod) is **derived** from one configurable rule, not stored.
- **Vulnerabilities** — scanner findings on a remediation SLA clock + scan-and-remediate.
- **Health** — uptime / latency / incidents.
- **Observability** — behavioral checks + alert reliability.
- **Reporting** — cross-workspace roll-ups.
- **Continuity** — per-repo committed AI session memory (`.comphub/`).
- **Launcher** + **Settings** are the shared shell, not workspaces.

## Locked architecture decisions (do not re-litigate; flag if one truly needs revisiting)
- **One UI app + one API app** in a modular npm-workspaces monorepo. Each workspace is a
  module/folder inside each, cleanly isolated: **no cross-workspace internal imports**;
  shared code lives in shared packages. A workspace must be promotable to its own
  deployable later.
- **Two enablement layers:** *per-deployment* (config decides which workspaces ship —
  lazy-loaded UI chunks + conditional API module registration so disabled ones don't
  exist) and *per-user* (API returns which enabled workspaces a user is assigned; the
  shell mounts only those).
- **Integrations are pluggable adapter ports**, not hardwired vendors: `PmProvider`,
  `ScannerProvider`, `ScmProvider`. Ship concrete adapters (Jira, a scanner, GitHub) as
  examples, plus a **mock adapter + mock mode ON by default** so the app runs with zero
  credentials.
- **Delivery data comes from the PM provider** (Epic→card, Stories→rollup, Tasks→child).
  The lifecycle **stage** is *derived* via one configurable rule (board column / status /
  label), never stored.
- **Continuity: git is the system of record.** `.comphub/` committed in each repo is the
  memory. The app **reads, launches, and standardizes**; it does not write logs. Log
  writing happens locally via a committed `comphub` skill
  (`.claude/skills/comphub/SKILL.md`, invoked as `/comphub …`), committed in the same PR
  as the work. The app's only write is a "standardize repo" PR. One repo per session.
- **SLA policy is configuration, not hardcoded** (defaults 30/60/90 days per severity,
  editable per deployment).

## Guardrails (always)
- **No employer/proprietary specifics anywhere public.** Genericize all names. Use neutral
  demo data: `checkout-service`, `payments-api`, `web-storefront`, `acme/payments`. When in
  doubt, leave it out.
- **Vendor-neutral core.** Jira/scanners/GitHub are example adapters, never assumptions in
  core. Design so GitLab, Azure DevOps, other scanners can be added.
- **Secrets via env only, never committed.** Mock mode is the zero-credential default.
- **Mutations default to dry-run / human-in-the-loop** (propose a PR; never auto-apply).
- **Skill/command files are reviewed in PRs like code.**
- **Legal items are not ours to decide.** Licensing mechanics, CLA/DCO, trademark on the
  name, dependency license compatibility → present options, recommend counsel, don't
  assert what's legally safe.
- **Keep enterprise-only concerns separable** (SSO/SCIM, fine-grained RBAC, multi-tenant,
  audit logs, advanced reporting) — design the seam now, build it later, keep it out of
  this public repo.

## Conventions
- TypeScript everywhere; ESM imports only (no `require`).
- **npm workspaces** — no global monorepo tool (nx/turbo/pnpm) required to run or try it.
  Workspace globs: `apps/*`, `packages/*`, `packages/adapters/*` (dirs without a
  package.json are ignored). Shared types/domain in `packages/core`; shared UI in
  `packages/ui`. Adapters under `packages/adapters/*`; provider interfaces in
  `packages/adapters/ports`.
- One `npm install` at the root wires everything; `npm run dev` boots web + api together
  (via `concurrently`). Users never `cd` into internal folders.
- **Embedded store by default.** Config/enablement persists to SQLite (or in-memory) so
  `docker compose up` and `npm run dev` need no external database. Postgres is opt-in
  (`COMPHUB_DB`) for real deployments. Continuity needs no store — it's git-based.
- Prefer minimal, durable structure over volume. Small, reviewable PRs, each tied to an issue.
- Commit sign-off required: `git commit -s` (DCO).

## Commands
- `npm install` — install the whole workspace
- `npm run dev` — boot web + api together in mock mode
- `docker compose up` — same, containerized, embedded store, zero toolchain
- `npm test` / `npm run lint` / `npm run typecheck` — across all workspaces
- `npm run build` — build all workspaces

## Try paths (keep all of these working, mock-first)
1. Hosted demo (`docs/demo/`) — zero install.
2. `docker compose up` — one command, no Node needed.
3. `npm install && npm run dev` — contributor path (Node 18+).
4. `npx @hudlix/comphub create <name>` — scaffold a deployment (publishable CLI, later).

## Site
- `docs/index.html` — public landing page (served at comphub.io via GitHub Pages /docs).
- `docs/demo/` — the interactive dashboard mockup ("live demo").
- Keep both genericized and vendor-neutral.

## How to work
Build issue by issue (see ROADMAP / open issues). Don't reopen a locked decision without
flagging it first. Flag legal/licensing items for counsel. Ask before large refactors.
