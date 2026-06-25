import type { WorkspaceId } from './workspaces.js';

// Two enablement layers (see CLAUDE.md):
//
//   1. Per-deployment — config decides which workspaces *ship* in this deployment.
//      Disabled workspaces don't register API modules and don't ship UI chunks.
//
//   2. Per-user — of the shipped workspaces, which is a given user *assigned*.
//      The shell mounts only those.

/** Per-deployment: the set of workspaces compiled/registered into this deployment. */
export interface DeploymentEnablement {
  enabled: readonly WorkspaceId[];
}

/** Per-user: which of the deployment's enabled workspaces this user may see. */
export interface UserEnablement {
  userId: string;
  assigned: readonly WorkspaceId[];
}

/**
 * The effective workspaces a user actually gets: the intersection of what the
 * deployment ships and what the user is assigned. Per-deployment always wins — a user
 * can never be granted a workspace the deployment didn't ship.
 */
export function effectiveWorkspaces(
  deployment: DeploymentEnablement,
  user: UserEnablement,
): WorkspaceId[] {
  const shipped = new Set(deployment.enabled);
  return user.assigned.filter((id) => shipped.has(id));
}
