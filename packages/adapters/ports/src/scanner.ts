import type { Severity } from '@comphub/core';

// Scanner provider port — the Vulnerabilities workspace's data source.

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  /** Affected asset/service, e.g. 'payments-api'. */
  asset: string;
  /** ISO-8601 timestamp the finding was first discovered (starts the SLA clock). */
  discoveredAt: string;
  status: 'open' | 'remediated';
}

export interface ScannerProvider {
  readonly id: string;
  listFindings(): Promise<Finding[]>;
}
