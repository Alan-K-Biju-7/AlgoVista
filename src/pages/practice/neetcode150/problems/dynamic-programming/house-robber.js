export default {
  id: 'house-robber',
  title: 'House Robber',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the maximum amount of money you can rob without robbing two adjacent houses.',
  examples: [
    { input: 'nums = [1,2,3,1]', output: '4' },
    { input: 'nums = [2,7,9,3,1]', output: '12' },
  ],
  testCases: [
    { input: [[1,2,3,1]], expected: 4 },
    { input: [[2,7,9,3,1]], expected: 12 },
    { input: [[2,1,1,2]], expected: 4 },
  ],
  hints: [
    'At each house, choose between skipping it or robbing it.',
    'If you rob house i, you cannot use house i - 1.',
    'Track the best answer up to the previous house and the house before that.',
  ],
  pattern_explanation:
    'This is linear DP over houses, where each state is the best profit achievable up to that index.',
  solution: `function solve(nums) {
  let rob1 = 0;
  let rob2 = 0;

  for (const num of nums) {
    const newRob = Math.max(rob1 + num, rob2);
    rob1 = rob2;
    rob2 = newRob;
  }

  return rob2;
}`,
};
