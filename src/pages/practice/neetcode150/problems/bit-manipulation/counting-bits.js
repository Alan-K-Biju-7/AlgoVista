export default {
  id: 'counting-bits',
  title: 'Counting Bits',
  difficulty: 'Easy',
  pattern: 'Bit Manipulation',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'bit',
  concept: 'bit-manipulation',
  description:
    'Return an array where output[i] is the number of 1 bits in the binary representation of i.',
  examples: [
    { input: 'n = 2', output: '[0,1,1]' },
    { input: 'n = 5', output: '[0,1,1,2,1,2]' },
  ],
  testCases: [
    { input: [2], expected: [0,1,1] },
    { input: [5], expected: [0,1,1,2,1,2] },
    { input: [0], expected: [0] },
  ],
  hints: [
    'Removing the last bit of i is the same as shifting right by one.',
    'The dropped last bit contributes either 0 or 1.',
    'So the answer for i can be built from a smaller answer already computed.',
  ],
  pattern_explanation:
    'This uses a simple recurrence on bits: the count for i equals the count for i without its last bit, plus that last bit itself.',
  solution: `function solve(n) {
  const dp = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }

  return dp;
}`,
};
