import type { DeploymentConfig } from '@comphub/core';
import type {
  PmProvider,
  ScannerProvider,
  ScmProvider,
} from '@comphub/adapters-ports';
import {
  MockPmProvider,
  MockScannerProvider,
  MockScmProvider,
} from '@comphub/adapters-mock';

// Adapter registry. Each port has a table of factories keyed by adapter id. Real
// adapters (Jira, GitHub, a scanner) add an entry here later; selecting one is a
// config-only change to DeploymentConfig.providers. `mock` is always registered and is
// the default fallback, so the app resolves with zero credentials.

type Factory<T> = () => T;

const DEFAULT_ID = 'mock';

const pmAdapters: Record<string, Factory<PmProvider>> = {
  mock: () => new MockPmProvider(),
};

const scannerAdapters: Record<string, Factory<ScannerProvider>> = {
  mock: () => new MockScannerProvider(),
};

const scmAdapters: Record<string, Factory<ScmProvider>> = {
  mock: () => new MockScmProvider(),
};

export interface Providers {
  pm: PmProvider;
  scanner: ScannerProvider;
  scm: ScmProvider;
}

function pick<T>(table: Record<string, Factory<T>>, id: string, port: string): T {
  const factory = table[id];
  if (factory) return factory();
  // Unknown id → fall back to mock so the app always boots.
  console.warn(
    `[adapters] no '${port}' adapter registered for id '${id}'; using '${DEFAULT_ID}'.`,
  );
  return table[DEFAULT_ID]!();
}

/** Resolve the concrete providers for a deployment config. */
export function resolveProviders(config: DeploymentConfig): Providers {
  return {
    pm: pick(pmAdapters, config.providers.pm, 'pm'),
    scanner: pick(scannerAdapters, config.providers.scanner, 'scanner'),
    scm: pick(scmAdapters, config.providers.scm, 'scm'),
  };
}
