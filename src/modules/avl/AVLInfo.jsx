const card = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.1rem' };
const lbl  = { fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' };

const complexities = [
  { op: 'Insert',  avg: 'O(log n)', worst: 'O(log n)', ac: '#34d399', wc: '#34d399' },
  { op: 'Delete',  avg: 'O(log n)', worst: 'O(log n)', ac: '#34d399', wc: '#34d399' },
  { op: 'Search',  avg: 'O(log n)', worst: 'O(log n)', ac: '#34d399', wc: '#34d399' },
  { op: 'Space',   avg: 'O(n)',     worst: 'O(n)',      ac: '#60a5fa', wc: '#60a5fa' },
];

export default function AVLInfo({ traversalResult, traversalType }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      <div style={card}>
        <p style={lbl}>How AVL differs from BST</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          An <strong style={{ color: 'var(--text-primary)' }}>AVL tree</strong> is a self-balancing BST. After every insert or delete, it checks the{' '}
          <strong style={{ color: '#fbbf24' }}>balance factor</strong> (left height − right height) at every ancestor.
          If any node has bf &gt; 1 or bf &lt; −1, a rotation is applied to restore balance.
          This guarantees O(log n) worst-case — unlike a plain BST which degrades to O(n) on sorted input.
        </p>
        <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[{ c: '#34d399', t: 'bf = 0 (balanced)' }, { c: '#fbbf24', t: 'bf = ±1 (ok)' }, { c: '#f87171', t: 'bf = ±2 (rotate!)' }].map((l) => (
            <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.c, display: 'inline-block' }} />{l.t}
            </span>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={lbl}>Time complexity — always O(log n)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
          {['Op','Avg','Worst'].map((h) => (
            <span key={h} style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.68rem', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {complexities.map((c) => (
            <>
              <span key={c.op+'o'} style={{ color: 'var(--text-secondary)' }}>{c.op}</span>
              <span key={c.op+'a'} style={{ color: c.ac, fontWeight: '600' }}>{c.avg}</span>
              <span key={c.op+'w'} style={{ color: c.wc, fontWeight: '600' }}>{c.worst}</span>
            </>
          ))}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
          Unlike a plain BST, AVL guarantees O(log n) even for sorted input — because rotations keep the height at ⌊log₂ n⌋.
        </p>
      </div>

      {traversalResult.length > 0 && (
        <div style={card}>
          <p style={lbl}>{traversalType} traversal</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {traversalResult.map((v, i) => (
              <span key={i} style={{ padding: '0.2rem 0.55rem', borderRadius: '0.35rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', fontSize: '0.78rem', fontWeight: '600', color: '#93c5fd', fontFamily: 'monospace' }}>{v}</span>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {traversalType === 'Inorder' && 'Inorder yields a sorted sequence — proof the BST property is intact after all rotations.'}
            {traversalType === 'Preorder' && 'Preorder (root → left → right) — useful for serializing the tree structure.'}
            {traversalType === 'Postorder' && 'Postorder (left → right → root) — used in tree deletion and expression evaluation.'}
          </p>
        </div>
      )}

    </div>
  );
}
