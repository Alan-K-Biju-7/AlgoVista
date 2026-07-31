import { createClientTutorFallback, shouldUseClientTutorFallback } from './clientTutorFallback';

test('creates grounded browser guidance without exposing code or solutions', () => {
  const response = createClientTutorFallback({
    mode: 'debug',
    hintLevel: 1,
    context: {
      problem: { id: 'two-sum', title: 'Two Sum', solution: 'SECRET_SOLUTION' },
      execution: {
        firstMismatch: 'result[0]: got 1, expected 0',
        code: 'PRIVATE_CODE',
      },
    },
  });

  expect(response).toMatchObject({
    source: 'browser-fallback',
    degraded: true,
    tutor: { mode: 'debug', solutionRevealed: false, nextAction: 'inspect-state' },
    policy: { hiddenTestsRevealed: false, conversationRetained: false },
  });
  expect(response.tutor.message).toContain('result[0]');
  expect(JSON.stringify(response)).not.toMatch(/PRIVATE_CODE|SECRET_SOLUTION/);
});

test('falls back only for missing or unavailable backends', () => {
  expect(shouldUseClientTutorFallback(new TypeError('Failed to fetch'))).toBe(true);
  expect(shouldUseClientTutorFallback({ status: 404 })).toBe(true);
  expect(shouldUseClientTutorFallback({ status: 503 })).toBe(true);
  expect(shouldUseClientTutorFallback({ status: 400 })).toBe(false);
  expect(shouldUseClientTutorFallback({ status: 429 })).toBe(false);
});
