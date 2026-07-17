# CompHub

**Stay compliant and in control — without replacing your stack.**

CompHub is an open-source control plane that helps engineering teams stay on top of
their apps without swapping out the tools they already use. It unifies vulnerability
SLAs, delivery cadence, service health, observability, and reporting into one launcher
of independently enableable workspaces, connected to your stack through pluggable
adapters. A committed `.comphub/` memory layer gives every repo persistent, resumable
session context, so any teammate — or a fresh agent — can pick up where the last one
left off.

> Status: **early / design phase.** This repo currently hosts the product site and the
> first specs. The application scaffold lands next (see Issues). Everything runs in
> **mock mode** by default — no credentials required.

🔗 **Live site:** https://comphub.io · 🧪 **Demo:** https://comphub.io (mock data)

## Workspaces

Each workspace is independent and can be turned on or off per deployment and per user.

- **Delivery** — Epic → Story → Task from your PM provider, with a lifecycle stage
  (Planning → Scoping → Dev → QA → Prod) that's *derived* from a configurable rule,
  not stored.
- **Vulnerabilities** — scanner findings on a remediation SLA clock, with a
  scan-and-remediate workflow that defaults to a PR for human review.
- **Health** — service uptime, latency, and incidents.
- **Observability** — behavioral checks and alert reliability.
- **Reporting** — cross-workspace roll-ups for the people who don't open the others.
- **Continuity** — per-repo, committed AI session memory (`.comphub/`) so work and
  incidents are resumable. Git is the system of record; CompHub reads and launches it.

The launcher and settings are the shared shell, not workspaces.

## Design principles

- **One UI app + one API app** in a modular monorepo; workspaces are isolated modules.
- **Integrations are pluggable adapter ports** (`PmProvider`, `ScannerProvider`,
  `ScmProvider`), not hardwired vendors. A mock adapter ships by default.
- **Vendor-neutral by design.** Jira / scanners / GitHub are example adapters; GitLab,
  Azure DevOps, and others can be added.
- **Policy is configuration, not code** (e.g. SLA windows are editable per deployment).
- **Human-in-the-loop by default** — mutations propose a PR rather than auto-applying.

## Try it

CompHub is one monorepo (web app + API + packages), and every path below runs in **mock
mode** — no credentials, no external services.

**1. Hosted demo — nothing to install.** Open **[comphub.io/demo](https://comphub.io/demo)**.

**2. Run locally with Docker — one command.** *(once the app scaffold has landed)*
```bash
git clone https://github.com/hudlix/comphub.git
cd comphub
docker compose up        # web on :3000, api on :4000, embedded store, mock data
```

**3. Run from source — the contributor path.** Requires Node.js 18+.
```bash
git clone https://github.com/hudlix/comphub.git
cd comphub
npm install              # one install for the whole workspace
npm run dev              # boots web + api together, in mock mode
```

**4. Scaffold your own deployment.**
```bash
npx @hudlix/comphub create my-platform
```

> The repo uses **npm workspaces** — no global monorepo tool is required just to run it.
> A single `npm install` at the root wires every app and package; `npm run dev` starts
> everything. You never need to `cd` into the internal folders.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) — in short,
sign your commits off (`git commit -s`), keep public examples genericized, and never
commit secrets.

## License

Licensed under the [Apache License 2.0](./LICENSE).

CompHub is a project of the **hudlix** organization. The license covers the code, not
the name — see CONTRIBUTING for notes on trademark and governance.
