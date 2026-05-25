export default {
  id: 'target-sum',
  title: 'Target Sum',
  difficulty: 'Medium',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(n * sum(nums))',
  spaceO: 'O(n * sum(nums))',
  viz: 'dp',
  concept: '2d-dynamic-programming',
  description:
    'Return the number of different expressions that evaluate to the target by placing + or - before each number.',
  examples: [
    { input: 'nums = [1,1,1,1,1], target = 3', output: '5' },
    { input: 'nums = [1], target = 1', output: '1' },
  ],
  testCases: [
    { input: [[1,1,1,1,1], 3], expected: 5 },
    { input: [[1], 1], expected: 1 },
    { input: [[2,2,2], 2], expected: 3 },
  ],
  hints: [
    'At each number, you have two choices: add it or subtract it.',
    'That means each state branches into two next states.',
    'Memoize by index and current total to avoid recomputing subproblems.',
  ],
  pattern_explanation:
    'This DP counts ways across two state dimensions: position in the array and accumulated sum so far.',
  solution: `function solve(nums, target) {
  const memo = new Map();

  function dfs(i, total) {
    const key = i + ',' + total;
    if (memo.has(key)) return memo.get(key);

    if (i === nums.length) {
      return total === target ? 1 : 0;
    }

    const res =
      dfs(i + 1, total + nums[i]) +
      dfs(i + 1, total - nums[i]);

    memo.set(key, res);
    return res;
  }

  return dfs(0, 0);
}`,
};
