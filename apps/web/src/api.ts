import type { WorkspaceId } from '@comphub/core';

// Empty base ('') in dev → relative '/api', proxied to the api by Vite.
// In Docker the build bakes VITE_COMPHUB_API_URL=http://localhost:4000 (host-published).
const API_BASE = import.meta.env.VITE_COMPHUB_API_URL ?? '';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

export interface DeploymentInfo {
  mode: string;
  workspaces: WorkspaceId[];
  providers: { pm: string; scanner: string; scm: string };
}

export interface MeWorkspaces {
  userId: string;
  workspaces: WorkspaceId[];
}

export const fetchConfig = () => get<DeploymentInfo>('/api/config');
export const fetchMyWorkspaces = () => get<MeWorkspaces>('/api/me/workspaces');
