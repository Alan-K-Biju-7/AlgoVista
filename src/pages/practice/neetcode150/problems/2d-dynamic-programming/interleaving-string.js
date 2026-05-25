export default {
  id: 'interleaving-string',
  title: 'Interleaving String',
  difficulty: 'Medium',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(m * n)',
  spaceO: 'O(m * n)',
  viz: 'dp',
  concept: '2d-dynamic-programming',
  description:
    'Return true if s3 is formed by interleaving s1 and s2 while preserving the order of characters in each string.',
  examples: [
    { input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"', output: 'true' },
    { input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"', output: 'false' },
  ],
  testCases: [
    { input: ['aabcc', 'dbbca', 'aadbbcbcac'], expected: true },
    { input: ['aabcc', 'dbbca', 'aadbbbaccc'], expected: false },
    { input: ['', '', ''], expected: true },
  ],
  hints: [
    'If lengths do not add up, the answer is immediately false.',
    'A state is defined by how many characters have been used from s1 and s2.',
    'From each state, try consuming the next matching character from s1 or s2.',
  ],
  pattern_explanation:
    'This DP checks whether each pair of prefix lengths from s1 and s2 can form the corresponding prefix of s3.',
  solution: `function solve(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;

  const dp = Array.from({ length: s1.length + 1 }, () =>
    new Array(s2.length + 1).fill(false)
  );
  dp[s1.length][s2.length] = true;

  for (let i = s1.length; i >= 0; i--) {
    for (let j = s2.length; j >= 0; j--) {
      if (
        i < s1.length &&
        s1[i] === s3[i + j] &&
        dp[i + 1][j]
      ) {
        dp[i][j] = true;
      }
      if (
        j < s2.length &&
        s2[j] === s3[i + j] &&
        dp[i][j + 1]
      ) {
        dp[i][j] = true;
      }
    }
  }

  return dp[0][0];
}`,
};
