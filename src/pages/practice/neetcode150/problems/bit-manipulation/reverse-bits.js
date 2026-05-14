export default {
  id: 'reverse-bits',
  title: 'Reverse Bits',
  difficulty: 'Easy',
  pattern: 'Bit Manipulation',
  timeO: 'O(1)',
  spaceO: 'O(1)',
  viz: 'bit',
  concept: 'bit-manipulation',
  description:
    'Reverse the bits of a given 32-bit unsigned integer and return the resulting value.',
  examples: [
    { input: 'n = 43261596', output: '964176192' },
    { input: 'n = 4294967293', output: '3221225471' },
  ],
  testCases: [
    { input: [43261596], expected: 964176192 },
    { input: [4294967293], expected: 3221225471 },
  ],
  hints: [
    'Read the least significant bit repeatedly.',
    'Shift the result left before appending the next extracted bit.',
    'Because the input is fixed to 32 bits, repeat exactly 32 times.',
  ],
  pattern_explanation:
    'Bit reversal can be built incrementally by pulling bits from right to left in the input and pushing them leftward into the output.',
  solution: `function solve(n) {
  let res = 0;

  for (let i = 0; i < 32; i++) {
    res = (res << 1) | (n & 1);
    n = n >>> 1;
  }

  return res >>> 0;
}`,
};
