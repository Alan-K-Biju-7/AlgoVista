/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'missing-number',
  title: 'Missing Number',
  difficulty: 'Easy',
  pattern: 'Bit Manipulation',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array',
  concept: 'bit-manipulation',
  description:
    'Return the one missing number from the range [0, n].',
  examples: [
    { input: 'nums = [3,0,1]', output: '2' },
    { input: 'nums = [0,1]', output: '2' },
  ],
  testCases: [
    { input: [[3,0,1]], expected: 2 },
    { input: [[0,1]], expected: 2 },
    { input: [[9,6,4,2,3,5,7,0,1]], expected: 8 },
  ],
  hints: [
    'Each number from 0 to n should appear once.',
    'XOR all expected indices and all array values together.',
    'Pairs cancel, leaving only the missing value.',
  ],
  pattern_explanation:
    'XOR is ideal for pairing identical values away, so combining the full range with the array isolates the missing element.',
  solution: `function solve(nums) {
  let res = nums.length;

  for (let i = 0; i < nums.length; i++) {
    res ^= i ^ nums[i];
  }

  return res;
}`,
};
