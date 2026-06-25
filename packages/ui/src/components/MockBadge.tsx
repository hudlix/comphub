// Mock-mode badge shown in the shared top bar whenever the deployment runs on mock
// adapters (the zero-credential default).
export function MockBadge() {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: 'var(--color-sienna)',
        border: '1px solid var(--color-sienna)',
        borderRadius: 999,
        padding: '2px 8px',
      }}
      title="Running on mock adapters — no credentials required"
    >
      Mock mode
    </span>
  );
}
