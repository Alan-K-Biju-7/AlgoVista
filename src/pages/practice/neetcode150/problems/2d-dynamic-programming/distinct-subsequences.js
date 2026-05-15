/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'distinct-subsequences',
  title: 'Distinct Subsequences',
  difficulty: 'Hard',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(m * n)',
  spaceO: 'O(m * n)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the number of distinct subsequences of s that equal t.',
  examples: [
    { input: 's = "rabbbit", t = "rabbit"', output: '3' },
    { input: 's = "babgbag", t = "bag"', output: '5' },
  ],
  testCases: [
    { input: ['rabbbit', 'rabbit'], expected: 3 },
    { input: ['babgbag', 'bag'], expected: 5 },
    { input: ['abc', 'abcd'], expected: 0 },
  ],
  hints: [
    'At each character in s, you can skip it or use it if it matches the next needed character in t.',
    'That creates two branches when characters match.',
    'Store answers for each pair of indices in s and t.',
  ],
  pattern_explanation:
    'This 2-D DP counts how many ways suffixes of s can form suffixes of t by combining skip and match transitions.',
  solution: `function solve(s, t) {
  const dp = Array.from({ length: s.length + 1 }, () =>
    new Array(t.length + 1).fill(0)
  );

  for (let i = 0; i <= s.length; i++) {
    dp[i][t.length] = 1;
  }

  for (let i = s.length - 1; i >= 0; i--) {
    for (let j = t.length - 1; j >= 0; j--) {
      dp[i][j] = dp[i + 1][j];
      if (s[i] === t[j]) {
        dp[i][j] += dp[i + 1][j + 1];
      }
    }
  }

  return dp[0][0];
}`,
};
