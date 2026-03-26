const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

export default function GraphAdjList({ nodes, adjList, visitedArr, frontierArr, algorithm, stepIndex }) {
  const hasStep = stepIndex >= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>Adjacency list</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {nodes.map((n) => (
            <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.3rem 0.5rem', borderRadius: '0.35rem', background: visitedArr.includes(n.id) ? 'rgba(0,212,170,0.06)' : 'transparent', transition: 'background 0.3s' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: visitedArr.includes(n.id) ? 'rgba(0,212,170,0.15)' : 'var(--bg-elevated)', border: `1px solid ${visitedArr.includes(n.id) ? 'var(--accent)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', color: visitedArr.includes(n.id) ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0, transition: 'all 0.3s' }}>{n.id}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>→</span>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {(adjList[n.id] || []).map((nb) => (
                  <span key={nb} style={{ padding: '0.1rem 0.4rem', borderRadius: '0.25rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{nb}</span>
                ))}
                {(adjList[n.id] || []).length === 0 && <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>no neighbors</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasStep && (
        <div style={card}>
          <p style={lbl}>{algorithm === 'BFS' ? 'Queue (FIFO)' : 'Stack (LIFO)'}</p>
          {frontierArr.length === 0 ? (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Empty</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
              {algorithm === 'BFS' && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>front →</span>}
              {algorithm === 'DFS' && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>top →</span>}
              {frontierArr.map((id, i) => (
                <span key={i} style={{ padding: '0.22rem 0.6rem', borderRadius: '0.35rem', background: 'rgba(255,209,102,0.12)', border: '1px solid rgba(255,209,102,0.35)', fontSize: '0.8rem', fontWeight: '700', color: '#ffd166', fontFamily: 'monospace' }}>{id}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {hasStep && visitedArr.length > 0 && (
        <div style={card}>
          <p style={lbl}>Visited order</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
            {visitedArr.map((id, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span style={{ padding: '0.22rem 0.6rem', borderRadius: '0.35rem', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', fontFamily: 'monospace' }}>{id}</span>
                {i < visitedArr.length - 1 && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
