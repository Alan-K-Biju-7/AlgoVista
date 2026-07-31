import { useEffect, useState } from 'react';

export function findMismatch(actual, expected, path = 'result') {
  if (Object.is(actual, expected)) return null;
  if (typeof actual === 'string' && typeof expected === 'string') {
    const limit = Math.max(actual.length, expected.length);
    for (let index = 0; index < limit; index += 1) {
      if (actual[index] !== expected[index]) {
        return { path: `${path}[${index}]`, actual: actual[index] ?? 'missing', expected: expected[index] ?? 'no character expected' };
      }
    }
  }
  if (Array.isArray(actual) && Array.isArray(expected)) {
    const limit = Math.max(actual.length, expected.length);
    for (let index = 0; index < limit; index += 1) {
      if (index >= actual.length) return { path: `${path}[${index}]`, actual: 'missing', expected: expected[index] };
      if (index >= expected.length) return { path: `${path}[${index}]`, actual: actual[index], expected: 'no value expected' };
      const child = findMismatch(actual[index], expected[index], `${path}[${index}]`);
      if (child) return child;
    }
  }
  if (actual && expected && typeof actual === 'object' && typeof expected === 'object') {
    const keys = [...new Set([...Object.keys(actual), ...Object.keys(expected)])];
    for (const key of keys) {
      const child = findMismatch(actual[key], expected[key], `${path}.${key}`);
      if (child) return child;
    }
  }
  return { path, actual, expected };
}

function StructuralDiff({ actual, expected, mismatchPath }) {
  const mismatchIndex = Number(mismatchPath?.match(/\[(\d+)\]/)?.[1]);
  if (Array.isArray(actual) || Array.isArray(expected)) {
    const actualItems = Array.isArray(actual) ? actual : [];
    const expectedItems = Array.isArray(expected) ? expected : [];
    const length = Math.min(16, Math.max(actualItems.length, expectedItems.length));
    const row = (label, items, tone) => (
      <div className="structure-diff__row"><span>{label}</span><div>{Array.from({ length }, (_, index) => <code key={index} className={index === mismatchIndex ? `is-mismatch ${tone}` : ''}><b>{index}</b>{index < items.length ? display(items[index]) : '∅'}</code>)}</div></div>
    );
    return <div className="structure-diff">{row('Yours', actualItems, 'is-actual')}{row('Expected', expectedItems, 'is-expected')}{Math.max(actualItems.length, expectedItems.length) > 16 && <small>Showing the first 16 values</small>}</div>;
  }
  if (typeof actual === 'string' && typeof expected === 'string') {
    const length = Math.min(24, Math.max(actual.length, expected.length));
    const row = (label, value, tone) => (
      <div className="structure-diff__row"><span>{label}</span><div>{Array.from({ length }, (_, index) => <code key={index} className={index === mismatchIndex ? `is-mismatch ${tone}` : ''}><b>{index}</b>{value[index] ?? '∅'}</code>)}</div></div>
    );
    return <div className="structure-diff">{row('Yours', actual, 'is-actual')}{row('Expected', expected, 'is-expected')}</div>;
  }
  return null;
}

function display(value) {
  if (typeof value === 'string') return value;
  const json = JSON.stringify(value);
  return json === undefined ? String(value) : json;
}

function likelyDiagnosis(result, mismatch) {
  if (result.error) {
    if (result.kind === 'runner-unavailable') return ['Isolated runner availability', 'Reload the page or try a current browser with Web Worker support. Your solution has not been judged.'];
    const message = String(result.error).toLowerCase();
    if (result.kind === 'timeout') return ['Loop progress or complexity', 'Verify that every loop changes the state used by its stopping condition. Then retry the smallest input that loops.'];
    if (message.includes('undefined') || message.includes('null')) return ['Missing boundary or base case', 'Find the first read that can occur outside the structure, then test the smallest empty or one-item input.'];
    if (message.includes('not defined')) return ['Name or scope mismatch', 'Trace where that name should be created and whether it is visible at the failing line.'];
    return ['Execution path', 'Reduce the case until the error still occurs, then inspect the last value produced before execution stops.'];
  }
  if (mismatch?.actual === 'missing') return ['Early termination', 'Check the loop bound, return placement, or base case that can stop before this value is produced.'];
  if (mismatch?.expected === 'no value expected' || mismatch?.expected === 'no character expected') return ['Extra iteration or write', 'Check whether a ≤ bound should be <, or whether a value is appended before its condition is validated.'];
  if (typeof mismatch?.actual === 'number' && typeof mismatch?.expected === 'number' && Math.abs(mismatch.actual - mismatch.expected) === 1) return ['Boundary or update order', 'Write down the value immediately before and after this step; look for an off-by-one bound or an update happening too early.'];
  if (typeof mismatch?.actual === 'boolean') return ['Condition or invariant', 'Substitute this exact input into the condition and identify which clause makes the decision differ.'];
  return ['State update', 'Rerun only this case and trace the variable that writes the first mismatching value.'];
}

export function buildFailureDiagnostic(result, caseIndex = 0) {
  if (!result || result.passed) return null;
  const mismatch = result.error ? null : findMismatch(result.actualValue, result.expectedValue);
  const [category, experiment] = likelyDiagnosis(result, mismatch);
  const verdict = result.kind === 'timeout'
    ? 'timeout'
    : result.kind === 'runner-unavailable'
      ? 'runner-unavailable'
    : result.kind === 'syntax'
      ? 'compile'
      : result.error
        ? 'runtime'
        : 'wrong-answer';
  return {
    caseIndex: Number.isInteger(result.caseIndex) ? result.caseIndex : caseIndex,
    verdict,
    category,
    experiment,
    firstMismatch: mismatch
      ? `${mismatch.path}: got ${display(mismatch.actual)}, expected ${display(mismatch.expected)}`
      : '',
    input: result.input,
    expected: result.expected,
    actual: result.got,
    error: result.error || '',
  };
}

function FailureVisual({ result }) {
  if (result.kind === 'runner-unavailable') {
    return (
      <div className="failure-explainer failure-explainer--error">
        <span className="failure-explainer__icon">!</span>
        <div>
          <b>Execution did not start</b>
          <p>{result.error}</p>
          <div className="failure-next-step">
            <span>Browser runner unavailable</span>
            <p>Reload the page or try a current browser with Web Worker support. Your solution has not been judged.</p>
          </div>
        </div>
      </div>
    );
  }
  if (result.error) {
    const [cause, experiment] = likelyDiagnosis(result);
    return (
      <div className="failure-explainer failure-explainer--error">
        <span className="failure-explainer__icon">!</span>
        <div><b>Execution stopped here</b><p>{result.error}</p><div className="failure-next-step"><span>Likely area · {cause}</span><p>{experiment}</p></div></div>
      </div>
    );
  }
  const mismatch = findMismatch(result.actualValue, result.expectedValue);
  if (!mismatch) return null;
  const [cause, experiment] = likelyDiagnosis(result, mismatch);
  return (
    <div className="failure-explainer">
      <div className="failure-explainer__path"><span>First mismatch</span><code>{mismatch.path}</code></div>
      <StructuralDiff actual={result.actualValue} expected={result.expectedValue} mismatchPath={mismatch.path} />
      <div className="failure-compare">
        <div><span>Your value</span><code>{display(mismatch.actual)}</code></div>
        <i>≠</i>
        <div><span>Expected</span><code>{display(mismatch.expected)}</code></div>
      </div>
      <p>Trace the value that writes to <code>{mismatch.path}</code>. The earlier values matched, so this is the first point where the outputs diverge.</p>
      <div className="failure-next-step"><span>Likely area · {cause}</span><p>{experiment}</p></div>
    </div>
  );
}

export default function TestResults({
  results,
  accepted = false,
  onExplainFailure,
  tutorRequiresAuth = false,
}) {
  const [activeCase, setActiveCase] = useState(0);
  useEffect(() => {
    const firstFailedIndex = results?.findIndex((result) => !result.passed) ?? -1;
    setActiveCase(firstFailedIndex >= 0 ? firstFailedIndex : 0);
  }, [results]);
  if (!results || results.length === 0) return null;
  const passed = results.filter(r => r.passed).length;
  const allPass = passed === results.length;
  const firstFailed = results.find((result) => !result.passed);
  const statusKind = allPass
    ? accepted ? 'accepted' : 'passed'
    : firstFailed?.kind === 'timeout'
      ? 'timeout'
      : firstFailed?.kind === 'syntax'
        ? 'compile'
      : firstFailed?.kind === 'unsupported-language'
          ? 'language'
          : firstFailed?.kind === 'runner-unavailable'
            ? 'runner-unavailable'
          : firstFailed?.error
            ? 'runtime'
            : 'wrong';
  const statusMap = {
    accepted: ['Accepted locally', 'Your submission passed AlgoVista’s bundled test bank. A remote hidden-case judge is not connected yet.', '#00d4aa'],
    passed: ['Visible tests passed', 'Good checkpoint. Submit when you want this solve recorded as learning evidence.', '#00d4aa'],
    timeout: ['Time Limit Exceeded', 'Execution was stopped safely. Check loop progress and algorithmic complexity.', '#ffb86b'],
    compile: ['Compile Error', 'Fix the syntax issue before running again.', '#ffb86b'],
    language: ['Unsupported Language', 'This browser runner currently executes JavaScript solutions.', '#ffb86b'],
    'runner-unavailable': ['Runner unavailable', 'The isolated runner could not start, so your code was not executed. Reload or try a current browser with Web Worker support.', '#ffb86b'],
    runtime: ['Runtime Error', 'Your code threw an error on one of the test cases.', '#ff6b6b'],
    wrong: ['Wrong Answer', 'Compare your output with the expected result below.', '#ff6b6b'],
  };
  const [statusLabel, statusCopy, statusColor] = statusMap[statusKind];
  const displayedCaseNumber = (result, index) => (
    Number.isInteger(result?.caseIndex) ? result.caseIndex + 1 : index + 1
  );

  return (
    <div className="test-results">
      <div
        className="test-results__status"
        role="status"
        aria-live="polite"
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
        <span>Testcase diagnostics</span>
        <b style={{
          background: allPass ? '#00d4aa18' : '#ff6b6b18',
          color: allPass ? '#00d4aa' : '#ff6b6b',
          border: `1px solid ${allPass ? '#00d4aa40' : '#ff6b6b40'}`,
        }}>{passed}/{results.length} passed</b>
      </div>
      <div className="test-case-tabs" role="tablist" aria-label="Executed test cases">
        {results.map((result, index) => (
          <button
            id={`test-case-tab-${index}`}
            aria-controls={`test-case-panel-${index}`}
            tabIndex={activeCase === index ? 0 : -1}
            className={activeCase === index ? 'is-active' : ''}
            type="button"
            role="tab"
            aria-selected={activeCase === index}
            onClick={() => setActiveCase(index)}
            onKeyDown={(event) => {
              const next = event.key === 'ArrowRight'
                ? (index + 1) % results.length
                : event.key === 'ArrowLeft'
                  ? (index - 1 + results.length) % results.length
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? results.length - 1
                      : null;
              if (next !== null) {
                event.preventDefault();
                setActiveCase(next);
                document.getElementById(`test-case-tab-${next}`)?.focus();
              }
            }}
            key={index}
          >
            <span>{result.passed ? '✓' : '!'}</span> Case {displayedCaseNumber(result, index)}
          </button>
        ))}
      </div>
      <div className="test-results__list">
        {results.map((r, i) => (
          <div
            id={`test-case-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`test-case-tab-${i}`}
            hidden={activeCase !== i}
            key={i}
            className={`test-result-card ${activeCase === i ? 'is-active' : 'is-hidden'}`}
            style={{
              background: r.passed ? '#00d4aa08' : r.kind === 'runner-unavailable' ? '#ffb86b08' : '#ff6b6b08',
              borderColor: r.passed ? '#00d4aa30' : r.kind === 'runner-unavailable' ? '#ffb86b30' : '#ff6b6b30',
            }}
          >
            <div className="test-result-card__top">
              <span>{r.passed ? '✓' : r.kind === 'runner-unavailable' ? '—' : '✗'}</span>
              <b style={{ color: r.passed ? '#00d4aa' : r.kind === 'runner-unavailable' ? '#ffb86b' : '#ff6b6b' }}>Case {displayedCaseNumber(r, i)}</b>
              <small style={{ color: r.passed ? '#00d4aa' : r.kind === 'runner-unavailable' ? '#ffb86b' : '#ff6b6b' }}>
                {r.passed ? 'Passed' : r.kind === 'runner-unavailable' ? 'Not run' : 'Failed'}
              </small>
              <code>{typeof r.durationMs === 'number' ? `${r.durationMs} ms` : ''}</code>
            </div>
            <div className="test-result-card__detail">
              <div className="test-io-grid">
                <div><span>Input</span><code>{r.input || '—'}</code></div>
                <div><span>Your output</span><code className={r.passed ? 'is-pass' : 'is-fail'}>{r.got || '—'}</code></div>
                <div><span>Expected</span><code className="is-pass">{r.expected || '—'}</code></div>
              </div>
              {!r.passed && <FailureVisual result={r} />}
              {!r.passed && r.kind !== 'runner-unavailable' && onExplainFailure && (
                <button
                  type="button"
                  className="failure-tutor-action"
                  onClick={() => onExplainFailure(buildFailureDiagnostic(r, i), r)}
                >
                  <span aria-hidden="true">{tutorRequiresAuth ? '▣' : '✦'}</span>
                  <span>
                    <b>{tutorRequiresAuth ? 'Sign in to explain this failure' : 'Explain this failure'}</b>
                    <small>{tutorRequiresAuth ? 'Your exact failed case will stay open' : 'Open the contextual tutor with this exact case'}</small>
                  </span>
                  <i aria-hidden="true">→</i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
