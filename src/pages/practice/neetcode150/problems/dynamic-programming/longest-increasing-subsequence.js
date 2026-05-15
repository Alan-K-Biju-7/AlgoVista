/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'longest-increasing-subsequence',
  title: 'Longest Increasing Subsequence',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n^2)',
  spaceO: 'O(n)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the length of the longest strictly increasing subsequence.',
  examples: [
    { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4' },
    { input: 'nums = [0,1,0,3,2,3]', output: '4' },
  ],
  testCases: [
    { input: [[10,9,2,5,3,7,101,18]], expected: 4 },
    { input: [[0,1,0,3,2,3]], expected: 4 },
    { input: [[7,7,7,7,7]], expected: 1 },
  ],
  hints: [
    'Let dp[i] be the LIS length starting at index i.',
    'From each index, try extending to every later larger value.',
    'The best answer is the maximum dp value over all starting positions.',
  ],
  pattern_explanation:
    'This DP compares each number with later numbers and builds the longest increasing subsequence length from smaller suffix subproblems.',
  solution: `function solve(nums) {
  const dp = new Array(nums.length).fill(1);

  for (let i = nums.length - 1; i >= 0; i--) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] < nums[j]) {
        dp[i] = Math.max(dp[i], 1 + dp[j]);
      }
    }
  }

  return Math.max(...dp);
}`,
};
