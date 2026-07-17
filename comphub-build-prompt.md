# CompHub — Claude Code build prompt

Paste this as your first message in Claude Code, run from the root of the cloned
`hudlix/comphub` repo (after `claude` and `/init`). It scaffolds the walking skeleton
and the adapter core — the first two issues — on mock mode, with nothing requiring a
credential.

Work in small, reviewable commits (signed off with `-s`). Read `CLAUDE.md` first and obey
every locked decision and guardrail in it. Don't reopen locked decisions; if one truly
needs revisiting, stop and flag it.

---

> Read `CLAUDE.md`, then scaffold the CompHub monorepo. Build only what's below — this is
> the walking skeleton plus the adapter core. Keep everything genericized and vendor-neutral,
> mock mode ON by default, zero credentials required to run.
>
> **1. Monorepo foundation**
> - npm workspaces at the root. TypeScript everywhere, ESM only. Add a root `tsconfig`,
>   shared lint/format config, and root scripts: `dev` (boots web + api together via
>   `concurrently`), `build`, `test`, `lint`, `typecheck`.
> - A root `package.json` already exists with the workspace globs (`apps/*`, `packages/*`,
>   `packages/adapters/*`) and the `dev`/`dev:web`/`dev:api` scripts — keep them working as
>   you create the apps. `concurrently` is the only dev orchestration dependency; do **not**
>   introduce a global monorepo tool (nx/turbo/pnpm) — `npm install` + `npm run dev` must be
>   all anyone needs to run it.
> - Layout (create empty-but-wired modules where logic comes later):
>   ```
>   apps/web        # launcher shell + workspace modules (lazy-loaded chunks)
>   apps/api        # API: core + per-workspace modules (conditional registration)
>   packages/core   # shared domain types, enablement + config schema
>   packages/ui     # shared design system / components
>   packages/adapters/ports     # PmProvider, ScannerProvider, ScmProvider interfaces
>   packages/adapters/mock      # default zero-credential mock adapters
>   packages/config             # SLA defaults (30/60/90, editable), enablement config
>   ```
> - Use the editorial design tokens already in the site/demo: Fraunces (display),
>   Inter (UI), JetBrains Mono (data); warm paper `#FBFAF7`, marine `#16485A`,
>   sienna `#C2703D` as the warn/severity accent. Put these in `packages/ui`.
>
> **1b. Run-and-try paths (make all of these work on mock data)**
> - **Embedded store by default.** Persist config/enablement to SQLite (or in-memory) so
>   nothing external is needed to run. Read `COMPHUB_DB`; default to a local SQLite file.
>   Postgres is opt-in for real deployments only. Continuity is git-based and needs no store.
> - **`npm run dev`** must boot web + api together in mock mode with no secret.
> - **`docker compose up`** must work: create `apps/web/Dockerfile` and `apps/api/Dockerfile`
>   (multi-stage, build from the monorepo root context so workspace packages resolve) that
>   satisfy the existing root `docker-compose.yml` (web :3000, api :4000, `COMPHUB_MODE=mock`,
>   embedded store on the `comphub-data` volume). Add a `GET /health` endpoint on the api for
>   the compose healthcheck.
>
> **2. Enablement (both layers)**
> - *Per-deployment:* a typed config that lists which workspaces ship. Disabled workspaces
>   must not register their API modules and must not ship their UI chunks.
> - *Per-user:* an API endpoint returning the enabled workspaces a user is assigned; the
>   shell mounts only those. Stub auth is fine for now (no real identity provider) — keep
>   the seam clean so SSO/RBAC can slot in later as enterprise concerns, kept out of this repo.
>
> **3. Launcher shell**
> - `apps/web` renders the launcher listing enabled workspaces (empty placeholders are
>   fine), the shared top bar with a **mock-mode badge**, and Settings. No cross-workspace
>   internal imports — shared code goes through `packages/*`.
>
> **4. Adapter ports + mock adapters**
> - Define `PmProvider`, `ScannerProvider`, `ScmProvider` in `packages/adapters/ports`.
> - Implement mock versions in `packages/adapters/mock` returning deterministic neutral
>   demo data (`checkout-service`, `payments-api`, `web-storefront`, `acme/payments`).
> - Add an adapter **registry** that resolves providers from config, with **mock as the
>   default**. Swapping to a real adapter must be a config-only change.
>
> **Acceptance criteria**
> - `npm install && npm run dev` boots web + api with **no secret required**.
> - `docker compose up` brings up web (:3000) and api (:4000) on mock data with the embedded
>   store, and the api `/health` check passes.
> - The launcher lists enabled workspaces; toggling a workspace in per-deployment config
>   adds/removes it from both API registration and the UI.
> - Providers resolve from config; mocks return deterministic demo data; switching a
>   provider is config-only.
> - No cross-workspace internal imports anywhere.
>
> **Out of scope for this pass:** any real Jira/scanner/GitHub calls, workspace business
> logic, mutations, the `/comphub` skill. We'll do those next.
>
> When done, summarize what you created, list the new scripts, and propose the next issue
> (the read-only **Delivery** vertical slice on the mock PM, including the derived-stage rule).

---

## After this runs
Next prompts, one per issue:
1. **Delivery (read-only slice)** — Delivery module in web + api consuming `PmProvider`;
   render Epic → Story → Task; derive the lifecycle stage from the one configurable rule
   (column/status/label), not stored. Done when changing the rule changes the derived stage
   with no data migration.
2. **Vulnerabilities (read-only slice)** — findings on the SLA clock against the editable
   30/60/90 policy; severity → remediation window; breach/approaching/ok states.
3. **The `comphub` skill** — `.claude/skills/comphub/SKILL.md` invoked as `/comphub`, plus the
   app's single "standardize repo" PR that installs `.comphub/`. App reads/launches; the skill
   writes logs locally, committed with the work.

Keep each to a small PR tied to a GitHub issue. Mock mode stays the default throughout.
