const rotationDiagrams = {
  LL: {
    label: 'LL — Right Rotation',
    color: '#a78bfa',
    before: '    z          y\n   /          / \\\n  y    →     x   z\n /\nx',
    why: 'Left subtree is too tall (bf > 1) and left child is left-heavy or balanced. A single right rotation at z fixes it.',
  },
  RR: {
    label: 'RR — Left Rotation',
    color: '#f472b6',
    before: '  z              y\n   \\            / \\\n    y    →     z   x\n     \\\nx',
    why: 'Right subtree is too tall (bf < −1) and right child is right-heavy or balanced. A single left rotation at z fixes it.',
  },
  LR: {
    label: 'LR — Left-Right Double Rotation',
    color: '#fbbf24',
    before: '  z           z           x\n /           /           / \\\n y    →     x    →      y   z\n  \\        /\n   x      y',
    why: 'Left subtree is too tall and left child is right-heavy. First rotate left on the left child, then rotate right on z.',
  },
  RL: {
    label: 'RL — Right-Left Double Rotation',
    color: '#34d399',
    before: '  z         z             x\n   \\         \\           / \\\n    y  →      x    →    z   y\n   /           \\\n  x             y',
    why: 'Right subtree is too tall and right child is left-heavy. First rotate right on the right child, then rotate left on z.',
  },
};

export default function AVLRotationPanel({ lastRotation }) {
  if (!lastRotation) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.1rem' }}>
        <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Last rotation</p>
        <p style={{ fontSize: '0.78rem', color: 'var(--border-default)' }}>No rotation yet — insert values to trigger one.</p>
      </div>
    );
  }

  const d = rotationDiagrams[lastRotation.type];

  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${d.color}44`, borderRadius: 'var(--radius-lg)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Last rotation</p>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.7rem', borderRadius: '999px', background: `${d.color}18`, border: `1px solid ${d.color}55`, marginBottom: '0.75rem' }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: d.color, display: 'inline-block' }} />
        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: d.color }}>{d.label}</span>
      </div>

      <pre style={{ fontFamily: 'SF Mono, Fira Code, monospace', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.9, background: 'var(--bg-elevated)', borderRadius: '0.4rem', padding: '0.6rem 0.75rem', marginBottom: '0.65rem', overflowX: 'auto', whiteSpace: 'pre' }}>
        {d.before}
      </pre>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{d.why}</p>

      <p style={{ fontSize: '0.73rem', color: d.color, marginTop: '0.5rem', fontStyle: 'italic' }}>
        Pivot node: <strong>{lastRotation.pivot}</strong>
      </p>
    </div>
  );
}
