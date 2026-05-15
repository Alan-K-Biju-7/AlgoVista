/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'coin-change-ii',
  title: 'Coin Change II',
  difficulty: 'Medium',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(amount * coins.length)',
  spaceO: 'O(amount)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the number of distinct combinations that make up the target amount.',
  examples: [
    { input: 'amount = 5, coins = [1,2,5]', output: '4' },
    { input: 'amount = 3, coins = [2]', output: '0' },
  ],
  testCases: [
    { input: [5, [1,2,5]], expected: 4 },
    { input: [3, [2]], expected: 0 },
    { input: [10, [10]], expected: 1 },
  ],
  hints: [
    'This asks for counting combinations, not minimizing coins.',
    'Process coins one at a time so order does not create duplicate combinations.',
    'Let dp[a] represent how many combinations can form amount a.',
  ],
  pattern_explanation:
    'This DP builds combination counts by deciding how many times each coin can contribute to each amount without counting different orders separately.',
  solution: `function solve(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      dp[a] += dp[a - coin];
    }
  }

  return dp[amount];
}`,
};
