export default {
  id: 'decode-ways',
  title: 'Decode Ways',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the number of ways to decode a string of digits into letters.',
  examples: [
    { input: 's = "12"', output: '2' },
    { input: 's = "226"', output: '3' },
  ],
  testCases: [
    { input: ['12'], expected: 2 },
    { input: ['226'], expected: 3 },
    { input: ['06'], expected: 0 },
  ],
  hints: [
    'A single nonzero digit can always form one letter.',
    'A two-digit number from 10 to 26 can also form one letter.',
    'Work backward and count valid decodings from each position.',
  ],
  pattern_explanation:
    'This 1-D DP counts how many valid decodings exist from each index using one-step and two-step transitions.',
  solution: `function solve(s) {
  let dp1 = 1;
  let dp2 = 0;

  for (let i = s.length - 1; i >= 0; i--) {
    let cur = 0;

    if (s[i] !== '0') {
      cur = dp1;
      if (
        i + 1 < s.length &&
        (s[i] === '1' || (s[i] === '2' && s[i + 1] <= '6'))
      ) {
        cur += dp2 || 1;
      }
    }

    dp2 = dp1;
    dp1 = cur;
  }

  return dp1;
}`,
};
