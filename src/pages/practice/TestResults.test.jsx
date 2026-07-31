import { fireEvent, render, screen } from '@testing-library/react';
import TestResults, { buildFailureDiagnostic, findMismatch } from './TestResults';

const failedResult = {
  passed: false,
  kind: 'wrong-answer',
  input: '[[3,3],6]',
  expected: '[0,1]',
  got: '[1,1]',
  actualValue: [1, 1],
  expectedValue: [0, 1],
  durationMs: 1,
  error: null,
};

test('locates the first structural mismatch for visual failure evidence', () => {
  expect(findMismatch([1, 1], [0, 1])).toEqual({
    path: 'result[0]',
    actual: 1,
    expected: 0,
  });
  expect(buildFailureDiagnostic(failedResult, 2)).toEqual(
    expect.objectContaining({
      caseIndex: 2,
      verdict: 'wrong-answer',
      firstMismatch: 'result[0]: got 1, expected 0',
    })
  );
});

test('opens contextual tutoring with the exact failed case diagnostic', () => {
  const onExplainFailure = vi.fn();
  render(<TestResults results={[failedResult]} onExplainFailure={onExplainFailure} />);

  expect(screen.getByText('First mismatch')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /explain this failure/i }));

  expect(onExplainFailure).toHaveBeenCalledWith(
    expect.objectContaining({ firstMismatch: 'result[0]: got 1, expected 0' }),
    failedResult
  );
});

test('explains when the isolated runner is unavailable without blaming learner code', () => {
  const onExplainFailure = vi.fn();
  render(
    <TestResults
      results={[{
        passed: false,
        kind: 'runner-unavailable',
        input: '',
        expected: '',
        got: '',
        error: 'The secure JavaScript runner is unavailable in this browser. Your code was not executed.',
      }]}
      onExplainFailure={onExplainFailure}
    />
  );

  expect(screen.getByRole('status')).toHaveTextContent('Runner unavailable');
  expect(screen.getByText('Execution did not start')).toBeInTheDocument();
  expect(screen.getByText('Not run')).toBeInTheDocument();
  expect(screen.queryByText('Runtime Error')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /explain this failure/i })).not.toBeInTheDocument();
});
