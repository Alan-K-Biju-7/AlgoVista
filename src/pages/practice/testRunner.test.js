import { evaluateTrustedReferenceSolution } from '../../test-support/trustedSolutionEvaluator';
import { runTestsAsync } from './testRunner';

describe('trusted catalog validation helper', () => {
  test('runs standard solve functions against multiple cases', () => {
    const results = evaluateTrustedReferenceSolution(
      `function solve(nums, target) {
        const seen = new Map();
        for (let i = 0; i < nums.length; i++) {
          const need = target - nums[i];
          if (seen.has(need)) return [seen.get(need), i];
          seen.set(nums[i], i);
        }
        return [];
      }`,
      [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] },
      ]
    );

    expect(results).toHaveLength(2);
    expect(results.every((result) => result.passed)).toBe(true);
  });

  test('discovers non-solve function declarations and arrow functions', () => {
    expect(
      evaluateTrustedReferenceSolution(
        `function isAnagram(s, t) {
          return s.split('').sort().join('') === t.split('').sort().join('');
        }`,
        [{ input: ['listen', 'silent'], expected: true }]
      )[0].passed
    ).toBe(true);

    expect(
      evaluateTrustedReferenceSolution(
        `const maxProfit = (prices) => {
          let min = Infinity;
          let best = 0;
          for (const price of prices) {
            min = Math.min(min, price);
            best = Math.max(best, price - min);
          }
          return best;
        }`,
        [{ input: [[7, 1, 5, 3, 6, 4]], expected: 5 }]
      )[0].passed
    ).toBe(true);
  });

  test('accepts in-place solutions that return undefined', () => {
    const results = evaluateTrustedReferenceSolution(
      `function sortColors(nums) {
        let low = 0;
        let mid = 0;
        let high = nums.length - 1;
        while (mid <= high) {
          if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
          } else if (nums[mid] === 2) {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
          } else {
            mid++;
          }
        }
      }`,
      [{ input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] }]
    );

    expect(results).toEqual([
      expect.objectContaining({
        passed: true,
        got: '[0,0,1,1,2,2]',
      }),
    ]);
  });

  test('compares floating point numeric answers with a small tolerance', () => {
    const results = evaluateTrustedReferenceSolution(
      'function solve() { return 9.261000000000001; }',
      [{ input: [], expected: 9.261 }]
    );

    expect(results[0].passed).toBe(true);
  });

  test('returns useful failures for syntax, missing function, and runtime errors', () => {
    expect(evaluateTrustedReferenceSolution('function solve(', [{ input: [], expected: null }])[0]).toEqual(
      expect.objectContaining({ passed: false, error: expect.stringContaining('Syntax error') })
    );

    expect(evaluateTrustedReferenceSolution('const value = 1;', [{ input: [], expected: null }])[0]).toEqual(
      expect.objectContaining({ passed: false, error: expect.stringContaining('Could not find') })
    );

    expect(evaluateTrustedReferenceSolution('function solve() { throw new Error("boom"); }', [{ input: [], expected: null }])[0]).toEqual(
      expect.objectContaining({ passed: false, error: 'boom' })
    );
  });

  test('fails closed without executing learner code when workers are unavailable', async () => {
    const previousWorker = global.Worker;
    global.Worker = undefined;
    try {
      const results = await runTestsAsync(
        'function solve(nums) { return nums.length; }',
        [{ input: [[1, 2, 3]], expected: 3 }]
      );
      expect(results[0]).toEqual(expect.objectContaining({
        passed: false,
        kind: 'runner-unavailable',
        error: expect.stringContaining('was not executed'),
      }));
    } finally {
      global.Worker = previousWorker;
    }
  });

  test('terminates a stalled worker and returns a timeout diagnostic', async () => {
    vi.useFakeTimers();
    const previousWorker = global.Worker;
    const terminate = vi.fn();
    global.Worker = class StalledWorker {
      constructor() {
        this.terminate = terminate;
      }

      postMessage(message) {
        this.onmessage?.({
          data: {
            protocol: 'algovista-runner-v1',
            requestId: message.requestId,
            event: 'case-started',
            caseIndex: 1,
            testSuiteSize: 2,
            input: '[[99]]',
            expected: '99',
          },
        });
      }
    };

    try {
      const pending = runTestsAsync(
        'function solve() { while (true) {} }',
        [{ input: [[]], expected: 0 }, { input: [[99]], expected: 99 }],
        { timeoutMs: 25 }
      );
      vi.advanceTimersByTime(25);
      const results = await pending;
      expect(results[0]).toEqual(expect.objectContaining({
        passed: false,
        kind: 'timeout',
        caseIndex: 1,
        input: '[[99]]',
        expected: '99',
        error: expect.stringContaining('case 2'),
      }));
      expect(terminate).toHaveBeenCalledTimes(1);
    } finally {
      global.Worker = previousWorker;
      vi.useRealTimers();
    }
  });
});

describe('isolated learner runner', () => {
  test('returns a clear message for pasted Python-style solutions without creating a worker', async () => {
    const WorkerSpy = vi.fn();
    const previousWorker = global.Worker;
    global.Worker = WorkerSpy;
    try {
      const results = await runTestsAsync(
        `class Codec:\n  def serialize(self, root):\n    return ""`,
        [{ input: [[]], expected: 'N' }]
      );
      expect(results[0]).toEqual(expect.objectContaining({
        passed: false,
        kind: 'unsupported-language',
        error: expect.stringContaining('Python-style code was detected'),
      }));
      expect(WorkerSpy).not.toHaveBeenCalled();
    } finally {
      global.Worker = previousWorker;
    }
  });

  test('blocks dynamic imports before learner code reaches the worker', async () => {
    const WorkerSpy = vi.fn();
    const previousWorker = global.Worker;
    global.Worker = WorkerSpy;
    try {
      const results = await runTestsAsync(
        `async function solve() { return import('https://example.com/code.js'); }`,
        [{ input: [], expected: null }]
      );
      expect(results[0]).toEqual(expect.objectContaining({
        passed: false,
        kind: 'unsupported-runtime-api',
      }));
      expect(WorkerSpy).not.toHaveBeenCalled();
    } finally {
      global.Worker = previousWorker;
    }
  });
});
