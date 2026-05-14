export default {
  id: 'single-number',
  title: 'Single Number',
  difficulty: 'Easy',
  pattern: 'Bit Manipulation',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array',
  concept: 'bit-manipulation',
  description:
    'Return the element that appears exactly once when every other element appears twice.',
  examples: [
    { input: 'nums = [2,2,1]', output: '1' },
    { input: 'nums = [4,1,2,1,2]', output: '4' },
  ],
  testCases: [
    { input: [[2,2,1]], expected: 1 },
    { input: [[4,1,2,1,2]], expected: 4 },
    { input: [[1]], expected: 1 },
  ],
  hints: [
    'XOR of a number with itself is 0.',
    'XOR of a number with 0 is the number itself.',
    'If you XOR the entire array, all duplicate pairs cancel out.',
  ],
  pattern_explanation:
    'Bitwise XOR is perfect here because pairs vanish, leaving only the value without a duplicate.',
  solution: `function solve(nums) {
  let res = 0;
  for (const num of nums) {
    res ^= num;
  }
  return res;
}`,
};
