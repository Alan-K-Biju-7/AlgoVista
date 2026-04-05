import { useState } from 'react';

export default function HintSystem({ hints }) {
  const [revealed, setRevealed] = useState(0);
  return (
    <div style={{ marginTop: '1rem' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Hints</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {hints.map((hint, i) => (
          <div key={i} style={{ borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
            {i < revealed ? (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                <span style={{ color: '#f5a623', fontWeight: '700', marginRight: '0.5rem' }}>Hint {i + 1}:</span>{hint}
              </div>
            ) : (
              <button onClick={() => setRevealed(i + 1)} style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-card)',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: '0.83rem', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{ color: '#f5a623' }}>💡</span>
                {i === 0 ? 'Show first hint' : `Show hint ${i + 1}`}
              </button>
            )}
          </div>
        ))}
      </div>
      {revealed > 0 && revealed < hints.length && (
        <button onClick={() => setRevealed(0)} style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Reset hints
        </button>
      )}
    </div>
  );
}
