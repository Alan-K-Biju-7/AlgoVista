const ROLE_COLORS = {
  current:    { bg: '#00d4aa22', border: '#00d4aa', label: '#00d4aa' },
  compare:    { bg: '#4a9eff22', border: '#4a9eff', label: '#4a9eff' },
  min:        { bg: '#f5a62322', border: '#f5a623', label: '#f5a623' },
  found:      { bg: '#00d4aa44', border: '#00d4aa', label: '#00d4aa' },
  eliminated: { bg: '#ff6b6b12', border: '#ff6b6b55', label: '#ff6b6b' },
  result:     { bg: '#00d4aa33', border: '#00d4aa', label: '#00d4aa' },
  window:     { bg: '#8b7cf822', border: '#8b7cf855', label: '#8b7cf8' },
  lo:         { bg: '#4a9eff33', border: '#4a9eff', label: '#4a9eff' },
  hi:         { bg: '#f5a62333', border: '#f5a623', label: '#f5a623' },
};

function ArrayCell({ item, prevVal }) {
  const c = ROLE_COLORS[item.role] || { bg: 'var(--bg-card)', border: 'var(--border-default)', label: 'var(--text-muted)' };
  const changed = prevVal !== undefined && prevVal !== item.val;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '0.45rem',
        background: c.bg,
        border: `2px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)',
        fontFamily: 'monospace',
        transition: 'all 0.25s',
        boxShadow: changed ? `0 0 12px ${c.border}66` : 'none',
        transform: changed ? 'scale(1.08)' : 'scale(1)',
      }}>
        {String(item.val)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{item.idx}</span>
        {item.role && (
          <span style={{ fontSize: '0.58rem', fontWeight: '700', color: c.label, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {item.role}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ArrayTracer({ snapshot, prevSnapshot, label }) {
  if (!snapshot) return null;
  const arrays = snapshot.type === 'two_arrays' ? snapshot.arrays : [snapshot];

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      {arrays.map((arr, ai) => (
        <div key={ai} style={{ marginBottom: '0.5rem' }}>
          {arr.label && (
            <p style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              {arr.label}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'flex-end' }}>
            {arr.items.map((item) => {
              const prev = prevSnapshot?.type === 'two_arrays'
                ? prevSnapshot.arrays[ai]?.items[item.idx]?.val
                : prevSnapshot?.items[item.idx]?.val;
              return <ArrayCell key={item.idx} item={item} prevVal={prev} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
