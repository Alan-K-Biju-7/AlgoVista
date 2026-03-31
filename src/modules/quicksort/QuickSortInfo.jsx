const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

export default function QuickSortInfo({ arraySize }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>How quick sort works</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <strong style={{ color: '#f87171' }}>Pick a pivot</strong> (Lomuto: last element).
          <strong style={{ color: '#4a9eff' }}> Partition</strong> — scan with pointer <code style={{ color: '#8b7cf8' }}>j</code>, 
          any element ≤ pivot swaps into the left zone tracked by <code style={{ color: '#4a9eff' }}>i</code>. 
          Finally place the pivot at <code style={{ color: '#4a9eff' }}>i+1</code> — its <strong style={{ color: 'var(--accent)' }}>final sorted position</strong>.
          Recurse left and right of pivot.
        </p>
        <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { c: '#f87171', t: 'Pivot (last elem)' },
            { c: '#4a9eff', t: 'Boundary i' },
            { c: '#8b7cf8', t: 'Scanner j' },
            { c: '#ffd166', t: 'Swapping' },
            { c: 'var(--accent)', t: 'Final position' },
          ].map((l) => (
            <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: l.c, flexShrink: 0 }} />{l.t}
            </span>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Time complexity</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            { op: 'Best / Average', val: 'O(n log n)', color: '#34d399', note: 'Balanced partitions' },
            { op: 'Worst case',     val: 'O(n²)',      color: '#f87171', note: 'Already sorted + last pivot' },
            { op: 'Space',          val: 'O(log n)',   color: '#4a9eff', note: 'Recursion stack only' },
            { op: 'In-place',       val: '✓ Yes',      color: 'var(--accent)', note: 'No temp arrays needed' },
            { op: `n = ${arraySize}`, val: `log₂(${arraySize}) ≈ ${Math.ceil(Math.log2(arraySize || 1))}`, color: 'var(--text-muted)', note: 'Expected recursion depth' },
          ].map((c) => (
            <div key={c.op} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.32rem 0.5rem', background: 'var(--bg-elevated)', borderRadius: '0.35rem' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{c.op}</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{c.note}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.77rem', fontWeight: '700', color: c.color, minWidth: '78px', textAlign: 'right' }}>{c.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Lomuto vs Hoare partition</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.5rem', fontSize: '0.72rem' }}>
          {['', 'Lomuto', 'Hoare'].map((h, i) => (
            <span key={i} style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {[
            ['Pivot',    'Last element', 'First element'],
            ['Pointers', '1 boundary i', '2 pointers i,j'],
            ['Swaps',    'More swaps',   'Fewer swaps'],
            ['Simple',   '✓ Simpler',    '✗ Trickier'],
            ['Used here','✓ Yes',        '✗ No'],
          ].map(([p, l, h]) => (
            <>
              <span key={p}    style={{ color: 'var(--text-muted)' }}>{p}</span>
              <span key={p+'l'} style={{ color: 'var(--accent)', fontWeight: '600' }}>{l}</span>
              <span key={p+'h'} style={{ color: 'var(--text-secondary)' }}>{h}</span>
            </>
          ))}
        </div>
      </div>

    </div>
  );
}
