import { useNavigate } from 'react-router-dom';
import { WorkspaceCard } from '@comphub/ui';
import { WORKSPACES, type WorkspaceId } from '@comphub/core';

export function Launcher({ workspaces }: { workspaces: WorkspaceId[] }) {
  const navigate = useNavigate();
  const mounted = WORKSPACES.filter((w) => workspaces.includes(w.id));

  return (
    <section>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-marine)' }}>
        Your workspaces
      </h1>
      {mounted.length === 0 && (
        <p style={{ color: 'var(--color-muted)' }}>No workspaces are enabled for you.</p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {mounted.map((w) => (
          <WorkspaceCard
            key={w.id}
            title={w.title}
            tagline={w.tagline}
            onOpen={() => navigate(`/w/${w.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
