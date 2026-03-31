const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

export default function MergeSortInfo({ arraySize }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>How merge sort works</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Divide:</strong> Recursively split the array in half until all subarrays have 1 element (base case). <br />
          <strong style={{ color: 'var(--text-primary)' }}>Conquer:</strong> Single elements are trivially sorted. <br />
          <strong style={{ color: 'var(--accent)' }}>Merge:</strong> Merge pairs of sorted subarrays — compare heads, pick the smaller, repeat. The merge step is where ordering happens.
        </p>
        <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { c: '#4a9eff', t: 'Left subarray' },
            { c: '#8b7cf8', t: 'Right subarray' },
            { c: '#ffd166', t: 'Comparing' },
            { c: 'var(--accent)', t: 'Merged' },
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
            { op: 'Best case',    val: 'O(n log n)', color: '#34d399', note: 'Always divides evenly' },
            { op: 'Average case', val: 'O(n log n)', color: '#34d399', note: 'Guaranteed' },
            { op: 'Worst case',   val: 'O(n log n)', color: '#34d399', note: 'Even on sorted input' },
            { op: 'Space',        val: 'O(n)',        color: '#4a9eff', note: 'Temp arrays for merging' },
            { op: `log₂(${arraySize}) levels`, val: `${Math.ceil(Math.log2(arraySize || 1))}`, color: 'var(--text-muted)', note: 'Current array' },
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
        <p style={lbl}>Merge sort vs Quick sort</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.5rem', fontSize: '0.72rem' }}>
          {['', 'Merge', 'Quick'].map((h, i) => (
            <span key={i} style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {[
            ['Worst case',   'O(n log n)', 'O(n²)'],
            ['Space',        'O(n)',        'O(log n)'],
            ['Stable',       '✓ Yes',       '✗ No'],
            ['Strategy',     'Divide',      'Partition'],
            ['Best for',     'Linked lists','Arrays'],
          ].map(([p, m, q]) => (
            <>
              <span key={p}    style={{ color: 'var(--text-muted)' }}>{p}</span>
              <span key={p+'m'} style={{ color: 'var(--accent)', fontWeight: '600' }}>{m}</span>
              <span key={p+'q'} style={{ color: 'var(--text-secondary)' }}>{q}</span>
            </>
          ))}
        </div>
      </div>

    </div>
  );
}
