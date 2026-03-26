const iconMap = {
  bfs:     { icon: 'B', color: 'var(--accent)',  bg: 'rgba(0,212,170,0.1)'  },
  dfs:     { icon: 'D', color: '#4a9eff',        bg: 'rgba(74,158,255,0.1)' },
  add:     { icon: '+', color: '#34d399',         bg: '#052e16'              },
  reset:   { icon: '⟳', color: 'var(--text-muted)', bg: 'var(--bg-elevated)'  },
};

export default function GraphHistory({ history }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>Recent operations</p>
      {history.length === 0 ? (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>Operations appear here as you run algorithms.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '180px', overflowY: 'auto' }}>
          {history.map((item) => {
            const s = iconMap[item.type] || iconMap.reset;
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '4px', background: s.bg, color: s.color, fontSize: '0.68rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
