import { runTests } from './testRunner';

describe('runTests', () => {
  test('runs standard solve functions against multiple cases', () => {
    const results = runTests(
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
      runTests(
        `function isAnagram(s, t) {
          return s.split('').sort().join('') === t.split('').sort().join('');
        }`,
        [{ input: ['listen', 'silent'], expected: true }]
      )[0].passed
    ).toBe(true);

    expect(
      runTests(
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
    const results = runTests(
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
    const results = runTests(
      'function solve() { return 9.261000000000001; }',
      [{ input: [], expected: 9.261 }]
    );

    expect(results[0].passed).toBe(true);
  });

  test('allows learner comments and fenced JavaScript snippets', () => {
    const results = runTests(
      `\`\`\`javascript
# learner note
function solve(nums) {
  // another note
  return nums.length;
}
\`\`\``,
      [{ input: [[1, 2, 3]], expected: 3 }]
    );

    expect(results[0]).toEqual(expect.objectContaining({ passed: true }));
  });

  test('returns a clear message for pasted Python-style solutions', () => {
    const results = runTests(
      `class Codec:
  def serialize(self, root):
    return ""`,
      [{ input: [[]], expected: 'N' }]
    );

    expect(results[0]).toEqual(
      expect.objectContaining({
        passed: false,
        kind: 'unsupported-language',
        error: expect.stringContaining('Python-style code was detected'),
      })
    );
  });

  test('returns useful failures for syntax, missing function, and runtime errors', () => {
    expect(runTests('function solve(', [{ input: [], expected: null }])[0]).toEqual(
      expect.objectContaining({ passed: false, error: expect.stringContaining('Syntax error') })
    );

    expect(runTests('const value = 1;', [{ input: [], expected: null }])[0]).toEqual(
      expect.objectContaining({ passed: false, error: expect.stringContaining('Could not find') })
    );

    expect(runTests('function solve() { throw new Error("boom"); }', [{ input: [], expected: null }])[0]).toEqual(
      expect.objectContaining({ passed: false, error: 'boom' })
    );
  });
});
