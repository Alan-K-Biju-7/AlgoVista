/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'max-area-of-island',
  title: 'Max Area of Island',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(rows * cols)',
  spaceO: 'O(rows * cols)',
  viz: 'grid-search',
  concept: 'graphs',
  description:
    'Return the maximum area of an island in a binary grid.',
  examples: [
    { input: 'grid = [[0,0,1,0,0],[1,1,1,0,1],[0,1,0,0,1],[0,0,0,1,1]]', output: '5' },
    { input: 'grid = [[0,0,0],[0,0,0],[0,0,0]]', output: '0' },
  ],
  testCases: [
    { input: [[[0,0,1,0,0],[1,1,1,0,1],[0,1,0,0,1],[0,0,0,1,1]]], expected: 5 },
    { input: [[[0,0,0],[0,0,0],[0,0,0]]], expected: 0 },
  ],
  hints: [
    'Start a traversal whenever you find unvisited land.',
    'Return the size of the connected component from DFS or BFS.',
    'Track the largest area seen across all islands.',
  ],
  pattern_explanation:
    'This is connected-component measurement on a grid, where each flood-fill returns the area of one island.',
  solution: `function solve(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let best = 0;

  function dfs(r, c) {
    if (
      r < 0 || c < 0 || r >= rows || c >= cols ||
      grid[r][c] !== 1
    ) return 0;

    grid[r][c] = 0;
    return (
      1 +
      dfs(r + 1, c) +
      dfs(r - 1, c) +
      dfs(r, c + 1) +
      dfs(r, c - 1)
    );
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        best = Math.max(best, dfs(r, c));
      }
    }
  }

  return best;
}`,
};
