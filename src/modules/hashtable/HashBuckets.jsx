import { loadFactorColor, computeLoadFactor } from './hashUtils';

function ChainNode({ entry, isHighlighted, isActive }) {
  const border = isHighlighted
    ? (isActive ? '1px solid var(--accent)' : '1px solid #ffd166')
    : '1px solid var(--border-strong)';
  const bg = isHighlighted
    ? (isActive ? 'rgba(0,212,170,0.12)' : 'rgba(255,209,102,0.1)')
    : 'var(--bg-elevated)';
  const textColor = isHighlighted ? (isActive ? 'var(--accent)' : '#ffd166') : 'var(--text-secondary)';

  return (
    <div style={{
      padding: '0.28rem 0.55rem', borderRadius: '0.35rem',
      border, background: bg, transition: 'all 0.3s',
      display: 'flex', gap: '0.35rem', alignItems: 'center',
      boxShadow: isHighlighted ? `0 0 8px ${isActive ? 'rgba(0,212,170,0.2)' : 'rgba(255,209,102,0.15)'}` : 'none',
    }}>
      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: textColor, fontFamily: 'monospace' }}>{entry.key}</span>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>→</span>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{entry.value}</span>
    </div>
  );
}

export default function HashBuckets({ table, activeIdx, highlightKeys = [], phase }) {
  const lf = computeLoadFactor(table.count, table.size);
  const lfColor = loadFactorColor(parseFloat(lf));

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.1rem' }}>

      {/* Load factor bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Hash Table — Separate Chaining</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{table.count} entries / {table.size} buckets</span>
          <span style={{ padding: '0.18rem 0.55rem', borderRadius: '999px', background: `${lfColor}18`, border: `1px solid ${lfColor}40`, fontSize: '0.7rem', fontWeight: '700', color: lfColor }}>
            λ = {lf}
          </span>
        </div>
      </div>

      {/* Load factor bar */}
      <div style={{ height: '3px', background: 'var(--border-default)', borderRadius: '2px', marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(parseFloat(lf) * 100, 100)}%`, background: lfColor, transition: 'width 0.4s ease', borderRadius: '2px' }} />
      </div>

      {/* Bucket grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '380px', overflowY: 'auto' }}>
        {table.buckets.map((bucket, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div key={idx} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              padding: '0.45rem 0.65rem', borderRadius: '0.45rem',
              background: isActive ? 'rgba(0,212,170,0.05)' : 'transparent',
              border: isActive ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
              transition: 'all 0.3s',
            }}>
              {/* Bucket index badge */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
                background: isActive ? 'rgba(0,212,170,0.15)' : 'var(--bg-elevated)',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-strong)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.68rem', fontWeight: '800',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.3s', fontFamily: 'monospace',
              }}>{idx}</div>

              {/* Chain */}
              {bucket.length === 0 ? (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', alignSelf: 'center', fontStyle: 'italic' }}>empty</span>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                  {bucket.map((entry, ci) => (
                    <div key={entry.key} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {ci > 0 && <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>→</span>}
                      <ChainNode
                        entry={entry}
                        isHighlighted={highlightKeys.includes(entry.key)}
                        isActive={phase === 'found' || phase === 'done'}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
