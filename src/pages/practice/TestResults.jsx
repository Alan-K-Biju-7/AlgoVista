export default function TestResults({ results }) {
  if (!results || results.length === 0) return null;
  const passed = results.filter(r => r.passed).length;
  const allPass = passed === results.length;
  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Test Results</span>
        <span style={{ padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700',
          background: allPass ? '#00d4aa18' : '#ff6b6b18',
          color: allPass ? '#00d4aa' : '#ff6b6b',
          border: `1px solid ${allPass ? '#00d4aa40' : '#ff6b6b40'}`,
        }}>{passed}/{results.length} passed</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {results.map((r, i) => (
          <div key={i} style={{
            padding: '0.65rem 0.85rem', borderRadius: '0.45rem',
            background: r.passed ? '#00d4aa08' : '#ff6b6b08',
            border: `1px solid ${r.passed ? '#00d4aa30' : '#ff6b6b30'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: r.error || !r.passed ? '0.35rem' : 0 }}>
              <span style={{ fontSize: '0.85rem' }}>{r.passed ? '✓' : '✗'}</span>
              <span style={{ fontSize: '0.8rem', color: r.passed ? '#00d4aa' : '#ff6b6b', fontWeight: '600' }}>Case {i + 1}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Input: {r.input}</span>
            </div>
            {!r.passed && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {r.error ? <span style={{ color: '#ff6b6b' }}>Error: {r.error}</span> : <>
                  <span>Expected: <span style={{ color: '#00d4aa' }}>{r.expected}</span></span>
                  <span>Got: <span style={{ color: '#ff6b6b' }}>{r.got}</span></span>
                </>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
