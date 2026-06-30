# Contributing to CompHub

Thanks for your interest in CompHub. This guide covers how to contribute and the few
rules we hold firmly.

## Developer Certificate of Origin (DCO)

We use the [DCO](https://developercertificate.org/) instead of a CLA for now. It means
you certify that you wrote the contribution (or have the right to submit it). Sign each
commit off with the `-s` flag:

```bash
git commit -s -m "Your message"
```

This appends a `Signed-off-by:` line with your name and email. Set them once with
`git config user.name` and `git config user.email` if you haven't.

## Ground rules

- **No proprietary or employer-specific details** in anything public. Genericize app
  names, org names, infra, and SLAs. Use neutral demo data (`checkout-service`,
  `acme/payments`). When in doubt, leave it out.
- **Never commit secrets.** Credentials come from the environment only. The app runs in
  **mock mode** with zero credentials by default; keep it that way.
- **Mutations are human-in-the-loop.** Anything that changes a repo defaults to a
  dry-run / PR for review — never auto-apply.
- **Keep it vendor-neutral.** Concrete adapters (Jira, scanners, GitHub) are examples
  behind provider interfaces, never assumptions baked into the core.
- **Skill and command files are code.** `.comphub/` skills and `/comphub` commands are
  reviewed in PRs like any other change.

## How to contribute

1. Open or comment on an issue describing the change.
2. Fork, branch, and make focused commits (signed off).
3. Keep PRs small and reviewable. Reference the issue.
4. For a new workspace or adapter, follow the module isolation pattern — no
   cross-workspace internal imports; shared code goes in shared packages.

## Governance, license, and trademark

CompHub is licensed under Apache-2.0. The license covers the code, not the **CompHub**
name. Trademark, relicensing, and any future enterprise/open-core boundary are
decisions made by the maintainers (the hudlix org) and may involve legal counsel. If a
contribution touches licensing or dependency license compatibility, flag it in the PR.

## Code of conduct

Be respectful and constructive. Harassment or discrimination isn't tolerated.
