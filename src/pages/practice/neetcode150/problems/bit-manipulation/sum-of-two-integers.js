/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'sum-of-two-integers',
  title: 'Sum of Two Integers',
  difficulty: 'Medium',
  pattern: 'Bit Manipulation',
  timeO: 'O(1)',
  spaceO: 'O(1)',
  viz: 'bit',
  concept: 'bit-manipulation',
  description:
    'Return the sum of two integers without using the + or - operators.',
  examples: [
    { input: 'a = 1, b = 2', output: '3' },
    { input: 'a = 2, b = 3', output: '5' },
  ],
  testCases: [
    { input: [1, 2], expected: 3 },
    { input: [2, 3], expected: 5 },
    { input: [-1, 1], expected: 0 },
  ],
  hints: [
    'XOR adds bits without carrying.',
    'AND finds positions where a carry is needed.',
    'Shift the carry left and repeat until no carry remains.',
  ],
  pattern_explanation:
    'Bitwise addition works by separating sum-without-carry from carry generation, then folding the carry back in until the result stabilizes.',
  solution: `function solve(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
};
