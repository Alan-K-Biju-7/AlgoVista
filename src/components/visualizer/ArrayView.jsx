const card = {
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

const cardLabel = {
  fontSize: '0.7rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#64748b',
  marginBottom: '0.75rem',
};

function ArrayView({ values, currentSearchIndex, searchFoundIndex }) {
  return (
    <div style={card}>
      <p style={cardLabel}>Array</p>

      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {values.map((value, index) => {
          const isFound = index === searchFoundIndex;
          const isCurrent = index === currentSearchIndex && !isFound;

          let bg = '#1e293b';
          let borderColor = '#334155';
          let textColor = '#94a3b8';
          let indexColor = '#475569';

          if (isCurrent) { bg = '#1e3a5f'; borderColor = '#3b82f6'; textColor = '#93c5fd'; indexColor = '#60a5fa'; }
          if (isFound)   { bg = '#14532d'; borderColor = '#16a34a'; textColor = '#86efac'; indexColor = '#4ade80'; }

          return (
            <div
              key={index}
              style={{
                minWidth: '3rem',
                padding: '0.6rem 0.5rem',
                textAlign: 'center',
                borderRadius: '0.5rem',
                background: bg,
                border: `1px solid ${borderColor}`,
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div style={{ fontSize: '0.65rem', color: indexColor, marginBottom: '0.2rem' }}>{index}</div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: textColor }}>{value}</div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7 }}>
        <strong style={{ color: '#e2e8f0' }}>How it works — </strong>
        Insert adds to the end, update overwrites at a given index, and delete
        removes the element and shifts everything after it left.
      </p>

      <div style={{ marginTop: '0.85rem', display: 'flex', gap: '1.5rem', fontSize: '0.78rem' }}>
        <span style={{ color: '#64748b' }}>Read/write by index: <span style={{ color: '#34d399' }}>O(1)</span></span>
        <span style={{ color: '#64748b' }}>Insert/delete middle: <span style={{ color: '#f87171' }}>O(n)</span></span>
      </div>
    </div>
  );
}

export default ArrayView;
