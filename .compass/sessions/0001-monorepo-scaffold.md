---
id: 0001
date: 2026-06-25
title: Monorepo scaffold + GitHub setup
status: complete
branch: main
commits: [ea6797b]
---

## Goal
Scaffold the CompHub monorepo: the walking skeleton plus the adapter core (the first
build issue). Mock mode on by default, zero credentials to run.

## Work done
- Established the repo root at `comphub/` inside the cluttered `comphub_org/` scratch dir
  (copied the starter base in, `git init`).
- npm-workspaces monorepo, TypeScript/ESM throughout. Root tooling: `tsconfig.base.json`,
  flat ESLint, Prettier; `dev`/`build`/`test`/`lint`/`typecheck` scripts.
- Shared packages: `@comphub/core` (severity, workspace registry, enablement + config
  schemas), `@comphub/config` (editable 30/60/90 SLA defaults, default deployment config),
  `@comphub/ui` (editorial tokens + TopBar/MockBadge/WorkspaceCard).
- Adapter core: `@comphub/adapters-ports` (PmProvider/ScannerProvider/ScmProvider),
  `@comphub/adapters-mock` (deterministic neutral demo data), `@comphub/adapters-registry`
  (resolves providers from config, mock default).
- `apps/api` (Express): `/health`, `/api/config`, `/api/me/workspaces`, per-workspace
  modules registered only when the deployment ships them. Embedded store: in-memory
  default, SQLite via `COMPHUB_DB`. Stub auth via `x-user-id`.
- `apps/web` (Vite + React): launcher shell, mock-mode badge, Settings, one lazy-loaded
  chunk per workspace. Both Dockerfiles added.
- Verified: typecheck + lint + build clean across all 8 workspaces; `npm run dev` boots
  web :3000 + api :4000 (proxied); `docker compose up` brings up a healthy api and the web
  SPA on the embedded SQLite volume.

## Decisions
- **Repo root is `comphub/`**, not the `comphub_org/` parent — user created that empty
  folder as the intended root. **Why:** parent is a scratch dir with duplicate/starter files.
- **API bundles with esbuild keeping `express`/`cors`/`better-sqlite3` external.**
  **Why:** bundling CJS deps into an ESM output broke on dynamic `require`; externalizing
  lets Node resolve them at runtime.
- **Web served via `vite preview` in Docker, with the API base baked at build time.**
  **Why:** the browser (on the host) reaches the published `:4000` directly, so no runtime
  config injection is needed.
- **Adapter swap is config-only** via the registry; mock is the always-present default.
- Commits signed off (DCO) under the machine git identity, per the user's choice.

## Files touched
- `package.json`, `tsconfig.base.json`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`
- `packages/{core,config,ui}`, `packages/adapters/{ports,mock,registry}`
- `apps/api/**`, `apps/web/**`, `apps/{api,web}/Dockerfile`

## Open threads / next steps
- [ ] Default branch on `hudlix/comphub` is still `scaffold/monorepo-foundation`
      (GitHub auto-set it on the empty repo); consider making `main` the default and
      deleting the redundant scaffold branch — pending user go-ahead.
- [ ] Next planned issue: **Delivery (read-only slice)** — render Epic → Story → Task from
      the mock PM and derive the lifecycle stage from one configurable rule (the ports
      already carry `CardSignals`).
