/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'powx-n',
  title: 'Pow(x, n)',
  difficulty: 'Medium',
  pattern: 'Math & Geometry',
  timeO: 'O(log n)',
  spaceO: 'O(1)',
  viz: 'math',
  concept: 'math-and-geometry',
  description:
    'Implement a function that returns x raised to the power n.',
  examples: [
    { input: 'x = 2.0, n = 10', output: '1024.0' },
    { input: 'x = 2.0, n = -2', output: '0.25' },
  ],
  testCases: [
    { input: [2.0, 10], expected: 1024.0 },
    { input: [2.0, -2], expected: 0.25 },
    { input: [2.1, 3], expected: 9.261 },
  ],
  hints: [
    'If n is negative, invert x and make n positive.',
    'Repeated squaring lets you halve the exponent each step.',
    'When the current exponent bit is odd, multiply the answer by the current base.',
  ],
  pattern_explanation:
    'Binary exponentiation uses the binary form of the exponent so each squaring step halves the remaining work.',
  solution: `function solve(x, n) {
  let N = n;
  if (N < 0) {
    x = 1 / x;
    N = -N;
  }

  let result = 1;

  while (N > 0) {
    if (N % 2 === 1) result *= x;
    x *= x;
    N = Math.floor(N / 2);
  }

  return result;
}`,
};
