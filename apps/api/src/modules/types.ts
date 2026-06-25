import type { Router } from 'express';
import type { DeploymentConfig } from '@comphub/core';
import type { Providers } from '@comphub/adapters-registry';

/** What every workspace API module receives. Providers come pre-resolved from config. */
export interface ModuleContext {
  config: DeploymentConfig;
  providers: Providers;
}

/** A workspace module is a factory that builds its router. Registered only if enabled. */
export type WorkspaceModule = (ctx: ModuleContext) => Router;
