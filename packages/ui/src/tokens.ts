// Editorial design tokens, shared with the site/demo. Mirrors tokens.css so TS code can
// reference the same values.
export const tokens = {
  color: {
    paper: '#FBFAF7', // warm paper background
    ink: '#1C1C1A',
    marine: '#16485A', // primary
    sienna: '#C2703D', // warn / severity accent
    line: '#E7E2D9',
    muted: '#6B6B63',
  },
  font: {
    display: "'Fraunces', Georgia, serif",
    ui: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
} as const;

export type Tokens = typeof tokens;
