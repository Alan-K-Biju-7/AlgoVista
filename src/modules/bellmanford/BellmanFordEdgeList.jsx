const INF = Infinity;

export default function BellmanFordEdgeList({ edges, activeEdge, relaxedEdge, negCycleEdges, iteration, totalIter }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
        Edge list
        {iteration > 0 && (
          <span style={{ marginLeft: '0.5rem', color: iteration > totalIter ? '#ef4444' : '#a5b4fc', fontSize: '0.65rem' }}>
            {iteration > totalIter ? '⚠ neg-cycle check' : `iter ${iteration}`}
          </span>
        )}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', maxHeight: '280px', overflowY: 'auto' }}>
        {edges.map((edge) => {
          const isActive  = edge.id === activeEdge;
          const isRelaxed = edge.id === relaxedEdge;
          const isNegEdge = edge.weight < 0;
          const isCycleEdge = negCycleEdges.includes(edge.id);

          const bg     = isCycleEdge  ? 'rgba(239,68,68,0.08)'
                       : isRelaxed    ? 'rgba(255,209,102,0.08)'
                       : isActive     ? 'rgba(139,124,248,0.08)'
                       : 'var(--bg-elevated)';
          const border = isCycleEdge  ? '1px solid rgba(239,68,68,0.35)'
                       : isRelaxed    ? '1px solid rgba(255,209,102,0.35)'
                       : isActive     ? '1px solid rgba(139,124,248,0.25)'
                       : '1px solid var(--border-default)';

          return (
            <div key={edge.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', background: bg, border, transition: 'all 0.25s' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700', color: isCycleEdge ? '#fca5a5' : isRelaxed ? '#ffd166' : isActive ? '#c4b5fd' : 'var(--text-secondary)' }}>
                {edge.from} → {edge.to}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isCycleEdge && <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: '800', textTransform: 'uppercase' }}>CYCLE</span>}
                {isRelaxed   && <span style={{ fontSize: '0.6rem', color: '#ffd166', fontWeight: '800', textTransform: 'uppercase' }}>RELAXED</span>}
                <span style={{
                  padding: '0.1rem 0.45rem', borderRadius: '999px',
                  background: isNegEdge || isCycleEdge ? 'rgba(248,113,113,0.12)' : 'var(--bg-card)',
                  border: isNegEdge || isCycleEdge ? '1px solid rgba(248,113,113,0.3)' : '1px solid var(--border-strong)',
                  fontSize: '0.75rem', fontWeight: '700', fontFamily: 'monospace',
                  color: isCycleEdge ? '#ef4444' : isNegEdge ? '#f87171' : 'var(--text-muted)',
                }}>
                  {edge.weight > 0 ? `+${edge.weight}` : edge.weight}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
