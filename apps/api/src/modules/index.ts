import type { WorkspaceId } from '@comphub/core';
import type { WorkspaceModule } from './types.js';
import { deliveryModule } from './delivery.js';
import { vulnerabilitiesModule } from './vulnerabilities.js';
import { healthModule } from './health.js';
import { observabilityModule } from './observability.js';
import { reportingModule } from './reporting.js';
import { continuityModule } from './continuity.js';

/**
 * The complete map of workspace id → module factory. The server registers ONLY the
 * subset listed in the deployment config, so disabled workspaces have no live routes.
 */
export const MODULES: Record<WorkspaceId, WorkspaceModule> = {
  delivery: deliveryModule,
  vulnerabilities: vulnerabilitiesModule,
  health: healthModule,
  observability: observabilityModule,
  reporting: reportingModule,
  continuity: continuityModule,
};

export type { ModuleContext, WorkspaceModule } from './types.js';
