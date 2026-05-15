/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'maximum-subarray',
  title: 'Maximum Subarray',
  difficulty: 'Medium',
  pattern: 'Greedy',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array',
  concept: 'greedy',
  description:
    'Return the largest possible sum of a contiguous non-empty subarray.',
  examples: [
    { input: 'nums = [2,-3,4,-2,2,1,-1,4]', output: '8' },
    { input: 'nums = [-1]', output: '-1' },
  ],
  testCases: [
    { input: [[2,-3,4,-2,2,1,-1,4]], expected: 8 },
    { input: [[-1]], expected: -1 },
    { input: [[5,4,-1,7,8]], expected: 23 },
  ],
  hints: [
    'At each index, decide whether continuing the current subarray helps or hurts.',
    'If the running sum becomes worse than starting fresh, reset it.',
    'Track the best sum seen anywhere in the array.',
  ],
  pattern_explanation:
    'Kadane’s algorithm greedily keeps only the best subarray ending at the current position, which is enough to recover the global maximum.',
  solution: `function solve(nums) {
  let curSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    curSum = Math.max(nums[i], curSum + nums[i]);
    maxSum = Math.max(maxSum, curSum);
  }

  return maxSum;
}`,
};
