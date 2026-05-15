/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'cheapest-flights-within-k-stops',
  title: 'Cheapest Flights Within K Stops',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(k * E)',
  spaceO: 'O(V + E)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return the cheapest price from src to dst with at most k stops, or -1 if no such route exists.',
  examples: [
    { input: 'n = 4, flights = [[0,1,100],[1,2,100],[2,3,200],[0,2,500]], src = 0, dst = 3, k = 1', output: '700' },
    { input: 'n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1', output: '200' },
  ],
  testCases: [
    { input: [4, [[0,1,100],[1,2,100],[2,3,200],[0,2,500]], 0, 3, 1], expected: 700 },
    { input: [3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1], expected: 200 },
    { input: [3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 0], expected: 500 },
  ],
  hints: [
    'A cheapest path with a stop limit is not a plain shortest-path problem.',
    'You need to track both current cost and how many edges have been used.',
    'Relax edges level by level for at most k + 1 flights.',
  ],
  pattern_explanation:
    'Bounded relaxation works because the stop limit caps path length, so each round only uses results from the previous number of flights.',
  solution: `function solve(n, flights, src, dst, k) {
  let prices = new Array(n).fill(Infinity);
  prices[src] = 0;

  for (let i = 0; i <= k; i++) {
    const next = prices.slice();

    for (const [u, v, w] of flights) {
      if (prices[u] === Infinity) continue;
      next[v] = Math.min(next[v], prices[u] + w);
    }

    prices = next;
  }

  return prices[dst] === Infinity ? -1 : prices[dst];
}`,
};
