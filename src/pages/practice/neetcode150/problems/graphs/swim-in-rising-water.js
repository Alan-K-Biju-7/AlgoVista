/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'swim-in-rising-water',
  title: 'Swim in Rising Water',
  difficulty: 'Hard',
  pattern: 'Graphs',
  timeO: 'O(n^2 log n)',
  spaceO: 'O(n^2)',
  viz: 'grid-search',
  concept: 'graphs',
  description:
    'Return the minimum time until you can reach the bottom-right cell from the top-left cell.',
  examples: [
    { input: 'grid = [[0,2],[1,3]]', output: '3' },
    { input: 'grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]', output: '16' },
  ],
  testCases: [
    { input: [[[0,2],[1,3]]], expected: 3 },
    { input: [[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]], expected: 16 },
  ],
  hints: [
    'Reaching a cell costs the maximum elevation seen on the chosen path so far.',
    'You want the path that minimizes that maximum value.',
    'A min-heap can expand the currently best reachable state first.',
  ],
  pattern_explanation:
    'This is Dijkstra-style best-first search where path cost is defined by the maximum elevation encountered rather than a sum.',
  solution: `function solve(grid) {
  const n = grid.length;
  const seen = new Set(['0,0']);
  const heap = [[grid[0][0], 0, 0]];
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [t, r, c] = heap.shift();

    if (r === n - 1 && c === n - 1) return t;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      const key = nr + ',' + nc;

      if (
        nr < 0 || nc < 0 || nr >= n || nc >= n ||
        seen.has(key)
      ) continue;

      seen.add(key);
      heap.push([Math.max(t, grid[nr][nc]), nr, nc]);
    }
  }

  return -1;
}`,
};
