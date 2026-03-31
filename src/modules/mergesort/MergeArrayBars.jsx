function barColor(idx, phase, activeRange, leftPart, rightPart, mergeRange, comparing, merged) {
  if (phase === 'done') return { bg: 'var(--accent)', border: 'var(--accent)', text: '#031a14' };
  if (comparing && comparing.includes(idx) && comparing[0] !== -1 && comparing[1] !== -1)
    return { bg: 'rgba(255,209,102,0.2)', border: '#ffd166', text: '#ffd166' };
  if (mergeRange && idx >= mergeRange[0] && idx <= mergeRange[1] && phase === 'merged')
    return { bg: 'rgba(0,212,170,0.15)', border: 'var(--accent)', text: 'var(--accent)' };
  if (leftPart && idx >= leftPart[0] && idx <= leftPart[1])
    return { bg: 'rgba(74,158,255,0.12)', border: '#4a9eff', text: '#93c5fd' };
  if (rightPart && idx >= rightPart[0] && idx <= rightPart[1])
    return { bg: 'rgba(139,124,248,0.12)', border: '#8b7cf8', text: '#c4b5fd' };
  if (activeRange && idx >= activeRange[0] && idx <= activeRange[1])
    return { bg: 'rgba(0,212,170,0.07)', border: 'rgba(0,212,170,0.3)', text: '#34d399' };
  return { bg: 'var(--bg-elevated)', border: 'var(--border-strong)', text: 'var(--text-muted)' };
}

export default function MergeArrayBars({ arr, phase, activeRange, leftPart, rightPart, mergeRange, comparing, merged }) {
  if (!arr || arr.length === 0) return null;
  const maxVal = Math.max(...arr, 1);

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>Array state</p>

      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-end', height: '120px' }}>
        {arr.map((val, idx) => {
          const s = barColor(idx, phase, activeRange, leftPart, rightPart, mergeRange, comparing, merged);
          const heightPct = Math.max((val / maxVal) * 100, 8);
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.65rem', color: s.text, fontFamily: 'monospace', fontWeight: '700', transition: 'color 0.3s' }}>{val}</span>
              <div style={{
                width: '100%', height: `${heightPct}%`,
                background: s.bg, border: `1px solid ${s.border}`,
                borderRadius: '3px 3px 0 0',
                transition: 'all 0.3s ease',
                boxShadow: s.border === '#ffd166' ? '0 0 8px rgba(255,209,102,0.3)'
                         : s.border === 'var(--accent)' ? '0 0 6px rgba(0,212,170,0.2)' : 'none',
              }} />
              <span style={{ fontSize: '0.58rem', color: 'var(--text-faint)', fontFamily: 'monospace' }}>{idx}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {[
          { c: '#4a9eff',       t: 'Left half' },
          { c: '#8b7cf8',       t: 'Right half' },
          { c: '#ffd166',       t: 'Comparing' },
          { c: 'var(--accent)', t: 'Merged / done' },
        ].map((l) => (
          <span key={l.t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: l.c, flexShrink: 0 }} />{l.t}
          </span>
        ))}
      </div>
    </div>
  );
}
