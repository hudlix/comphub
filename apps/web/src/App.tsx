import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { TopBar } from '@comphub/ui';
import type { WorkspaceId } from '@comphub/core';
import { fetchConfig, fetchMyWorkspaces, type DeploymentInfo } from './api.js';
import { Launcher } from './shell/Launcher.js';
import { Settings } from './shell/Settings.js';
import { WorkspaceRoute } from './workspaces/WorkspaceRoute.js';

export function App() {
  const [config, setConfig] = useState<DeploymentInfo | null>(null);
  const [assigned, setAssigned] = useState<WorkspaceId[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchConfig(), fetchMyWorkspaces()])
      .then(([c, me]) => {
        setConfig(c);
        setAssigned(me.workspaces);
      })
      .catch((e: unknown) => setError(String(e)));
  }, []);

  const settingsLink = (
    <Link
      to="/settings"
      style={{ color: 'var(--color-marine)', textDecoration: 'none', fontSize: 14 }}
    >
      Settings
    </Link>
  );

  return (
    <>
      <TopBar mock={config?.mode === 'mock'} actions={settingsLink} />
      <main style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
        {error && (
          <p style={{ color: 'var(--color-sienna)' }}>Could not reach the API: {error}</p>
        )}
        {!error && (!config || !assigned) && <p>Loading…</p>}
        {config && assigned && (
          <Routes>
            <Route path="/" element={<Launcher workspaces={assigned} />} />
            <Route
              path="/settings"
              element={<Settings config={config} assigned={assigned} />}
            />
            <Route path="/w/:id" element={<WorkspaceRoute assigned={assigned} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </>
  );
}
