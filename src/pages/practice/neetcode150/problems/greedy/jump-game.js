/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'jump-game',
  title: 'Jump Game',
  difficulty: 'Medium',
  pattern: 'Greedy',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array',
  concept: 'greedy',
  description:
    'Return true if you can reach the last index starting from index 0.',
  examples: [
    { input: 'nums = [1,2,0,1,0]', output: 'true' },
    { input: 'nums = [1,2,1,0,1]', output: 'false' },
  ],
  testCases: [
    { input: [[1,2,0,1,0]], expected: true },
    { input: [[1,2,1,0,1]], expected: false },
    { input: [[2,3,1,1,4]], expected: true },
  ],
  hints: [
    'Think about which positions can reach the end.',
    'Start from the goal and move backward.',
    'If index i can reach the current goal, then i becomes the new goal.',
  ],
  pattern_explanation:
    'The greedy invariant is the leftmost position known to reach the end; scanning backward updates that target whenever a new position can reach it.',
  solution: `function solve(nums) {
  let goal = nums.length - 1;

  for (let i = nums.length - 2; i >= 0; i--) {
    if (i + nums[i] >= goal) {
      goal = i;
    }
  }

  return goal === 0;
}`,
};
