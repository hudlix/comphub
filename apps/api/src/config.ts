import type { AdapterMode, DeploymentConfig, WorkspaceId } from '@comphub/core';
import { isWorkspaceId } from '@comphub/core';
import { DEFAULT_DEPLOYMENT_CONFIG } from '@comphub/config';
import type { Store } from './store/index.js';

/**
 * Resolve the per-deployment config: stored value (or packaged default), with env
 * overrides applied on top each boot, then persisted. Env knobs:
 *   - COMPHUB_MODE        'mock' | 'live'
 *   - COMPHUB_WORKSPACES  comma list narrowing which workspaces ship
 */
export async function loadConfig(store: Store): Promise<DeploymentConfig> {
  const base = store.getConfig() ?? DEFAULT_DEPLOYMENT_CONFIG;
  const config = applyEnv(base, process.env);
  store.setConfig(config);
  return config;
}

function applyEnv(
  base: DeploymentConfig,
  env: NodeJS.ProcessEnv,
): DeploymentConfig {
  const mode: AdapterMode = env.COMPHUB_MODE === 'live' ? 'live' : 'mock';

  let workspaces = base.workspaces;
  if (env.COMPHUB_WORKSPACES) {
    const requested = env.COMPHUB_WORKSPACES.split(',')
      .map((s) => s.trim())
      .filter((s): s is WorkspaceId => isWorkspaceId(s));
    workspaces = requested;
  }

  return { ...base, mode, workspaces };
}
