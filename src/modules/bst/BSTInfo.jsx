const complexities = [
  { op: 'Insert',      avg: 'O(log n)', worst: 'O(n)', avgColor: '#34d399', worstColor: '#fbbf24' },
  { op: 'Search',      avg: 'O(log n)', worst: 'O(n)', avgColor: '#34d399', worstColor: '#fbbf24' },
  { op: 'Delete',      avg: 'O(log n)', worst: 'O(n)', avgColor: '#34d399', worstColor: '#fbbf24' },
  { op: 'Inorder',     avg: 'O(n)',     worst: 'O(n)', avgColor: '#60a5fa', worstColor: '#60a5fa' },
  { op: 'Space',       avg: 'O(n)',     worst: 'O(n)', avgColor: '#60a5fa', worstColor: '#60a5fa' },
];

const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.1rem' };
const label = { fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' };

export default function BSTInfo({ traversalResult, traversalType }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={label}>How a BST works</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          A <strong style={{ color: 'var(--text-primary)' }}>Binary Search Tree</strong> keeps every left child smaller than its parent and every right child larger.
          This ordering makes <strong style={{ color: '#34d399' }}>insert</strong>, <strong style={{ color: '#34d399' }}>search</strong>, and <strong style={{ color: '#34d399' }}>delete</strong> all O(log n) on average — but degrade to O(n) on a skewed tree where every node is inserted in sorted order.
        </p>
        <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[{ dot: '#34d399', t: 'Search path' }, { dot: '#22c55e', t: 'Found' }, { dot: '#ef4444', t: 'Deleted' }, { dot: '#3b82f6', t: 'Traversal' }].map((l) => (
            <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.dot, display: 'inline-block', flexShrink: 0 }} />{l.t}
            </span>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={label}>Time complexity</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.68rem', textTransform: 'uppercase' }}>Op</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.68rem', textTransform: 'uppercase' }}>Avg</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.68rem', textTransform: 'uppercase' }}>Worst</span>
          {complexities.map((c) => (
            <>
              <span key={c.op + 'op'} style={{ color: 'var(--text-secondary)' }}>{c.op}</span>
              <span key={c.op + 'avg'} style={{ color: c.avgColor, fontWeight: '600' }}>{c.avg}</span>
              <span key={c.op + 'w'} style={{ color: c.worstColor, fontWeight: '600' }}>{c.worst}</span>
            </>
          ))}
        </div>
      </div>

      {traversalResult.length > 0 && (
        <div style={card}>
          <p style={label}>{traversalType} traversal result</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {traversalResult.map((v, i) => (
              <span key={i} style={{ padding: '0.2rem 0.55rem', borderRadius: '0.35rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', fontSize: '0.78rem', fontWeight: '600', color: '#93c5fd', fontFamily: 'monospace' }}>{v}</span>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {traversalType === 'Inorder' && 'Inorder always produces a sorted sequence for a valid BST.'}
            {traversalType === 'Preorder' && 'Preorder visits root first — useful for copying or serializing the tree.'}
            {traversalType === 'Postorder' && 'Postorder visits children before root — used in deletion and expression trees.'}
          </p>
        </div>
      )}

    </div>
  );
}
