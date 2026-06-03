export default function TestResults({ results }) {
  if (!results || results.length === 0) return null;
  const passed = results.filter(r => r.passed).length;
  const allPass = passed === results.length;
  const firstFailed = results.find((result) => !result.passed);
  const statusKind = allPass
    ? 'accepted'
    : firstFailed?.kind === 'syntax'
      ? 'compile'
      : firstFailed?.kind === 'unsupported-language'
        ? 'language'
        : firstFailed?.error
          ? 'runtime'
          : 'wrong';
  const statusMap = {
    accepted: ['Accepted', 'Answer accepted. All visible test cases passed.', '#00d4aa'],
    compile: ['Compile Error', 'Fix the syntax issue before running again.', '#ffb86b'],
    language: ['Unsupported Language', 'This browser runner currently executes JavaScript solutions.', '#ffb86b'],
    runtime: ['Runtime Error', 'Your code threw an error on one of the test cases.', '#ff6b6b'],
    wrong: ['Wrong Answer', 'Compare your output with the expected result below.', '#ff6b6b'],
  };
  const [statusLabel, statusCopy, statusColor] = statusMap[statusKind];

  return (
    <div className="test-results">
      <div
        className="test-results__status"
        style={{
          background: `${statusColor}10`,
          borderColor: `${statusColor}45`,
        }}
      >
        <div>
          <strong style={{ color: statusColor }}>{statusLabel}</strong>
          <span>{statusCopy}</span>
        </div>
        <div className="test-results__meta" aria-label="Test summary">
          <code>{passed} of {results.length} cases</code>
          {typeof results.runtimeMs === 'number' && <code>{results.runtimeMs} ms</code>}
        </div>
      </div>
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
              <small style={{ color: r.passed ? '#00d4aa' : '#ff6b6b' }}>
                {r.passed ? 'Passed' : 'Failed'}
              </small>
              <code>Input: {r.input}</code>
            </div>
            <div className="test-result-card__detail">
              {r.error ? (
                <span style={{ color: '#ff6b6b' }}>Error: {r.error}</span>
              ) : (
                <>
                  <span>Output: <code style={{ color: r.passed ? '#00d4aa' : '#ff6b6b' }}>{r.got}</code></span>
                  <span>Expected: <code style={{ color: '#00d4aa' }}>{r.expected}</code></span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
