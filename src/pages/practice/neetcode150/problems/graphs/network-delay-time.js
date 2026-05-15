/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'network-delay-time',
  title: 'Network Delay Time',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O((V + E) log V)',
  spaceO: 'O(V + E)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return the minimum time needed for a signal from node k to reach all nodes, or -1 if impossible.',
  examples: [
    { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2' },
    { input: 'times = [[1,2,1]], n = 2, k = 1', output: '1' },
  ],
  testCases: [
    { input: [[[2,1,1],[2,3,1],[3,4,1]], 4, 2], expected: 2 },
    { input: [[[1,2,1]], 2, 1], expected: 1 },
    { input: [[[1,2,1]], 2, 2], expected: -1 },
  ],
  hints: [
    'You need the shortest time from one source to every node.',
    'That is a weighted single-source shortest-path problem.',
    'Use Dijkstra with a min-heap ordered by current arrival time.',
  ],
  pattern_explanation:
    'Dijkstra’s algorithm expands the next currently cheapest reachable node, producing shortest travel times in graphs with nonnegative weights.',
  solution: `function solve(times, n, k) {
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) graph[u].push([v, w]);

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = [[0, k]];

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [time, node] = heap.shift();
    if (time > dist[node]) continue;

    for (const [nei, w] of graph[node]) {
      const next = time + w;
      if (next < dist[nei]) {
        dist[nei] = next;
        heap.push([next, nei]);
      }
    }
  }

  let ans = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    ans = Math.max(ans, dist[i]);
  }
  return ans;
}`,
};
