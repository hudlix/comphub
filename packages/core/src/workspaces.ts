// The canonical set of enableable workspaces. Launcher + Settings are the shared shell,
// NOT workspaces, so they are deliberately absent here.
export type WorkspaceId =
  | 'delivery'
  | 'vulnerabilities'
  | 'health'
  | 'observability'
  | 'reporting'
  | 'continuity';

export interface WorkspaceMeta {
  id: WorkspaceId;
  /** Display name in the launcher. */
  title: string;
  /** One-line description shown on the launcher card. */
  tagline: string;
}

export const WORKSPACES: readonly WorkspaceMeta[] = [
  {
    id: 'delivery',
    title: 'Delivery',
    tagline: 'Epic → Story → Task with a derived lifecycle stage.',
  },
  {
    id: 'vulnerabilities',
    title: 'Vulnerabilities',
    tagline: 'Scanner findings on a remediation SLA clock.',
  },
  {
    id: 'health',
    title: 'Health',
    tagline: 'Uptime, latency, and incident posture.',
  },
  {
    id: 'observability',
    title: 'Observability',
    tagline: 'Behavioral checks and alert reliability.',
  },
  {
    id: 'reporting',
    title: 'Reporting',
    tagline: 'Cross-workspace roll-ups.',
  },
  {
    id: 'continuity',
    title: 'Continuity',
    tagline: 'Per-repo committed AI session memory.',
  },
] as const;

export const WORKSPACE_IDS: readonly WorkspaceId[] = WORKSPACES.map((w) => w.id);

export function isWorkspaceId(value: string): value is WorkspaceId {
  return (WORKSPACE_IDS as readonly string[]).includes(value);
}

export function workspaceMeta(id: WorkspaceId): WorkspaceMeta {
  const meta = WORKSPACES.find((w) => w.id === id);
  if (!meta) throw new Error(`Unknown workspace: ${id}`);
  return meta;
}
