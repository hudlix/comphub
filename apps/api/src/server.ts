import express from 'express';
import cors from 'cors';
import type { DeploymentConfig } from '@comphub/core';
import { resolveProviders } from '@comphub/adapters-registry';
import type { Store } from './store/index.js';
import { currentUserId } from './auth.js';
import { userWorkspaces } from './enablement.js';
import { MODULES } from './modules/index.js';

/** Build the Express app: shared core routes + conditionally-registered workspace modules. */
export function createServer(store: Store, config: DeploymentConfig) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health — hit by the docker-compose healthcheck. Lives at the root, not under /api.
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', mode: config.mode });
  });

  // Read-only view of the per-deployment config.
  app.get('/api/config', (_req, res) => {
    res.json({
      mode: config.mode,
      workspaces: config.workspaces,
      providers: config.providers,
    });
  });

  // Per-user enablement: the workspaces this user is assigned (∩ what's shipped).
  app.get('/api/me/workspaces', (req, res) => {
    const userId = currentUserId(req);
    res.json({ userId, workspaces: userWorkspaces(store, config, userId) });
  });

  // Conditional module registration. Providers are resolved from config (mock default).
  // Only workspaces this deployment ships are mounted — disabled ones have no routes.
  const providers = resolveProviders(config);
  const ctx = { config, providers };
  for (const id of config.workspaces) {
    app.use(`/api/workspaces/${id}`, MODULES[id](ctx));
  }

  return app;
}
