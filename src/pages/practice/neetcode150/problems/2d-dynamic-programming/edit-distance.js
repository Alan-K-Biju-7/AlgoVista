/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'edit-distance',
  title: 'Edit Distance',
  difficulty: 'Medium',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(m * n)',
  spaceO: 'O(m * n)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the minimum number of operations required to convert word1 into word2.',
  examples: [
    { input: 'word1 = "horse", word2 = "ros"', output: '3' },
    { input: 'word1 = "intention", word2 = "execution"', output: '5' },
  ],
  testCases: [
    { input: ['horse', 'ros'], expected: 3 },
    { input: ['intention', 'execution'], expected: 5 },
    { input: ['', 'abc'], expected: 3 },
  ],
  hints: [
    'If characters match, move diagonally with no extra cost.',
    'If they differ, try insert, delete, and replace.',
    'Take the minimum of those three operations plus one.',
  ],
  pattern_explanation:
    'This 2-D DP computes the minimum transformation cost for every pair of suffixes from the two words.',
  solution: `function solve(word1, word2) {
  const dp = Array.from({ length: word1.length + 1 }, () =>
    new Array(word2.length + 1).fill(0)
  );

  for (let i = 0; i <= word1.length; i++) {
    dp[i][word2.length] = word1.length - i;
  }
  for (let j = 0; j <= word2.length; j++) {
    dp[word1.length][j] = word2.length - j;
  }

  for (let i = word1.length - 1; i >= 0; i--) {
    for (let j = word2.length - 1; j >= 0; j--) {
      if (word1[i] === word2[j]) {
        dp[i][j] = dp[i + 1][j + 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i + 1][j],
          dp[i][j + 1],
          dp[i + 1][j + 1]
        );
      }
    }
  }

  return dp[0][0];
}`,
};
