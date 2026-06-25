export interface WorkspaceCardProps {
  title: string;
  tagline: string;
  onOpen?: () => void;
}

export function WorkspaceCard({ title, tagline, onOpen }: WorkspaceCardProps) {
  return (
    <button
      onClick={onOpen}
      style={{
        display: 'block',
        textAlign: 'left',
        cursor: onOpen ? 'pointer' : 'default',
        background: '#fff',
        border: '1px solid var(--color-line)',
        borderRadius: 'var(--radius)',
        padding: 18,
        font: 'inherit',
        width: '100%',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--color-marine)',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.4 }}>
        {tagline}
      </div>
    </button>
  );
}
