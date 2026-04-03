export default function BellmanFordNegCycleAlert({ negCycleEdges, edges, isDone }) {
  if (!isDone) return null;

  if (negCycleEdges.length === 0) {
    return (
      <div style={{
        padding: '0.75rem 1rem', borderRadius: 'var(--radius-xl)',
        background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)',
        display: 'flex', alignItems: 'center', gap: '0.65rem',
      }}>
        <span style={{ fontSize: '1.1rem' }}>✓</span>
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)' }}>No negative cycle detected</p>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>All shortest paths are valid. Distances are optimal and stable.</p>
        </div>
      </div>
    );
  }

  const cycleEdgeDetails = negCycleEdges.map((eid) => edges.find((e) => e.id === eid)).filter(Boolean);

  return (
    <div style={{
      padding: '0.85rem 1rem', borderRadius: 'var(--radius-xl)',
      background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)',
      boxShadow: '0 0 20px rgba(239,68,68,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.1rem' }}>⚠</span>
        <p style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ef4444' }}>Negative cycle detected!</p>
      </div>
      <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '0.6rem' }}>
        After V−1 iterations, {cycleEdgeDetails.length} edge{cycleEdgeDetails.length > 1 ? 's' : ''} still
        relaxe{cycleEdgeDetails.length === 1 ? 's' : ''} — meaning you can loop the cycle infinitely to reduce distances.
        Shortest paths are <strong style={{ color: '#f87171' }}>undefined</strong> for nodes reachable through it.
      </p>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {cycleEdgeDetails.map((e) => (
          <span key={e.id} style={{
            padding: '0.22rem 0.55rem', borderRadius: '0.35rem',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            fontSize: '0.76rem', fontWeight: '700', color: '#fca5a5', fontFamily: 'monospace',
          }}>
            {e.from}→{e.to} (w={e.weight})
          </span>
        ))}
      </div>
    </div>
  );
}
