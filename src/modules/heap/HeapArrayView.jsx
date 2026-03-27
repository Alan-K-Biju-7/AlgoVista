function cellColor(idx, highlightIdx, swapPair, phase) {
  if (swapPair && swapPair.includes(idx))
    return { bg: 'rgba(255,209,102,0.15)', border: '#ffd166', text: '#ffd166' };
  if (highlightIdx.includes(idx)) {
    if (phase === 'extract' || phase === 'done')
      return { bg: 'rgba(0,212,170,0.12)', border: 'var(--accent)', text: '#00e5b8' };
    if (phase === 'insert' || phase === 'move')
      return { bg: 'rgba(74,158,255,0.12)', border: '#4a9eff', text: '#93c5fd' };
    return { bg: 'rgba(139,124,248,0.12)', border: '#8b7cf8', text: '#c4b5fd' };
  }
  if (idx === 0)
    return { bg: 'rgba(0,212,170,0.06)', border: 'rgba(0,212,170,0.35)', text: '#34d399' };
  return { bg: 'var(--bg-elevated)', border: 'var(--border-strong)', text: 'var(--text-secondary)' };
}

export default function HeapArrayView({ heap, highlightIdx = [], swapPair = null, phase = '' }) {
  if (!heap || heap.length === 0) {
    return (
      <div style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        Array is empty
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1rem 1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.7rem' }}>Array representation</p>

      <div style={{ overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', minWidth: 'max-content' }}>
          {heap.map((val, idx) => {
            const s = cellColor(idx, highlightIdx, swapPair, phase);
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: s.bg, border: `1px solid ${s.border}`,
                  borderRadius: '0.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.88rem', fontWeight: '700', color: s.text,
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease',
                  boxShadow: swapPair && swapPair.includes(idx) ? `0 0 10px rgba(255,209,102,0.3)` : 'none',
                }}>
                  {val}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)', fontFamily: 'monospace' }}>{idx}</span>
                {idx === 0 && <span style={{ fontSize: '0.58rem', color: 'var(--accent)', fontWeight: '700', letterSpacing: '0.05em' }}>MIN</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {[
          { c: 'var(--accent)',  t: 'Root / min' },
          { c: '#4a9eff',        t: 'Inserted' },
          { c: '#ffd166',        t: 'Swapping' },
          { c: '#8b7cf8',        t: 'Comparing' },
        ].map((l) => (
          <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: l.c, display: 'inline-block' }} />{l.t}
          </span>
        ))}
      </div>
    </div>
  );
}
