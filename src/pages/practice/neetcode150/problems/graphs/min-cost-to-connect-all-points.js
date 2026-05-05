export default {
  id: 'min-cost-to-connect-all-points',
  title: 'Min Cost to Connect All Points',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(n^2)',
  spaceO: 'O(n)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return the minimum cost to connect all points where edge cost is Manhattan distance.',
  examples: [
    { input: 'points = [[0,0],[2,2],[3,10],[5,2],[7,0]]', output: '20' },
    { input: 'points = [[3,12],[-2,5],[-4,1]]', output: '18' },
  ],
  testCases: [
    { input: [[[0,0],[2,2],[3,10],[5,2],[7,0]]], expected: 20 },
    { input: [[[3,12],[-2,5],[-4,1]]], expected: 18 },
  ],
  hints: [
    'You need the cheapest way to connect all nodes without cycles.',
    'That is exactly a minimum spanning tree problem.',
    'Prim’s algorithm can grow the tree one cheapest outside edge at a time.',
  ],
  pattern_explanation:
    'A minimum spanning tree connects every point with minimum total edge weight, and Prim’s algorithm builds it greedily.',
  solution: `function solve(points) {
  const n = points.length;
  const used = new Array(n).fill(false);
  const minDist = new Array(n).fill(Infinity);
  minDist[0] = 0;
  let cost = 0;

  for (let i = 0; i < n; i++) {
    let cur = -1;
    for (let j = 0; j < n; j++) {
      if (!used[j] && (cur === -1 || minDist[j] < minDist[cur])) cur = j;
    }

    used[cur] = true;
    cost += minDist[cur];

    for (let j = 0; j < n; j++) {
      if (!used[j]) {
        const dist =
          Math.abs(points[cur][0] - points[j][0]) +
          Math.abs(points[cur][1] - points[j][1]);
        minDist[j] = Math.min(minDist[j], dist);
      }
    }
  }

  return cost;
}`,
};
