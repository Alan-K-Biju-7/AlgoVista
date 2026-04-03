const INF = Infinity;

export default function BellmanFordDistPanel({ nodes, dist, prev, shortestPath, negCycleEdges, isDone }) {
  const negCycleNodes = new Set();
  negCycleEdges.forEach((eid) => {
    // We pass nodes+edges to resolve, but edgeId → from/to is done in parent; we receive negCycleNodes as prop
  });

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>Distance table</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem 0.5rem', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
        {['Node', 'dist[ ]', 'prev[ ]'].map((h) => (
          <span key={h} style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
        ))}

        {nodes.map((n) => {
          const d = dist ? dist[n.id] : INF;
          const p = prev ? prev[n.id] : null;
          const inPath  = shortestPath.includes(n.id) && shortestPath.length > 1;
          const nodeClr = inPath ? 'var(--accent)' : d !== undefined && d !== INF ? '#34d399' : 'var(--text-muted)';
          return [
            <span key={n.id+'n'} style={{ color: nodeClr, fontWeight: '700', fontFamily: 'monospace', transition: 'color 0.3s' }}>{n.id}</span>,
            <span key={n.id+'d'} style={{ color: d === INF ? 'var(--text-faint)' : d < 0 ? '#f87171' : nodeClr, fontFamily: 'monospace', fontWeight: d === INF ? '400' : '700', transition: 'color 0.3s' }}>
              {d === INF ? '∞' : d}
            </span>,
            <span key={n.id+'p'} style={{ color: p ? 'var(--text-secondary)' : 'var(--text-faint)', fontFamily: 'monospace' }}>{p || '—'}</span>,
          ];
        })}
      </div>

      <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {[
          { c: 'var(--accent)', t: 'Shortest path' },
          { c: '#34d399',       t: 'Settled' },
          { c: '#f87171',       t: 'Negative dist' },
          { c: 'var(--text-faint)', t: 'Unreachable' },
        ].map((l) => (
          <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.c, flexShrink: 0 }} />{l.t}
          </span>
        ))}
      </div>
    </div>
  );
}
