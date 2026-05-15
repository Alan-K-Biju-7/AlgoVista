/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'coin-change',
  title: 'Coin Change',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(amount * coins.length)',
  spaceO: 'O(amount)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the fewest number of coins needed to make up the exact amount, or -1 if impossible.',
  examples: [
    { input: 'coins = [1,2,5], amount = 11', output: '3' },
    { input: 'coins = [2], amount = 3', output: '-1' },
  ],
  testCases: [
    { input: [[1,2,5], 11], expected: 3 },
    { input: [[2], 3], expected: -1 },
    { input: [[1], 0], expected: 0 },
  ],
  hints: [
    'Build answers for smaller amounts first.',
    'For each amount, try taking each coin as the last coin used.',
    'If amount a - coin is solvable, then a may be solvable too.',
  ],
  pattern_explanation:
    'Bottom-up DP works because the minimum coins for a target amount depends on smaller amounts already computed.',
  solution: `function solve(coins, amount) {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (a - coin >= 0) {
        dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
      }
    }
  }

  return dp[amount] === amount + 1 ? -1 : dp[amount];
}`,
};
