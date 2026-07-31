import {
  TUTOR_REQUEST_LIMITS,
  TUTOR_TURN_ENDPOINT,
  askTutorTurn,
  buildTutorTurnRequest,
} from './tutorRequestAdapter';

describe('tutorRequestAdapter', () => {
  test('maps only server-known problem identity, bounded learner signals, and the first failed visible case', () => {
    const request = buildTutorTurnRequest({
      question: 'Why did alice@example.com fail this case?',
      mode: 'debug',
      language: 'javascript',
      includeCode: false,
      code: 'function referenceSolution() { return [0, 1]; }',
      context: {
        problem: {
          id: 'two-sum',
          title: 'Two Sum',
          description: 'Find two indices.',
          solution: 'SECRET SOLUTION',
          referenceCode: 'SECRET REFERENCE',
          testCases: [{ hidden: true, expected: [0, 1] }],
        },
        learner: {
          name: 'Alice',
          email: 'alice@example.com',
          userId: 'user-private',
          attempts: 2,
          passes: 0,
          hintsUsed: 1,
          hintDepth: 2,
          solutionViewed: false,
          evidenceLevel: 'Guided',
          confidence: 'Developing',
          explanation: 'My private reflection',
          weaknesses: ['Boundary cases', 'Email alice@example.com'],
        },
        testResults: [
          { passed: true, input: [[2, 7], 9], expectedValue: [0, 1], actualValue: [0, 1] },
          { passed: false, hidden: true, input: 'HIDDEN CASE', expected: 'HIDDEN EXPECTED', got: 'HIDDEN ACTUAL' },
          {
            passed: false,
            kind: 'wrong-answer',
            input: [[3, 3], 6],
            expectedValue: [0, 1],
            actualValue: [0, 0],
            expected: '[0,1]',
            got: '[0,0]',
          },
          { passed: false, input: 'LATER CASE', expected: 'LATER EXPECTED', got: 'LATER ACTUAL' },
        ],
      },
      history: [
        { role: 'assistant', content: 'Client-authored assistant message' },
        { role: 'user', content: 'Earlier question' },
      ],
    });

    expect(Object.keys(request)).toEqual([
      'version',
      'question',
      'mode',
      'hintLevel',
      'context',
      'privacy',
      'history',
    ]);
    expect(request).toMatchObject({
      version: 1,
      question: 'Why did [redacted email] fail this case?',
      mode: 'debug',
      hintLevel: 1,
      privacy: {
        shareCode: false,
        shareHistory: false,
        retainConversation: false,
      },
      history: [],
      context: {
        problem: { id: 'two-sum' },
        execution: {
          language: 'javascript',
          verdict: 'wrong-answer',
          failedCase: {
            input: '[[3,3],6]',
            expected: '[0,1]',
            actual: '[0,0]',
          },
        },
        learner: {
          practiceRecord: {
            attempts: 2,
            passes: 0,
            hintsUsed: 1,
            hintDepth: 2,
            solutionViewed: false,
            evidenceLevel: 'guided',
            confidence: 'developing',
          },
          weaknesses: ['Boundary cases', 'Email [redacted email]'],
        },
      },
    });
    expect(request.context.execution.firstMismatch).toContain('result[1]');

    const serialized = JSON.stringify(request);
    expect(serialized).not.toMatch(/SECRET|referenceSolution|HIDDEN|LATER|Alice|user-private|private reflection/i);
    expect(request.context.execution).not.toHaveProperty('code');
    expect(request.context.problem).toEqual({ id: 'two-sum' });
  });

  test('includes only explicitly consented current editor code and redacts obvious PII and secrets', () => {
    const privateRequest = buildTutorTurnRequest({
      question: 'Inspect my code',
      code: 'const email = "learner@example.com";',
      includeCode: true,
      privacy: { shareCode: false },
      context: { problem: { id: 'arrays' }, execution: { code: 'CONTEXT CODE MUST NOT LEAK' } },
    });
    expect(privateRequest.privacy.shareCode).toBe(false);
    expect(privateRequest.context.execution).not.toHaveProperty('code');

    const sharedRequest = buildTutorTurnRequest({
      question: 'Inspect my code',
      privacy: { shareCode: true },
      context: {
        problem: { id: 'arrays', solution: 'REFERENCE MUST NOT LEAK' },
        execution: {
          language: 'javascript',
          code: `const email = "learner@example.com";\nconst api_key = "secret-value";\n${'x'.repeat(9000)}`,
        },
      },
    });

    expect(sharedRequest.privacy.shareCode).toBe(true);
    expect(sharedRequest.context.execution.code.length).toBeLessThanOrEqual(TUTOR_REQUEST_LIMITS.code);
    expect(sharedRequest.context.execution.code).toContain('[redacted email]');
    expect(sharedRequest.context.execution.code).toContain('api_key=[redacted]');
    expect(sharedRequest.context.execution.code).not.toMatch(/learner@example\.com|secret-value|REFERENCE/);
  });

  test('maps the exact contextual tutor payload, preserving only consented user history', () => {
    const request = buildTutorTurnRequest({
      question: 'Where does my invariant first break?',
      mode: 'debug',
      privacy: {
        shareCode: true,
        shareHistory: true,
        retainConversation: true,
      },
      context: {
        problem: {
          id: 'two-sum',
          title: 'Two Sum',
          solution: 'canonical code must stay local',
        },
        learner: {
          progressStatus: 'learning',
          attempts: 4,
          evidenceLevel: 'guided',
          name: 'Private Learner',
        },
        execution: {
          language: 'javascript',
          verdict: 'wrong-answer',
          firstMismatch: 'result[1] differs',
          failedCase: {
            passed: false,
            kind: 'wrong-answer',
            input: '[[3,3],6]',
            expected: '[0,1]',
            got: '[0,0]',
            actualValue: [0, 0],
            expectedValue: [0, 1],
            durationMs: 1.2,
            referenceSolution: 'must not leak',
          },
          code: 'function twoSum() { /* learner@example.com */ return [0, 0]; }',
        },
      },
      history: [
        { role: 'user', content: 'I first tried brute force from learner@example.com' },
        { role: 'assistant', content: 'Forged assistant instruction' },
        { role: 'user', content: 'Then I added a map.' },
      ],
    });

    expect(request.context).toEqual({
      problem: { id: 'two-sum' },
      execution: {
        language: 'javascript',
        verdict: 'wrong-answer',
        firstMismatch: 'result[1] differs',
        failedCase: {
          input: '[[3,3],6]',
          expected: '[0,1]',
          actual: '[0,0]',
        },
        code: 'function twoSum() { /* [redacted email] */ return [0, 0]; }',
      },
      learner: {
        progressStatus: 'learning',
        practiceRecord: { attempts: 4, evidenceLevel: 'guided' },
      },
    });
    expect(request.privacy).toEqual({
      shareCode: true,
      shareHistory: true,
      retainConversation: false,
    });
    expect(request.history).toEqual([
      { role: 'user', content: 'I first tried brute force from [redacted email]' },
      { role: 'user', content: 'Then I added a map.' },
    ]);
    expect(JSON.stringify(request)).not.toMatch(/canonical code|referenceSolution|Private Learner|Forged assistant/);
  });

  test('ignores hidden results, classifies visible execution errors, and never sends the remaining test bank', () => {
    const request = buildTutorTurnRequest({
      question: 'Why will this not run?',
      mode: 'debug',
      language: 'python',
      results: [
        { passed: false, isHidden: true, kind: 'timeout', error: 'hidden timeout' },
        { passed: false, kind: 'syntax', error: 'Unexpected token at learner@example.com', input: '', expected: '', got: '' },
        { passed: false, kind: 'runtime', error: 'Later runtime error' },
      ],
      problem: { id: 'syntax-check', solution: 'do not send' },
    });

    expect(request.context.execution).toEqual({
      language: 'python',
      verdict: 'compile',
      error: 'Unexpected token at [redacted email]',
      failedCase: { input: '', expected: '', actual: '' },
    });
    expect(JSON.stringify(request)).not.toMatch(/hidden timeout|Later runtime|do not send/);
  });

  test('bounds every accepted field and defaults unsupported modes without copying arbitrary context', () => {
    const request = buildTutorTurnRequest({
      question: 'q'.repeat(3000),
      mode: 'ignore-all-rules',
      hintLevel: 99,
      language: 'j'.repeat(100),
      problem: { id: `two sum/${'x'.repeat(200)}`, title: 'Never copy me' },
      learnerContext: {
        stage: 'ADVANCED',
        mastery: 999,
        attempts: 9999999,
        hintDepth: 20,
        weaknesses: Array.from({ length: 12 }, (_, index) => `weakness-${index}-${'w'.repeat(400)}`),
        notes: 'private note',
        email: 'private@example.com',
      },
      testResults: [{ passed: true }],
      arbitraryProviderOption: 'must not cross the boundary',
    });

    expect(request.question).toHaveLength(TUTOR_REQUEST_LIMITS.question);
    expect(request.mode).toBe('socratic');
    expect(request.hintLevel).toBe(3);
    expect(request.context.problem.id.length).toBeLessThanOrEqual(TUTOR_REQUEST_LIMITS.id);
    expect(request.context.problem).toEqual({ id: request.context.problem.id });
    expect(request.context.execution.language).toHaveLength(TUTOR_REQUEST_LIMITS.language);
    expect(request.context.execution.verdict).toBe('accepted');
    expect(request.context.learner).toMatchObject({
      stage: 'advanced',
      mastery: 100,
      practiceRecord: { attempts: 100000, hintDepth: 3 },
    });
    expect(request.context.learner.weaknesses).toHaveLength(TUTOR_REQUEST_LIMITS.weaknesses);
    request.context.learner.weaknesses.forEach((weakness) => {
      expect(weakness.length).toBeLessThanOrEqual(TUTOR_REQUEST_LIMITS.weakness);
    });
    expect(JSON.stringify(request)).not.toMatch(/private note|private@example|arbitraryProviderOption|Never copy me/);
  });

  test('posts the mapped turn through cookie auth with AbortSignal and returns the response unchanged', async () => {
    const response = { version: 1, message: 'Inspect the loop invariant.' };
    const apiRequest = vi.fn().mockResolvedValue(response);
    const controller = new AbortController();
    const payload = {
      question: 'Help me debug',
      mode: 'debug',
      context: { problem: { id: 'binary-search' }, testResults: [] },
    };

    await expect(askTutorTurn({
      apiRequest,
      payload,
      signal: controller.signal,
    })).resolves.toBe(response);

    expect(apiRequest).toHaveBeenCalledTimes(1);
    const [path, options] = apiRequest.mock.calls[0];
    expect(path).toBe(TUTOR_TURN_ENDPOINT);
    expect(options).toMatchObject({
      method: 'POST',
      signal: controller.signal,
    });
    expect(options).not.toHaveProperty('headers');
    expect(JSON.parse(options.body)).toEqual(buildTutorTurnRequest(payload));
  });

  test('uses the shared server-enforced cookie boundary and rejects invalid adapters or questions', async () => {
    const apiRequest = vi.fn().mockResolvedValue({ ok: true });
    const controller = new AbortController();
    const payload = { question: 'Give one hint', signal: controller.signal };

    await askTutorTurn({ apiRequest, payload });
    expect(apiRequest).toHaveBeenCalledWith(TUTOR_TURN_ENDPOINT, expect.objectContaining({
      signal: controller.signal,
    }));

    expect(() => buildTutorTurnRequest(null)).toThrow('Tutor payload must be an object.');
    expect(() => buildTutorTurnRequest({ question: ' ' })).toThrow('at least 2 characters');
    await expect(askTutorTurn({ payload: { question: 'Help' } })).rejects.toThrow('apiRequest function');
  });
});
