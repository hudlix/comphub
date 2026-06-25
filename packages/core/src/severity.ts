// Shared severity domain primitive. Lives in core so both the scanner port and the
// SLA policy reference one definition (no duplication, vendor-neutral).
export type Severity = 'critical' | 'high' | 'medium' | 'low';

export const SEVERITIES: readonly Severity[] = [
  'critical',
  'high',
  'medium',
  'low',
] as const;

export function isSeverity(value: string): value is Severity {
  return (SEVERITIES as readonly string[]).includes(value);
}
