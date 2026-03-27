const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' };
const lbl  = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' };

const complexities = [
  { op: 'Insert',       val: 'O(log n)', color: '#34d399', note: 'Bubble up at most h levels' },
  { op: 'Extract min',  val: 'O(log n)', color: '#34d399', note: 'Heapify down at most h levels' },
  { op: 'Peek min',     val: 'O(1)',     color: 'var(--accent)', note: 'Root is always minimum' },
  { op: 'Build heap',   val: 'O(n)',     color: '#4a9eff', note: 'Floyd\'s algorithm' },
  { op: 'Space',        val: 'O(n)',     color: '#4a9eff', note: 'Array-backed storage' },
];

export default function HeapInfo({ heapSize, minVal }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>How a min-heap works</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          A <strong style={{ color: 'var(--text-primary)' }}>min-heap</strong> is a complete binary tree where every parent is ≤ its children.
          The minimum is always at the <strong style={{ color: 'var(--accent)' }}>root (index 0)</strong>.
          It is stored as a flat array — for node at index <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>i</span>,
          left child is <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>2i+1</span> and right is <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>2i+2</span>.
        </p>

        {minVal !== null && (
          <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '0.5rem 0.85rem', borderRadius: '0.5rem', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.15rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Current min</p>
              <p style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--accent)', letterSpacing: '-0.03em' }}>{minVal}</p>
            </div>
            <div style={{ padding: '0.5rem 0.85rem', borderRadius: '0.5rem', background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.25)' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.15rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Heap size</p>
              <p style={{ fontSize: '1.3rem', fontWeight: '900', color: '#4a9eff', letterSpacing: '-0.03em' }}>{heapSize}</p>
            </div>
          </div>
        )}
      </div>

      <div style={card}>
        <p style={lbl}>Time complexity</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {complexities.map((c) => (
            <div key={c.op} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.35rem 0.5rem', borderRadius: '0.35rem', background: 'var(--bg-elevated)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.op}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{c.note}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: c.color, fontFamily: 'monospace', minWidth: '72px', textAlign: 'right' }}>{c.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Insert vs Extract-min</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {[
            { op: 'Insert', steps: ['Append to end of array', 'Bubble UP — compare with parent', 'Swap if child < parent', 'Repeat until root or heap property holds'], color: '#4a9eff' },
            { op: 'Extract min', steps: ['Remove root (minimum)', 'Move last element to root', 'Bubble DOWN — compare with children', 'Swap with smaller child if needed', 'Repeat until leaf or heap property holds'], color: '#f87171' },
          ].map((item) => (
            <div key={item.op} style={{ padding: '0.65rem 0.75rem', borderRadius: '0.45rem', background: 'var(--bg-elevated)', border: `1px solid ${item.color}25` }}>
              <p style={{ fontSize: '0.72rem', fontWeight: '700', color: item.color, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.op}</p>
              <ol style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', listStyle: 'decimal' }}>
                {item.steps.map((s, i) => <li key={i} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s}</li>)}
              </ol>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
