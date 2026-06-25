import { Router } from 'express';
import type { WorkspaceId } from '@comphub/core';
import type { ModuleContext, WorkspaceModule } from './types.js';

/**
 * A placeholder workspace module: an info route confirming the module is wired and
 * mounted. Real workspace logic replaces these one issue at a time (Delivery next).
 */
export function stubModule(id: WorkspaceId): WorkspaceModule {
  return (ctx: ModuleContext): Router => {
    const router = Router();
    router.get('/', (_req, res) => {
      res.json({ workspace: id, status: 'ready', mode: ctx.config.mode });
    });
    return router;
  };
}
