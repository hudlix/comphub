import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { WorkspaceId } from '@comphub/core';

// Each entry is a static dynamic-import so Vite emits a separate lazy-loaded chunk per
// workspace. A workspace this deployment doesn't ship is never imported, so its code
// never reaches the browser.
export const workspaceChunks: Record<
  WorkspaceId,
  LazyExoticComponent<ComponentType>
> = {
  delivery: lazy(() => import('./modules/delivery.js')),
  vulnerabilities: lazy(() => import('./modules/vulnerabilities.js')),
  health: lazy(() => import('./modules/health.js')),
  observability: lazy(() => import('./modules/observability.js')),
  reporting: lazy(() => import('./modules/reporting.js')),
  continuity: lazy(() => import('./modules/continuity.js')),
};
