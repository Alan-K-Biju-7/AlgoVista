/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'best-time-to-buy-and-sell-stock-with-cooldown',
  title: 'Best Time to Buy and Sell Stock with Cooldown',
  difficulty: 'Medium',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the maximum profit you can achieve with as many transactions as you like, with a one-day cooldown after each sale.',
  examples: [
    { input: 'prices = [1,2,3,0,2]', output: '3' },
    { input: 'prices = [1]', output: '0' },
  ],
  testCases: [
    { input: [[1,2,3,0,2]], expected: 3 },
    { input: [[1]], expected: 0 },
    { input: [[2,1,4]], expected: 3 },
  ],
  hints: [
    'At each day, the action choices depend on whether you are in a buy state or a sell state.',
    'Selling forces you to skip the next day.',
    'Memoize by day index and buy/hold state, or build the DP bottom-up.',
  ],
  pattern_explanation:
    'This DP tracks profit across two dimensions: time and transaction state, with cooldown changing the next valid transition.',
  solution: `function solve(prices) {
  const dp = new Map();

  function dfs(i, buying) {
    const key = i + ',' + buying;
    if (dp.has(key)) return dp.get(key);
    if (i >= prices.length) return 0;

    let cooldown = dfs(i + 1, buying);

    let res;
    if (buying) {
      const buy = dfs(i + 1, false) - prices[i];
      res = Math.max(buy, cooldown);
    } else {
      const sell = dfs(i + 2, true) + prices[i];
      res = Math.max(sell, cooldown);
    }

    dp.set(key, res);
    return res;
  }

  return dfs(0, true);
}`,
};
