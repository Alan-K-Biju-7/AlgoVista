/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'partition-equal-subset-sum',
  title: 'Partition Equal Subset Sum',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n * target)',
  spaceO: 'O(target)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return true if the array can be split into two subsets with equal sum.',
  examples: [
    { input: 'nums = [1,5,11,5]', output: 'true' },
    { input: 'nums = [1,2,3,5]', output: 'false' },
  ],
  testCases: [
    { input: [[1,5,11,5]], expected: true },
    { input: [[1,2,3,5]], expected: false },
    { input: [[2,2,1,1]], expected: true },
  ],
  hints: [
    'If the total sum is odd, the answer is immediately false.',
    'Otherwise, target one subset sum of total / 2.',
    'Track which sums are reachable as you process each number.',
  ],
  pattern_explanation:
    'This DP turns equal partition into a subset-sum reachability problem over sums up to half the total.',
  solution: `function solve(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;

  const target = total / 2;
  let dp = new Set([0]);

  for (let i = nums.length - 1; i >= 0; i--) {
    const next = new Set(dp);
    for (const sum of dp) {
      const newSum = sum + nums[i];
      if (newSum === target) return true;
      if (newSum < target) next.add(newSum);
    }
    dp = next;
  }

  return dp.has(target);
}`,
};
