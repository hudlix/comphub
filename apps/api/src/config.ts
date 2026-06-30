import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AdapterMode, DeploymentConfig, WorkspaceId } from '@comphub/core';
import { isWorkspaceId } from '@comphub/core';
import { DEFAULT_DEPLOYMENT_CONFIG } from '@comphub/config';
import type { Store } from './store/index.js';

/**
 * Resolve the per-deployment config. Precedence, lowest to highest:
 *   1. stored value (or the packaged zero-credential default)
 *   2. a `comphub.config.json` file, if present (what `npx @hudlix/comphub create`
 *      scaffolds) — found via COMPHUB_CONFIG or `./comphub.config.json`
 *   3. env overrides (COMPHUB_MODE / COMPHUB_WORKSPACES)
 * The resolved config is persisted so it survives the next boot.
 *
 * Env knobs:
 *   - COMPHUB_CONFIG      path to a comphub.config.json (else ./comphub.config.json)
 *   - COMPHUB_MODE        'mock' | 'live'
 *   - COMPHUB_WORKSPACES  comma list narrowing which workspaces ship
 */
export async function loadConfig(store: Store): Promise<DeploymentConfig> {
  const base = loadConfigFile(process.env) ?? store.getConfig() ?? DEFAULT_DEPLOYMENT_CONFIG;
  const config = applyEnv(base, process.env);
  store.setConfig(config);
  return config;
}

/** Read + validate a scaffolded `comphub.config.json`, or null if none/invalid. */
export function loadConfigFile(env: NodeJS.ProcessEnv): DeploymentConfig | null {
  const explicit = env.COMPHUB_CONFIG;
  const path = explicit ? resolve(explicit) : resolve(process.cwd(), 'comphub.config.json');
  if (!existsSync(path)) {
    if (explicit) console.warn(`[config] COMPHUB_CONFIG points at a missing file: ${path}`);
    return null;
  }
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<DeploymentConfig>;
    const config = normalizeConfig(parsed);
    console.log(`[config] loaded deployment config from ${path}`);
    return config;
  } catch (err) {
    console.warn(`[config] could not read ${path}; falling back to default`, err);
    return null;
  }
}

/** Coerce an untrusted parsed object into a valid DeploymentConfig, dropping bad fields. */
function normalizeConfig(raw: Partial<DeploymentConfig>): DeploymentConfig {
  const def = DEFAULT_DEPLOYMENT_CONFIG;
  const mode: AdapterMode = raw.mode === 'live' ? 'live' : 'mock';
  const workspaces = Array.isArray(raw.workspaces)
    ? raw.workspaces.filter((w): w is WorkspaceId => typeof w === 'string' && isWorkspaceId(w))
    : [...def.workspaces];
  const providers = {
    pm: raw.providers?.pm ?? def.providers.pm,
    scanner: raw.providers?.scanner ?? def.providers.scanner,
    scm: raw.providers?.scm ?? def.providers.scm,
  };
  return { mode, workspaces, providers };
}

function applyEnv(
  base: DeploymentConfig,
  env: NodeJS.ProcessEnv,
): DeploymentConfig {
  // Only override mode when COMPHUB_MODE is explicitly set; otherwise keep the base
  // (default or file) value so a scaffolded `mode: "live"` isn't silently reset.
  const mode: AdapterMode =
    env.COMPHUB_MODE === 'live' ? 'live' : env.COMPHUB_MODE === 'mock' ? 'mock' : base.mode;

  let workspaces = base.workspaces;
  if (env.COMPHUB_WORKSPACES) {
    const requested = env.COMPHUB_WORKSPACES.split(',')
      .map((s) => s.trim())
      .filter((s): s is WorkspaceId => isWorkspaceId(s));
    workspaces = requested;
  }

  return { ...base, mode, workspaces };
}
