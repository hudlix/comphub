import type { ReactNode } from 'react';
import { MockBadge } from './MockBadge.js';

export interface TopBarProps {
  /** Whether the deployment is running on mock adapters. */
  mock?: boolean;
  /** Right-aligned content (e.g. Settings link, user menu). */
  actions?: ReactNode;
}

export function TopBar({ mock = false, actions }: TopBarProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 24px',
        borderBottom: '1px solid var(--color-line)',
        background: 'var(--color-paper)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--color-marine)',
        }}
      >
        CompHub
      </span>
      {mock && <MockBadge />}
      <span style={{ flex: 1 }} />
      {actions}
    </header>
  );
}
