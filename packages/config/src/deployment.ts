import type { DeploymentConfig } from '@comphub/core';
import { WORKSPACE_IDS } from '@comphub/core';

/**
 * Default per-deployment config for the public, zero-credential build:
 *   - mock mode ON
 *   - every workspace shipped (a deployment narrows this list to subset what it ships)
 *   - every provider resolved to the mock adapter
 *
 * Swapping a provider to a real adapter is a config-only change to `providers`.
 */
export const DEFAULT_DEPLOYMENT_CONFIG: DeploymentConfig = {
  mode: 'mock',
  workspaces: [...WORKSPACE_IDS],
  providers: {
    pm: 'mock',
    scanner: 'mock',
    scm: 'mock',
  },
};
