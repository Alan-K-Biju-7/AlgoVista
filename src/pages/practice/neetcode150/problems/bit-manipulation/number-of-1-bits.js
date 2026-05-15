/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'number-of-1-bits',
  title: 'Number of 1 Bits',
  difficulty: 'Easy',
  pattern: 'Bit Manipulation',
  timeO: 'O(number of set bits)',
  spaceO: 'O(1)',
  viz: 'bit',
  concept: 'bit-manipulation',
  description:
    'Return the number of 1 bits in the binary representation of the unsigned integer.',
  examples: [
    { input: 'n = 11', output: '3' },
    { input: 'n = 128', output: '1' },
  ],
  testCases: [
    { input: [11], expected: 3 },
    { input: [128], expected: 1 },
    { input: [2147483645], expected: 30 },
  ],
  hints: [
    'Subtracting 1 flips the rightmost set bit to 0 and all lower bits to 1.',
    'Applying bitwise AND between n and n - 1 removes exactly one set bit.',
    'Repeat until the number becomes 0 and count the steps.',
  ],
  pattern_explanation:
    'The expression n & (n - 1) deletes the lowest set bit, so the loop runs once per 1-bit.',
  solution: `function solve(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`,
};
