import { Link } from 'react-router-dom';
import { workspaceMeta, type WorkspaceId } from '@comphub/core';

/** Shared placeholder rendered by each lazy-loaded workspace chunk until logic lands. */
export function WorkspacePlaceholder({ id }: { id: WorkspaceId }) {
  const meta = workspaceMeta(id);
  return (
    <section>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-marine)' }}>
        {meta.title}
      </h1>
      <p style={{ color: 'var(--color-muted)' }}>{meta.tagline}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        Module placeholder — logic lands in a later issue.
      </p>
      <p style={{ marginTop: 24 }}>
        <Link to="/" style={{ color: 'var(--color-marine)' }}>
          ← Back to launcher
        </Link>
      </p>
    </section>
  );
}
