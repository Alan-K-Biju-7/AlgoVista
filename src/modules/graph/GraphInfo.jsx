const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

export default function GraphInfo({ algorithm }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>How {algorithm} works</p>
        {algorithm === 'BFS' ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Breadth-First Search</strong> uses a <strong style={{ color: '#ffd166' }}>queue (FIFO)</strong> to explore all nodes at the current depth before going deeper.
            It guarantees the <strong style={{ color: 'var(--accent)' }}>shortest path</strong> in an unweighted graph.
            Great for level-order traversal and finding nearest neighbors.
          </p>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Depth-First Search</strong> uses a <strong style={{ color: '#ffd166' }}>stack (LIFO)</strong> to dive as deep as possible down each branch before backtracking.
            It's used for <strong style={{ color: 'var(--accent)' }}>cycle detection</strong>, topological sort, and maze solving.
            Does not guarantee shortest path.
          </p>
        )}
        <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { dot: 'var(--accent)',  t: 'Current node' },
            { dot: '#ffd166',        t: algorithm === 'BFS' ? 'In queue' : 'In stack' },
            { dot: '#34d399',        t: 'Visited' },
            { dot: 'var(--border-strong)', t: 'Unvisited' },
          ].map((l) => (
            <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.dot, display: 'inline-block', flexShrink: 0 }} />{l.t}
            </span>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>BFS vs DFS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.6rem', fontSize: '0.73rem' }}>
          {['', 'BFS', 'DFS'].map((h, i) => (
            <span key={i} style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {[
            ['Structure', 'Queue', 'Stack'],
            ['Order', 'Level by level', 'Branch deep'],
            ['Shortest path', '✓ Yes', '✗ No'],
            ['Time', 'O(V + E)', 'O(V + E)'],
            ['Space', 'O(V)', 'O(V)'],
            ['Best for', 'Nearest node', 'Cycle detect'],
          ].map(([prop, b, d]) => (
            <>
              <span key={prop}   style={{ color: 'var(--text-muted)'  }}>{prop}</span>
              <span key={prop+'b'} style={{ color: algorithm === 'BFS' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: algorithm === 'BFS' ? '600' : '400' }}>{b}</span>
              <span key={prop+'d'} style={{ color: algorithm === 'DFS' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: algorithm === 'DFS' ? '600' : '400' }}>{d}</span>
            </>
          ))}
        </div>
      </div>

    </div>
  );
}
