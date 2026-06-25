import type { Severity } from '@comphub/core';

/**
 * SLA policy: remediation window in **days** per severity. This is configuration, not
 * hardcoded business logic — a deployment may edit these values freely.
 */
export type SlaPolicy = Record<Severity, number>;

/** Editable defaults (30/60/90). Override per deployment via the config store. */
export const DEFAULT_SLA_POLICY: SlaPolicy = {
  critical: 30,
  high: 60,
  medium: 90,
  low: 90,
};
