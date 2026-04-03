const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

export default function BellmanFordInfo({ nodeCount, edgeCount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>How Bellman-Ford works</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Initialize</strong> — dist[source]=0, all others=∞.<br />
          <strong style={{ color: '#ffd166' }}>Relax V−1 times</strong> — for each of the V−1 iterations, scan every edge: if dist[u]+w(u,v) &lt; dist[v], update dist[v].
          After k iterations, shortest paths using at most k edges are correct.<br />
          <strong style={{ color: '#ef4444' }}>Detect negative cycle</strong> — run a V-th iteration. If any edge still relaxes, a negative cycle exists.
        </p>
        <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { c: '#8b7cf8',       t: 'Active edge' },
            { c: '#ffd166',       t: 'Relaxed edge' },
            { c: '#f87171',       t: 'Negative weight' },
            { c: '#ef4444',       t: 'Negative cycle' },
            { c: 'var(--accent)', t: 'Shortest path' },
          ].map((l) => (
            <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: l.c, flexShrink: 0 }} />{l.t}
            </span>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Complexity</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            { op: 'Time',              val: 'O(V × E)',      color: '#ffd166', note: 'V−1 passes × E edges' },
            { op: 'Space',             val: 'O(V)',          color: '#4a9eff', note: 'dist + prev arrays' },
            { op: 'Neg. weights',      val: '✓ Handles',    color: '#34d399', note: 'Unlike Dijkstra' },
            { op: 'Neg. cycle detect', val: '✓ V-th pass',  color: '#34d399', note: 'Extra iteration' },
            { op: `Current graph`,     val: `V=${nodeCount}, E=${edgeCount}`, color: 'var(--text-muted)', note: `= ${nodeCount * edgeCount} ops max` },
          ].map((c) => (
            <div key={c.op} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.32rem 0.5rem', background: 'var(--bg-elevated)', borderRadius: '0.35rem' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{c.op}</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{c.note}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.77rem', fontWeight: '700', color: c.color, minWidth: '88px', textAlign: 'right' }}>{c.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Bellman-Ford vs Dijkstra</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.5rem', fontSize: '0.72rem' }}>
          {['', 'Bellman-Ford', 'Dijkstra'].map((h, i) => (
            <span key={i} style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {[
            ['Time',          'O(V×E)',       'O((V+E) log V)'],
            ['Neg. weights',  '✓ Yes',        '✗ No'],
            ['Neg. cycles',   '✓ Detects',    '✗ Undefined'],
            ['Direction',     'Directed',     'Undirected/Dir'],
            ['Strategy',      'Relaxation',   'Greedy min-PQ'],
            ['Dense graphs',  'Better',       'Better'],
          ].map(([p, bf, dj]) => (
            <>
              <span key={p}     style={{ color: 'var(--text-muted)' }}>{p}</span>
              <span key={p+'b'} style={{ color: 'var(--accent)', fontWeight: '600' }}>{bf}</span>
              <span key={p+'d'} style={{ color: 'var(--text-secondary)' }}>{dj}</span>
            </>
          ))}
        </div>
      </div>

    </div>
  );
}
