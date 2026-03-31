export default function QuickPartitionView({ arr, lo, hi, pivotIdx, pivotVal, i, j, phase, sortedIndices = [] }) {
  if (lo === null || hi === null || !arr) return null;

  const leftZone  = arr.slice(lo, (i !== null && i >= lo) ? i + 1 : lo);
  const rightZone = arr.slice((i !== null && i >= lo) ? i + 1 : lo, pivotIdx !== null ? pivotIdx : hi);
  const pivotEl   = pivotIdx !== null ? arr[pivotIdx] : null;

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
        Partition view — range [{lo}..{hi}]
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.62rem', color: '#4a9eff', fontWeight: '700', textTransform: 'uppercase' }}>≤ pivot</span>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', minWidth: '40px' }}>
            {leftZone.length === 0
              ? <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>empty</span>
              : leftZone.map((v, k) => (
                <span key={k} style={{ padding: '0.2rem 0.45rem', borderRadius: '0.3rem', background: 'rgba(74,158,255,0.12)', border: '1px solid rgba(74,158,255,0.3)', fontSize: '0.78rem', fontWeight: '700', color: '#93c5fd', fontFamily: 'monospace' }}>{v}</span>
              ))
            }
          </div>
        </div>

        {pivotEl !== null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.62rem', color: '#f87171', fontWeight: '700', textTransform: 'uppercase' }}>Pivot</span>
            <span style={{ padding: '0.28rem 0.6rem', borderRadius: '0.3rem', background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)', fontSize: '0.82rem', fontWeight: '800', color: '#fca5a5', fontFamily: 'monospace', boxShadow: '0 0 8px rgba(248,113,113,0.2)' }}>{pivotEl}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.62rem', color: '#8b7cf8', fontWeight: '700', textTransform: 'uppercase' }}>&gt; pivot</span>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', minWidth: '40px' }}>
            {rightZone.length === 0
              ? <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>empty</span>
              : rightZone.map((v, k) => (
                <span key={k} style={{ padding: '0.2rem 0.45rem', borderRadius: '0.3rem', background: 'rgba(139,124,248,0.1)', border: '1px solid rgba(139,124,248,0.3)', fontSize: '0.78rem', fontWeight: '700', color: '#c4b5fd', fontFamily: 'monospace' }}>{v}</span>
              ))
            }
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.65rem', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <span>i (boundary) = <strong style={{ color: '#4a9eff', fontFamily: 'monospace' }}>{i !== null ? i : '—'}</strong></span>
        <span>j (scanner) = <strong style={{ color: '#8b7cf8', fontFamily: 'monospace' }}>{j !== null ? j : '—'}</strong></span>
        <span>pivot index = <strong style={{ color: '#f87171', fontFamily: 'monospace' }}>{pivotIdx !== null ? pivotIdx : '—'}</strong></span>
      </div>
    </div>
  );
}
