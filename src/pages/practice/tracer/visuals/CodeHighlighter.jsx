export default function CodeHighlighter({ code, activeLine, topicColor }) {
  if (!code) return null;
  const lines = code.split('\n');
  return (
    <div style={{ borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-default)', background: '#1e1e1e', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.6' }}>
      <div style={{ padding: '0.4rem 0.75rem', background: '#252526', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Execution trace</span>
        {activeLine !== null && (
          <span style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: topicColor + '25', color: topicColor, fontWeight: '700' }}>
            Line {activeLine + 1}
          </span>
        )}
      </div>
      <div style={{ overflowY: 'auto', maxHeight: '220px' }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'stretch',
            background: i === activeLine ? topicColor + '18' : 'transparent',
            borderLeft: `3px solid ${i === activeLine ? topicColor : 'transparent'}`,
            transition: 'background 0.2s, border-color 0.2s',
          }}>
            <span style={{ minWidth: '32px', padding: '0 0.5rem', textAlign: 'right', color: i === activeLine ? topicColor : '#555', fontSize: '0.72rem', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {i + 1}
            </span>
            <span style={{ padding: '0 0.75rem', color: i === activeLine ? '#fff' : '#aaa', whiteSpace: 'pre', flex: 1 }}>
              {line || ' '}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
