import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import {
  WORKSPACES,
  WORKSPACE_IDS,
  isWorkspaceId,
  type WorkspaceId,
} from '@comphub/core';

const VERSION = '0.1.0';
const REPO = 'https://github.com/hudlix/comphub.git';

interface CreateOptions {
  name: string;
  dir: string;
  workspaces: WorkspaceId[];
  mode: 'mock' | 'live';
  force: boolean;
}

function main(argv: string[]): number {
  const args = argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    printHelp();
    return 0;
  }
  if (cmd === '--version' || cmd === '-v') {
    console.log(VERSION);
    return 0;
  }
  if (cmd === 'create') {
    return runCreate(args.slice(1));
  }

  console.error(`Unknown command: ${cmd}\n`);
  printHelp();
  return 1;
}

function runCreate(args: string[]): number {
  const flags = parseFlags(args);
  const name = flags._[0];
  if (!name) {
    console.error('error: missing deployment name\n\n  npx @hudlix/comphub create <name>\n');
    return 1;
  }
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name)) {
    console.error(
      `error: "${name}" is not a valid name (use letters, digits, '.', '_', '-')\n`,
    );
    return 1;
  }

  const dir = resolve(process.cwd(), name);
  const force = Boolean(flags.force);
  if (existsSync(dir) && readdirSync(dir).length > 0 && !force) {
    console.error(`error: ${dir} already exists and is not empty (use --force to overwrite)\n`);
    return 1;
  }

  const workspaces = resolveWorkspaces(flags.workspaces);
  if (workspaces === null) return 1;

  const mode = flags.mode === 'live' ? 'live' : 'mock';

  scaffold({ name: basename(name), dir, workspaces, mode, force });
  return 0;
}

/** Parse `--flag value`, `--flag=value`, and `--bool` into a tiny options object. */
function parseFlags(args: string[]): { _: string[]; [k: string]: string | boolean | string[] } {
  const out: { _: string[]; [k: string]: string | boolean | string[] } = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) {
        out[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const next = args[i + 1];
        if (next && !next.startsWith('--')) {
          out[a.slice(2)] = next;
          i++;
        } else {
          out[a.slice(2)] = true;
        }
      }
    } else {
      out._.push(a);
    }
  }
  return out;
}

function resolveWorkspaces(value: string | boolean | string[] | undefined): WorkspaceId[] | null {
  if (value === undefined || value === true) return [...WORKSPACE_IDS];
  const list = String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const unknown = list.filter((s) => !isWorkspaceId(s));
  if (unknown.length) {
    console.error(
      `error: unknown workspace(s): ${unknown.join(', ')}\n` +
        `       valid: ${WORKSPACE_IDS.join(', ')}\n`,
    );
    return null;
  }
  // de-dupe while preserving order
  return [...new Set(list)] as WorkspaceId[];
}

function scaffold(opts: CreateOptions): void {
  mkdirSync(opts.dir, { recursive: true });
  const write = (rel: string, content: string) => {
    const p = join(opts.dir, rel);
    writeFileSync(p, content);
    console.log(`  created  ${join(opts.name, rel)}`);
  };

  console.log(`\nScaffolding CompHub deployment "${opts.name}"\n`);
  write('comphub.config.json', configJson(opts));
  write('.env.example', envExample(opts));
  write('docker-compose.yml', composeYml());
  write('.gitignore', gitignore());
  write('README.md', readmeMd(opts));

  printNextSteps(opts);
}

function configJson(opts: CreateOptions): string {
  return (
    JSON.stringify(
      {
        $schema: 'https://comphub.io/schema/deployment.json',
        mode: opts.mode,
        workspaces: opts.workspaces,
        providers: { pm: 'mock', scanner: 'mock', scm: 'mock' },
      },
      null,
      2,
    ) + '\n'
  );
}

function envExample(opts: CreateOptions): string {
  return [
    '# CompHub deployment environment. Copy to `.env` and fill in for a live deployment.',
    '# Mock mode needs none of these — it runs with zero credentials.',
    '',
    `COMPHUB_MODE=${opts.mode}`,
    'COMPHUB_CONFIG=./comphub.config.json',
    '',
    '# Embedded store by default (no external DB). Point at Postgres for real deployments:',
    '# COMPHUB_DB=postgres://user:pass@host:5432/comphub',
    'COMPHUB_DB=sqlite://./comphub.db',
    '',
    '# Adapter credentials (only when mode=live and you swap a provider off "mock"):',
    '# JIRA_BASE_URL=',
    '# JIRA_TOKEN=',
    '# GITHUB_TOKEN=',
    '# SCANNER_API_KEY=',
    '',
  ].join('\n');
}

function composeYml(): string {
  return [
    '# CompHub — run this deployment in Docker, mock mode, zero credentials.',
    '#   docker compose up   →  web :3000, api :4000',
    '#',
    '# Builds the app from the public repo; your comphub.config.json is mounted in and',
    '# read via COMPHUB_CONFIG, so this folder is the only thing you maintain.',
    '',
    'services:',
    '  api:',
    '    build:',
    `      context: ${REPO.replace(/\.git$/, '')}#main`,
    '      dockerfile: apps/api/Dockerfile',
    '    environment:',
    '      COMPHUB_CONFIG: /config/comphub.config.json',
    '      COMPHUB_DB: "sqlite:///data/comphub.db"',
    '      PORT: "4000"',
    '    volumes:',
    '      - ./comphub.config.json:/config/comphub.config.json:ro',
    '      - comphub-data:/data',
    '    ports:',
    '      - "4000:4000"',
    '    healthcheck:',
    '      test: ["CMD", "node", "-e", "fetch(\'http://localhost:4000/health\').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]',
    '      interval: 10s',
    '      timeout: 3s',
    '      retries: 5',
    '',
    '  web:',
    '    build:',
    `      context: ${REPO.replace(/\.git$/, '')}#main`,
    '      dockerfile: apps/web/Dockerfile',
    '    ports:',
    '      - "3000:3000"',
    '    depends_on:',
    '      api:',
    '        condition: service_healthy',
    '',
    'volumes:',
    '  comphub-data:',
    '',
  ].join('\n');
}

function gitignore(): string {
  return ['node_modules/', '.env', '*.db', 'comphub-app/', ''].join('\n');
}

function readmeMd(opts: CreateOptions): string {
  const enabled = opts.workspaces
    .map((id) => {
      const meta = WORKSPACES.find((w) => w.id === id);
      return `- **${meta?.title ?? id}** — ${meta?.tagline ?? ''}`;
    })
    .join('\n');

  return `# ${opts.name}

A [CompHub](https://comphub.io) deployment, scaffolded with \`npx @hudlix/comphub create\`.
Runs in **${opts.mode} mode**${opts.mode === 'mock' ? ' — zero credentials required' : ''}.

## Enabled workspaces

${enabled}

Edit \`comphub.config.json\` to change which workspaces ship or to swap an adapter
(\`mock\` → a real \`PmProvider\` / \`ScannerProvider\` / \`ScmProvider\`).

## Run it

### Docker (no toolchain)

\`\`\`bash
docker compose up        # web :3000, api :4000 — reads ./comphub.config.json
\`\`\`

### From source

\`\`\`bash
git clone ${REPO} comphub-app
COMPHUB_CONFIG="$PWD/comphub.config.json" npm --prefix comphub-app install
COMPHUB_CONFIG="$PWD/comphub.config.json" npm --prefix comphub-app run dev
\`\`\`

The API reads \`comphub.config.json\` (via \`COMPHUB_CONFIG\`) as its deployment config,
then applies any \`COMPHUB_*\` env overrides on top. See \`.env.example\`.

## Going live

Copy \`.env.example\` to \`.env\`, set \`COMPHUB_MODE=live\`, point \`comphub.config.json\`
providers at real adapters, and supply their credentials via env. Mutations stay
human-in-the-loop — CompHub proposes a PR, it never auto-applies.
`;
}

function printNextSteps(opts: CreateOptions): void {
  console.log(`\n✓ Done. Next:\n`);
  console.log(`  cd ${opts.name}`);
  console.log(`  docker compose up        # or: see README.md to run from source`);
  console.log(`\n  → web  http://localhost:3000`);
  console.log(`  → api  http://localhost:4000/health\n`);
}

function printHelp(): void {
  console.log(`comphub ${VERSION} — scaffold a CompHub deployment

Usage:
  npx @hudlix/comphub create <name> [options]

Options:
  --workspaces <a,b,c>   Comma list to enable (default: all)
                         ${WORKSPACE_IDS.join(', ')}
  --mode <mock|live>     Adapter mode (default: mock)
  --force                Overwrite a non-empty target directory
  -h, --help             Show this help
  -v, --version          Show version

Examples:
  npx @hudlix/comphub create my-platform
  npx @hudlix/comphub create acme --workspaces vulnerabilities,delivery,continuity
`);
}

process.exit(main(process.argv));
