export default function DijkstraPQView({ pqSnapshot = [], current }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
        Min-Priority Queue
      </p>

      {pqSnapshot.length === 0 ? (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>PQ is empty — algorithm complete.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {pqSnapshot.map((item, i) => (
            <div key={`${item.id}-${item.dist}-${i}`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.35rem 0.65rem', borderRadius: '0.4rem',
              background: i === 0 ? 'rgba(139,124,248,0.1)' : 'var(--bg-elevated)',
              border: i === 0 ? '1px solid rgba(139,124,248,0.3)' : '1px solid var(--border-default)',
              transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {i === 0 && (
                  <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>MIN</span>
                )}
                <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.82rem', color: i === 0 ? '#c4b5fd' : 'var(--text-secondary)' }}>
                  {item.id}
                </span>
              </div>
              <span style={{
                padding: '0.12rem 0.5rem', borderRadius: '999px',
                background: i === 0 ? 'rgba(139,124,248,0.15)' : 'var(--bg-card)',
                border: i === 0 ? '1px solid rgba(139,124,248,0.3)' : '1px solid var(--border-strong)',
                fontSize: '0.78rem', fontWeight: '700', fontFamily: 'monospace',
                color: i === 0 ? '#c4b5fd' : 'var(--text-muted)',
              }}>
                {item.dist === Infinity ? '∞' : item.dist}
              </span>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: '0.68rem', color: 'var(--text-faint)', marginTop: '0.6rem', lineHeight: 1.5 }}>
        Sorted by distance. MIN is always popped next.
      </p>
    </div>
  );
}
