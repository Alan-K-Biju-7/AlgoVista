export default {
  id: 'house-robber-ii',
  title: 'House Robber II',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the maximum amount of money you can rob when houses are arranged in a circle.',
  examples: [
    { input: 'nums = [3,4,3]', output: '4' },
    { input: 'nums = [2,9,8,3,6]', output: '15' },
  ],
  testCases: [
    { input: [[3,4,3]], expected: 4 },
    { input: [[2,9,8,3,6]], expected: 15 },
    { input: [[1,2,3,1]], expected: 4 },
  ],
  hints: [
    'The first and last houses are adjacent now.',
    'That means you cannot include both in the same plan.',
    'Solve two linear subproblems and take the larger answer.',
  ],
  pattern_explanation:
    'The circular version reduces to two standard House Robber passes: one excluding the first house and one excluding the last.',
  solution: `function solve(nums) {
  if (nums.length === 1) return nums[0];

  function rob(arr) {
    let rob1 = 0;
    let rob2 = 0;

    for (const num of arr) {
      const next = Math.max(rob1 + num, rob2);
      rob1 = rob2;
      rob2 = next;
    }

    return rob2;
  }

  return Math.max(
    rob(nums.slice(0, nums.length - 1)),
    rob(nums.slice(1))
  );
}`,
};
