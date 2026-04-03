const INF = Infinity;

export default function BellmanFordIterTable({ nodes, iterHistory, currentIter, shortestPath, negCycleEdges }) {
  const maxIter = iterHistory.length;
  if (maxIter === 0 || nodes.length === 0) return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Iteration table</p>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>Run the algorithm to see per-iteration distances.</p>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem', overflowX: 'auto' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.7rem' }}>
        V−1 Iteration table
        {negCycleEdges.length > 0 && (
          <span style={{ marginLeft: '0.6rem', color: '#ef4444', fontSize: '0.65rem', fontWeight: '800' }}>⚠ NEG CYCLE</span>
        )}
      </p>

      <table style={{ minWidth: `${nodes.length * 72 + 80}px`, fontSize: '0.72rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.62rem', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>Iter</th>
            {nodes.map((n) => (
              <th key={n.id} style={{
                textAlign: 'center', padding: '0.25rem 0.5rem',
                color: shortestPath.includes(n.id) && shortestPath.length > 1 ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: '700', fontSize: '0.68rem', fontFamily: 'monospace',
                borderBottom: '1px solid var(--border-subtle)', minWidth: '52px',
              }}>{n.id}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {iterHistory.map((snapshot, rowIdx) => {
            const isCurrentRow = rowIdx === currentIter - 1;
            return (
              <tr key={rowIdx} style={{
                background: isCurrentRow ? 'rgba(139,124,248,0.07)' : 'transparent',
                transition: 'background 0.3s',
              }}>
                <td style={{ padding: '0.25rem 0.5rem', color: isCurrentRow ? '#c4b5fd' : 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '700', fontSize: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' }}>
                  {rowIdx === 0 ? 'Init' : `i=${rowIdx}`}
                  {isCurrentRow && <span style={{ marginLeft: '0.3rem', color: '#8b7cf8', fontSize: '0.6rem' }}>◀</span>}
                </td>
                {nodes.map((n) => {
                  const prev = rowIdx > 0 ? iterHistory[rowIdx - 1][n.id] : INF;
                  const cur  = snapshot[n.id];
                  const changed = cur !== prev && rowIdx > 0;
                  const inPath  = shortestPath.includes(n.id) && shortestPath.length > 1;
                  return (
                    <td key={n.id} style={{
                      textAlign: 'center', padding: '0.25rem 0.5rem',
                      fontFamily: 'monospace', fontWeight: changed || inPath ? '800' : '400', fontSize: '0.72rem',
                      color: inPath && rowIdx === currentIter - 1 ? 'var(--accent)'
                           : changed ? '#ffd166'
                           : cur === INF ? 'var(--text-faint)' : 'var(--text-secondary)',
                      background: changed ? 'rgba(255,209,102,0.07)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      transition: 'color 0.3s, background 0.3s',
                    }}>
                      {cur === INF ? '∞' : cur}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {[
          { c: '#ffd166',       t: 'Updated this iter' },
          { c: 'var(--accent)', t: 'In shortest path' },
          { c: '#c4b5fd',       t: 'Current iteration' },
        ].map((l) => (
          <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: l.c, flexShrink: 0 }} />{l.t}
          </span>
        ))}
      </div>
    </div>
  );
}
