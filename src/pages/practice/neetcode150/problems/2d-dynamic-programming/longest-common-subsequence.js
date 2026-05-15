/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'longest-common-subsequence',
  title: 'Longest Common Subsequence',
  difficulty: 'Medium',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(m * n)',
  spaceO: 'O(m * n)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the length of the longest common subsequence between two strings.',
  examples: [
    { input: 'text1 = "abcde", text2 = "ace"', output: '3' },
    { input: 'text1 = "abc", text2 = "abc"', output: '3' },
  ],
  testCases: [
    { input: ['abcde', 'ace'], expected: 3 },
    { input: ['abc', 'abc'], expected: 3 },
    { input: ['abc', 'def'], expected: 0 },
  ],
  hints: [
    'Each state depends on positions in both strings.',
    'If characters match, take 1 plus the diagonal state.',
    'Otherwise, take the best result from skipping one character from either string.',
  ],
  pattern_explanation:
    'This 2-D DP compares suffixes of two strings, storing the best subsequence length for every pair of starting indices.',
  solution: `function solve(text1, text2) {
  const dp = Array.from({ length: text1.length + 1 }, () =>
    new Array(text2.length + 1).fill(0)
  );

  for (let i = text1.length - 1; i >= 0; i--) {
    for (let j = text2.length - 1; j >= 0; j--) {
      if (text1[i] === text2[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  return dp[0][0];
}`,
};
