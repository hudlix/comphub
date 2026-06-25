import type { Finding, ScannerProvider } from '@comphub/adapters-ports';

// Deterministic findings with fixed discovery dates (no clock reads) so the SLA-clock
// view is reproducible. Assets use the neutral demo service names.
const FINDINGS: Finding[] = [
  {
    id: 'finding-1',
    title: 'Outdated TLS cipher suite',
    severity: 'critical',
    asset: 'payments-api',
    discoveredAt: '2026-04-20T00:00:00.000Z',
    status: 'open',
  },
  {
    id: 'finding-2',
    title: 'Dependency with known CVE',
    severity: 'high',
    asset: 'checkout-service',
    discoveredAt: '2026-05-10T00:00:00.000Z',
    status: 'open',
  },
  {
    id: 'finding-3',
    title: 'Missing security header',
    severity: 'medium',
    asset: 'web-storefront',
    discoveredAt: '2026-05-28T00:00:00.000Z',
    status: 'open',
  },
  {
    id: 'finding-4',
    title: 'Verbose error stack in response',
    severity: 'low',
    asset: 'web-storefront',
    discoveredAt: '2026-06-01T00:00:00.000Z',
    status: 'remediated',
  },
];

export class MockScannerProvider implements ScannerProvider {
  readonly id = 'mock';

  async listFindings(): Promise<Finding[]> {
    return FINDINGS;
  }
}
