/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'min-cost-climbing-stairs',
  title: 'Min Cost Climbing Stairs',
  difficulty: 'Easy',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the minimum cost to reach the top of the floor.',
  examples: [
    { input: 'cost = [10,15,20]', output: '15' },
    { input: 'cost = [1,100,1,1,1,100,1,1,100,1]', output: '6' },
  ],
  testCases: [
    { input: [[10,15,20]], expected: 15 },
    { input: [[1,100,1,1,1,100,1,1,100,1]], expected: 6 },
  ],
  hints: [
    'To arrive at index i, you can come from i - 1 or i - 2.',
    'Store the cheapest cost to reach each step.',
    'The top can be reached from either of the last two steps.',
  ],
  pattern_explanation:
    'This DP tracks the minimum cumulative cost at each step using the two previous states.',
  solution: `function solve(cost) {
  let one = 0;
  let two = 0;

  for (let i = cost.length - 1; i >= 0; i--) {
    const cur = cost[i] + Math.min(one, two);
    two = one;
    one = cur;
  }

  return Math.min(one, two);
}`,
};
