export default function TestResults({ results }) {
  if (!results || results.length === 0) return null;
  const passed = results.filter(r => r.passed).length;
  const allPass = passed === results.length;
  return (
    <div className="test-results">
      <div className="test-results__header">
        <span>Test Results</span>
        <b style={{
          background: allPass ? '#00d4aa18' : '#ff6b6b18',
          color: allPass ? '#00d4aa' : '#ff6b6b',
          border: `1px solid ${allPass ? '#00d4aa40' : '#ff6b6b40'}`,
        }}>{passed}/{results.length} passed</b>
      </div>
      <div className="test-results__list">
        {results.map((r, i) => (
          <div
            key={i}
            className="test-result-card"
            style={{
              background: r.passed ? '#00d4aa08' : '#ff6b6b08',
              borderColor: r.passed ? '#00d4aa30' : '#ff6b6b30',
            }}
          >
            <div className="test-result-card__top">
              <span>{r.passed ? '✓' : '✗'}</span>
              <b style={{ color: r.passed ? '#00d4aa' : '#ff6b6b' }}>Case {i + 1}</b>
              <code>Input: {r.input}</code>
            </div>
            {!r.passed && (
              <div className="test-result-card__detail">
                {r.error ? <span style={{ color: '#ff6b6b' }}>Error: {r.error}</span> : <>
                  <span>Expected: <code style={{ color: '#00d4aa' }}>{r.expected}</code></span>
                  <span>Got: <code style={{ color: '#ff6b6b' }}>{r.got}</code></span>
                </>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
