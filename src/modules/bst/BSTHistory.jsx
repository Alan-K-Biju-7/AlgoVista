export default function BSTHistory({ history }) {
  const iconMap = {
    insert:    { icon: '+', color: '#34d399', bg: '#052e16' },
    delete:    { icon: '−', color: '#f87171', bg: '#450a0a' },
    search:    { icon: '?', color: '#60a5fa', bg: '#1e3a5f' },
    traversal: { icon: '~', color: '#a78bfa', bg: '#2e1065' },
    reset:     { icon: '↺', color: 'var(--text-secondary)', bg: 'var(--bg-elevated)' },
  };

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
        Recent steps
      </p>
      {history.length === 0 ? (
        <p style={{ fontSize: '0.78rem', color: 'var(--border-default)' }}>Operations will appear here as you interact with the tree.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '180px', overflowY: 'auto' }}>
          {history.map((item) => {
            const s = iconMap[item.type] || iconMap.reset;
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '4px', background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
                <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
