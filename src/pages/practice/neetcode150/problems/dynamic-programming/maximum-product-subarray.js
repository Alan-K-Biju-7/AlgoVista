export default {
  id: 'maximum-product-subarray',
  title: 'Maximum Product Subarray',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the maximum product of a contiguous subarray.',
  examples: [
    { input: 'nums = [2,3,-2,4]', output: '6' },
    { input: 'nums = [-2,0,-1]', output: '0' },
  ],
  testCases: [
    { input: [[2,3,-2,4]], expected: 6 },
    { input: [[-2,0,-1]], expected: 0 },
    { input: [[-2,3,-4]], expected: 24 },
  ],
  hints: [
    'A negative number can turn a small negative product into a large positive product.',
    'So you need both the best and worst product ending at each position.',
    'Update both values at every step and track the global maximum.',
  ],
  pattern_explanation:
    'This DP keeps the maximum and minimum product ending at each index because sign flips can reverse their roles.',
  solution: `function solve(nums) {
  let curMin = nums[0];
  let curMax = nums[0];
  let res = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const candidates = [num, curMax * num, curMin * num];
    curMax = Math.max(...candidates);
    curMin = Math.min(...candidates);
    res = Math.max(res, curMax);
  }

  return res;
}`,
};
