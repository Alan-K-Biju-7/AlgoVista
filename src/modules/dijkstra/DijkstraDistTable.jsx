const INF = Infinity;

export default function DijkstraDistTable({ nodes, dist, prev, visited, current, startId, shortestPath }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.7rem' }}>Distance table</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem 0.5rem', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
        {['Node', 'dist[ ]', 'prev[ ]', 'State'].map((h) => (
          <span key={h} style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
        ))}

        {nodes.map((n) => {
          const d = dist ? dist[n.id] : INF;
          const p = prev ? prev[n.id] : null;
          const isVisited  = visited && visited.includes(n.id);
          const isCurrent  = n.id === current;
          const inPath     = shortestPath && shortestPath.includes(n.id) && shortestPath.length > 1;
          const nodeColor  = inPath    ? 'var(--accent)'
                           : isCurrent ? '#c4b5fd'
                           : isVisited ? '#34d399'
                           : 'var(--text-secondary)';

          return [
            <span key={n.id+'n'} style={{ color: nodeColor, fontWeight: '700', fontFamily: 'monospace', transition: 'color 0.3s' }}>{n.id}</span>,
            <span key={n.id+'d'} style={{ color: d === INF ? 'var(--text-faint)' : nodeColor, fontFamily: 'monospace', fontWeight: d === INF ? '400' : '700', transition: 'color 0.3s' }}>
              {d === INF ? '∞' : d}
            </span>,
            <span key={n.id+'p'} style={{ color: p ? 'var(--text-secondary)' : 'var(--text-faint)', fontFamily: 'monospace' }}>
              {p || '—'}
            </span>,
            <span key={n.id+'s'} style={{ fontSize: '0.62rem', fontWeight: '700',
              color: inPath ? 'var(--accent)' : isCurrent ? '#a78bfa' : isVisited ? '#34d399' : 'var(--text-faint)' }}>
              {inPath ? 'PATH' : isCurrent ? 'CURR' : isVisited ? 'DONE' : 'WAIT'}
            </span>,
          ];
        })}
      </div>

      <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {[
          { c: 'var(--accent)', t: 'Shortest path' },
          { c: '#a78bfa',       t: 'Current node' },
          { c: '#34d399',       t: 'Settled' },
          { c: 'var(--text-faint)', t: 'Unvisited' },
        ].map((l) => (
          <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.c, flexShrink: 0 }} />{l.t}
          </span>
        ))}
      </div>
    </div>
  );
}
