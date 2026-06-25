import type { DeploymentConfig, WorkspaceId } from '@comphub/core';
import { effectiveWorkspaces } from '@comphub/core';
import type { Store } from './store/index.js';

/**
 * The workspaces a user actually sees: their assignment intersected with what the
 * deployment ships. With no stored assignment, a user defaults to every shipped
 * workspace (stub policy; real RBAC slots in here later).
 */
export function userWorkspaces(
  store: Store,
  config: DeploymentConfig,
  userId: string,
): WorkspaceId[] {
  const assigned = store.getUserAssignments(userId) ?? [...config.workspaces];
  return effectiveWorkspaces({ enabled: config.workspaces }, { userId, assigned });
}
