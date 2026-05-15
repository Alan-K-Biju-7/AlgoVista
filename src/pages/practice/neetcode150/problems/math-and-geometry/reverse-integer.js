export default {
  id: 'reverse-integer',
  title: 'Reverse Integer',
  difficulty: 'Medium',
  pattern: 'Math & Geometry',
  timeO: 'O(log(x))',
  spaceO: 'O(1)',
  viz: 'math',
  concept: 'math-and-geometry',
  description:
    'Reverse the digits of a signed 32-bit integer, returning 0 if the reversed value overflows.',
  examples: [
    { input: 'x = 123', output: '321' },
    { input: 'x = -123', output: '-321' },
  ],
  testCases: [
    { input: [123], expected: 321 },
    { input: [-123], expected: -321 },
    { input: [120], expected: 21 },
    { input: [1534236469], expected: 0 },
  ],
  hints: [
    'Pop the last digit with modulus and divide the number by 10 each step.',
    'Before pushing the next digit, check whether multiplying the current result by 10 would overflow.',
    'Handle positive and negative bounds separately because the 32-bit range is asymmetric.',
  ],
  pattern_explanation:
    'The solution builds the reversed number digit by digit while guarding every step against 32-bit signed overflow.',
  solution: `function solve(x) {
  const MAX = 2147483647;
  const MIN = -2147483648;
  let res = 0;

  while (x !== 0) {
    const digit = x % 10;
    x = x < 0 ? Math.ceil(x / 10) : Math.floor(x / 10);

    if (res > Math.floor(MAX / 10) || (res === Math.floor(MAX / 10) && digit > 7)) {
      return 0;
    }
    if (res < Math.ceil(MIN / 10) || (res === Math.ceil(MIN / 10) && digit < -8)) {
      return 0;
    }

    res = res * 10 + digit;
  }

  return res;
}`,
};
