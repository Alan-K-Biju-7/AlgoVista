// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'burst-balloons',
  title: 'Burst Balloons',
  difficulty: 'Hard',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(n^3)',
  spaceO: 'O(n^2)',
  viz: 'dp',
  concept: '2d-dynamic-programming',
  description:
    'Return the maximum coins you can collect by bursting balloons, where bursting i earns nums[left] * nums[i] * nums[right].',
  examples: [
    { input: 'nums = [3,1,5,8]', output: '167' },
    { input: 'nums = [1,5]', output: '10' },
  ],
  testCases: [
    { input: [[3,1,5,8]], expected: 167 },
    { input: [[1,5]], expected: 10 },
    { input: [[7]], expected: 7 },
  ],
  hints: [
    'Choosing the first balloon is hard because neighbors keep changing.',
    'Instead, choose the last balloon burst inside an interval.',
    'Then the interval splits into independent left and right subproblems.',
  ],
  pattern_explanation:
    'Interval DP works by fixing the last action in a range, which makes the two remaining sides independent.',
  solution: `function solve(nums) {
  const arr = [1, ...nums, 1];
  const n = arr.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let len = 2; len < n; len++) {
    for (let left = 0; left + len < n; left++) {
      const right = left + len;

      for (let mid = left + 1; mid < right; mid++) {
        const coins = arr[left] * arr[mid] * arr[right] + dp[left][mid] + dp[mid][right];
        dp[left][right] = Math.max(dp[left][right], coins);
      }
    }
  }

  return dp[0][n - 1];
}`,
};
