export default function DijkstraPathPanel({ shortestPath, dist, startId, endId, isDone }) {
  const totalCost = dist && endId && dist[endId] !== Infinity ? dist[endId] : null;
  const unreachable = isDone && dist && endId && dist[endId] === Infinity;

  return (
    <div style={{
      background: shortestPath.length > 1 ? 'rgba(0,212,170,0.04)' : 'var(--bg-card)',
      border: shortestPath.length > 1 ? '1px solid rgba(0,212,170,0.25)' : '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)', padding: '1.1rem',
      transition: 'all 0.4s',
    }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
        Shortest path  {startId && endId ? `${startId} → ${endId}` : ''}
      </p>

      {unreachable ? (
        <p style={{ fontSize: '0.82rem', color: '#f87171' }}>No path exists — {endId} is unreachable from {startId}.</p>
      ) : shortestPath.length <= 1 ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
          {isDone ? 'Select a destination node in the controls to see its shortest path.' : 'Run the algorithm to compute shortest paths.'}
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            {shortestPath.map((id, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{
                  padding: '0.28rem 0.7rem', borderRadius: '0.4rem',
                  background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.35)',
                  fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent)',
                  fontFamily: 'monospace',
                  boxShadow: '0 0 8px rgba(0,212,170,0.15)',
                }}>{id}</span>
                {i < shortestPath.length - 1 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>→</span>
                )}
              </span>
            ))}
          </div>

          {totalCost !== null && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.45rem 0.85rem', borderRadius: '0.5rem', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.1rem' }}>Total cost</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent)', letterSpacing: '-0.03em' }}>{totalCost}</p>
              </div>
              <div style={{ padding: '0.45rem 0.85rem', borderRadius: '0.5rem', background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.2)' }}>
                <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.1rem' }}>Hops</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#4a9eff', letterSpacing: '-0.03em' }}>{shortestPath.length - 1}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
