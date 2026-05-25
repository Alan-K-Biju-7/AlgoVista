// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'regular-expression-matching',
  title: 'Regular Expression Matching',
  difficulty: 'Hard',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(m * n)',
  spaceO: 'O(m * n)',
  viz: 'dp',
  concept: '2d-dynamic-programming',
  description:
    'Return true if the entire string matches a pattern containing lowercase letters, dot, and star.',
  examples: [
    { input: 's = "aa", p = "a"', output: 'false' },
    { input: 's = "aa", p = "a*"', output: 'true' },
    { input: 's = "ab", p = ".*"', output: 'true' },
  ],
  testCases: [
    { input: ['aa', 'a'], expected: false },
    { input: ['aa', 'a*'], expected: true },
    { input: ['ab', '.*'], expected: true },
    { input: ['mississippi', 'mis*is*p*.'], expected: false },
  ],
  hints: [
    'Match the string and pattern from the front or back using subproblems.',
    'A dot matches any single character.',
    'A star can mean zero of the previous token or one more of it.',
  ],
  pattern_explanation:
    'The DP state asks whether suffix s[i:] matches suffix p[j:], with special branching when the next pattern token is star.',
  solution: `function solve(s, p) {
  const memo = new Map();

  function dp(i, j) {
    const key = i + ',' + j;
    if (memo.has(key)) return memo.get(key);
    if (j === p.length) return i === s.length;

    const firstMatches = i < s.length && (p[j] === s[i] || p[j] === '.');
    let ans;

    if (j + 1 < p.length && p[j + 1] === '*') {
      ans = dp(i, j + 2) || (firstMatches && dp(i + 1, j));
    } else {
      ans = firstMatches && dp(i + 1, j + 1);
    }

    memo.set(key, ans);
    return ans;
  }

  return dp(0, 0);
}`,
};
