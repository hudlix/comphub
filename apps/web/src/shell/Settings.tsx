import { Link } from 'react-router-dom';
import type { WorkspaceId } from '@comphub/core';
import type { DeploymentInfo } from '../api.js';

const mono = { fontFamily: 'var(--font-mono)', fontSize: 13 } as const;

export function Settings({
  config,
  assigned,
}: {
  config: DeploymentInfo;
  assigned: WorkspaceId[];
}) {
  return (
    <section>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-marine)' }}>
        Settings
      </h1>

      <h3>Deployment</h3>
      <p style={mono}>mode: {config.mode}</p>
      <p style={mono}>shipped: {config.workspaces.join(', ') || '(none)'}</p>
      <p style={mono}>
        providers: pm={config.providers.pm}, scanner={config.providers.scanner}, scm=
        {config.providers.scm}
      </p>

      <h3>You</h3>
      <p style={mono}>assigned: {assigned.join(', ') || '(none)'}</p>

      <p style={{ marginTop: 24 }}>
        <Link to="/" style={{ color: 'var(--color-marine)' }}>
          ← Back to launcher
        </Link>
      </p>
    </section>
  );
}
