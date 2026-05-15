/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'climbing-stairs',
  title: 'Climbing Stairs',
  difficulty: 'Easy',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the number of distinct ways to reach the top if you can climb 1 or 2 steps at a time.',
  examples: [
    { input: 'n = 2', output: '2' },
    { input: 'n = 3', output: '3' },
  ],
  testCases: [
    { input: [2], expected: 2 },
    { input: [3], expected: 3 },
    { input: [5], expected: 8 },
  ],
  hints: [
    'To reach step i, you must come from step i - 1 or step i - 2.',
    'That means the answer follows a Fibonacci-like recurrence.',
    'You only need the previous two values at each step.',
  ],
  pattern_explanation:
    'This is 1-D DP because each position stores the number of ways to reach it based on smaller subproblems.',
  solution: `function solve(n) {
  if (n <= 2) return n;

  let one = 1;
  let two = 2;

  for (let i = 3; i <= n; i++) {
    const cur = one + two;
    one = two;
    two = cur;
  }

  return two;
}`,
};
