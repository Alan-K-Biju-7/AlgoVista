const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

export default function DijkstraInfo({ nodeCount, edgeCount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>How Dijkstra works</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Dijkstra greedily picks the <strong style={{ color: '#a78bfa' }}>unvisited node with lowest dist[ ]</strong> from the min-PQ,
          then <strong style={{ color: '#ffd166' }}>relaxes all its edges</strong> — if going through this node improves a neighbor's known distance, update it.
          Once a node is popped and marked settled, its distance is <strong style={{ color: 'var(--accent)' }}>final</strong>.
        </p>
        <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { c: 'var(--accent)', t: 'Shortest path' },
            { c: '#a78bfa',       t: 'Current node' },
            { c: '#34d399',       t: 'Settled' },
            { c: '#ffd166',       t: 'Relaxing edge' },
          ].map((l) => (
            <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: l.c, flexShrink: 0 }} />{l.t}
            </span>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Complexity</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            { op: 'Time (Binary Heap PQ)', val: 'O((V + E) log V)', color: '#34d399' },
            { op: 'Time (naive array)',    val: 'O(V²)',            color: '#ffd166' },
            { op: 'Space',                val: 'O(V + E)',          color: '#4a9eff' },
            { op: 'Current graph',        val: `V=${nodeCount}, E=${edgeCount}`, color: 'var(--text-muted)' },
          ].map((c) => (
            <div key={c.op} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.32rem 0.5rem', background: 'var(--bg-elevated)', borderRadius: '0.35rem' }}>
              <span style={{ fontSize: '0.77rem', color: 'var(--text-secondary)' }}>{c.op}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.77rem', fontWeight: '700', color: c.color }}>{c.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Dijkstra vs BFS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.5rem', fontSize: '0.72rem' }}>
          {['', 'Dijkstra', 'BFS'].map((h, i) => (
            <span key={i} style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {[
            ['Weights',       '✓ Weighted',     '✗ Unweighted'],
            ['Shortest path', '✓ Always',       '✓ Equal weights'],
            ['Data struct',   'Min-PQ (heap)',  'Queue'],
            ['Time',          'O((V+E) log V)', 'O(V+E)'],
            ['Use case',      'Maps, routing',  'Level traversal'],
          ].map(([p, d, b]) => (
            <>
              <span key={p}    style={{ color: 'var(--text-muted)' }}>{p}</span>
              <span key={p+'d'} style={{ color: 'var(--accent)', fontWeight: '600' }}>{d}</span>
              <span key={p+'b'} style={{ color: 'var(--text-secondary)' }}>{b}</span>
            </>
          ))}
        </div>
      </div>

    </div>
  );
}
