export function HashMapTracer({ snapshot }) {
  if (!snapshot || snapshot.type !== 'hashmap') return null;
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        {snapshot.label}
      </p>
      {snapshot.entries.length === 0 ? (
        <div style={{ padding: '0.5rem 0.75rem', borderRadius: '0.4rem', border: '1px dashed var(--border-default)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          empty
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {snapshot.entries.map((e, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0',
              borderRadius: '0.4rem', overflow: 'hidden',
              border: `1px solid ${e.role === 'hit' ? '#00d4aa' : e.role === 'new' ? '#f5a623' : 'var(--border-default)'}`,
              boxShadow: e.role ? `0 0 8px ${e.role === 'hit' ? '#00d4aa44' : '#f5a62344'}` : 'none',
              transition: 'all 0.2s',
            }}>
              <div style={{ padding: '0.3rem 0.55rem', background: 'var(--bg-card)', fontSize: '0.78rem', fontFamily: 'monospace', color: e.role === 'hit' ? '#00d4aa' : 'var(--text-muted)', fontWeight: '600', borderRight: '1px solid var(--border-default)' }}>
                {e.key}
              </div>
              <div style={{ padding: '0.3rem 0.55rem', background: 'var(--bg-card)', fontSize: '0.78rem', fontFamily: 'monospace', color: e.role === 'hit' ? '#00d4aa' : 'var(--text-primary)', fontWeight: '700' }}>
                {e.val}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StackTracer({ snapshot }) {
  if (!snapshot || snapshot.type !== 'stack') return null;
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        {snapshot.label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxWidth: '160px' }}>
        {snapshot.items.length === 0 ? (
          <div style={{ padding: '0.4rem 0.75rem', borderRadius: '0.35rem', border: '1px dashed var(--border-default)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>empty</div>
        ) : (
          snapshot.items.map((item, i) => (
            <div key={i} style={{
              padding: '0.35rem 0.75rem', borderRadius: '0.35rem',
              background: item.isTop ? '#00d4aa18' : 'var(--bg-card)',
              border: `1px solid ${item.isTop ? '#00d4aa' : 'var(--border-default)'}`,
              fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: item.isTop ? '700' : '400',
              color: item.isTop ? '#00d4aa' : 'var(--text-primary)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.2s',
            }}>
              <span>{item.val}</span>
              {item.isTop && <span style={{ fontSize: '0.58rem', color: '#00d4aa', fontWeight: '700' }}>TOP</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
