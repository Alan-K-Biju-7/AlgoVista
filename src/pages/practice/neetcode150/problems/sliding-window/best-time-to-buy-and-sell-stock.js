export default {
  id: 'best-time-to-buy-and-sell-stock',
  title: 'Best Time to Buy and Sell Stock',
  difficulty: 'Easy',
  pattern: 'Sliding Window',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'sliding-window',
  description:
    'Choose one day to buy and one later day to sell in order to maximize profit.',
  examples: [
    { input: 'prices = [7,1,5,3,6,4]', output: '5' },
    { input: 'prices = [7,6,4,3,1]', output: '0' },
  ],
  testCases: [
    { input: [[7,1,5,3,6,4]], expected: 5 },
    { input: [[7,6,4,3,1]], expected: 0 },
    { input: [[2,4,1]], expected: 2 },
  ],
  hints: [
    'Track the cheapest buy price seen so far.',
    'At each day, ask what profit you would make by selling today.',
    'Update the best answer as you scan once.',
  ],
  pattern_explanation:
    'This uses a forward-moving window idea where the left side marks the best buy candidate and the right side tests current sell profit.',
  solution: `function solve(prices) {
  let minPrice = Infinity;
  let best = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    best = Math.max(best, price - minPrice);
  }

  return best;
}`,
};
