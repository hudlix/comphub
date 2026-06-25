import { Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { isWorkspaceId, type WorkspaceId } from '@comphub/core';
import { workspaceChunks } from './registry.js';

/** Mounts a workspace chunk only if the id is valid AND assigned to the user. */
export function WorkspaceRoute({ assigned }: { assigned: WorkspaceId[] }) {
  const { id } = useParams();
  if (!id || !isWorkspaceId(id) || !assigned.includes(id)) {
    return <Navigate to="/" replace />;
  }
  const Chunk = workspaceChunks[id];
  return (
    <Suspense fallback={<p>Loading workspace…</p>}>
      <Chunk />
    </Suspense>
  );
}
