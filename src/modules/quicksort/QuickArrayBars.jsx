function barColor(idx, phase, pivotIdx, i, j, lo, hi, sortedIndices, swapPair) {
  if (phase === 'done' || sortedIndices.includes(idx))
    return { bg: 'rgba(0,212,170,0.15)', border: 'var(--accent)', text: 'var(--accent)' };
  if (swapPair && swapPair.includes(idx))
    return { bg: 'rgba(255,209,102,0.18)', border: '#ffd166', text: '#ffd166' };
  if (idx === pivotIdx)
    return { bg: 'rgba(248,113,113,0.15)', border: '#f87171', text: '#fca5a5' };
  if (idx === j)
    return { bg: 'rgba(139,124,248,0.15)', border: '#8b7cf8', text: '#c4b5fd' };
  if (i !== null && idx === i)
    return { bg: 'rgba(74,158,255,0.15)', border: '#4a9eff', text: '#93c5fd' };
  if (lo !== null && hi !== null && idx >= lo && idx <= hi)
    return { bg: 'rgba(74,158,255,0.05)', border: 'rgba(74,158,255,0.2)', text: 'var(--text-secondary)' };
  return { bg: 'var(--bg-elevated)', border: 'var(--border-default)', text: 'var(--text-faint)' };
}

export default function QuickArrayBars({ arr, phase, pivotIdx, i, j, lo, hi, sortedIndices = [], swapPair }) {
  if (!arr || arr.length === 0) return null;
  const maxVal = Math.max(...arr, 1);

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>Array state</p>

      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-end', height: '130px' }}>
        {arr.map((val, idx) => {
          const s = barColor(idx, phase, pivotIdx, i, j, lo, hi, sortedIndices, swapPair);
          const heightPct = Math.max((val / maxVal) * 100, 8);
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.62rem', color: s.text, fontFamily: 'monospace', fontWeight: '700', transition: 'color 0.3s' }}>{val}</span>
              <div style={{
                width: '100%', height: `${heightPct}%`,
                background: s.bg, border: `1px solid ${s.border}`,
                borderRadius: '3px 3px 0 0',
                transition: 'all 0.3s ease',
                boxShadow: s.border === '#ffd166' ? '0 0 8px rgba(255,209,102,0.25)'
                         : s.border === '#f87171'  ? '0 0 8px rgba(248,113,113,0.2)' : 'none',
              }} />
              <span style={{ fontSize: '0.58rem', color: 'var(--text-faint)', fontFamily: 'monospace' }}>{idx}</span>
              {idx === pivotIdx && <span style={{ fontSize: '0.55rem', color: '#f87171', fontWeight: '800' }}>P</span>}
              {i !== null && idx === i && idx !== pivotIdx && <span style={{ fontSize: '0.55rem', color: '#4a9eff', fontWeight: '800' }}>i</span>}
              {idx === j && idx !== pivotIdx && <span style={{ fontSize: '0.55rem', color: '#8b7cf8', fontWeight: '800' }}>j</span>}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {[
          { c: '#f87171',       t: 'Pivot (P)' },
          { c: '#4a9eff',       t: 'Boundary (i)' },
          { c: '#8b7cf8',       t: 'Scanner (j)' },
          { c: '#ffd166',       t: 'Swapping' },
          { c: 'var(--accent)', t: 'Sorted' },
        ].map((l) => (
          <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: l.c, flexShrink: 0 }} />{l.t}
          </span>
        ))}
      </div>
    </div>
  );
}
