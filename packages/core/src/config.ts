import type { WorkspaceId } from './workspaces.js';

/**
 * Adapter mode. `mock` is the zero-credential default; `live` selects real adapters.
 * Resolution is config-only — no code change to swap a provider.
 */
export type AdapterMode = 'mock' | 'live';

/**
 * Which concrete adapter answers each port. Values are adapter ids registered in the
 * adapter registry (e.g. 'mock', 'jira', 'github'). Vendor-neutral by design.
 */
export interface ProviderConfig {
  pm: string;
  scanner: string;
  scm: string;
}

/** The full per-deployment configuration. Persisted in the embedded store. */
export interface DeploymentConfig {
  /** Global adapter mode; individual providers may still be named explicitly. */
  mode: AdapterMode;
  /** Per-deployment enablement: which workspaces ship in this deployment. */
  workspaces: readonly WorkspaceId[];
  /** Which adapter answers each port. */
  providers: ProviderConfig;
}
