/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'number-of-islands',
  title: 'Number of Islands',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(rows * cols)',
  spaceO: 'O(rows * cols)',
  viz: 'grid-search',
  concept: 'graphs',
  description:
    'Return the number of islands in a 2D grid of land and water.',
  examples: [
    { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
    { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
  ],
  testCases: [
    {
      input: [[['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]],
      expected: 1
    },
    {
      input: [[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]],
      expected: 3
    }
  ],
  hints: [
    'Each unvisited land cell starts a new island.',
    'Use DFS or BFS to mark the whole island visited.',
    'Count how many times you need to start a new traversal.',
  ],
  pattern_explanation:
    'This is connected-components counting on a grid graph, where each DFS/BFS flood-fill marks one entire island.',
  solution: `function solve(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let islands = 0;

  function dfs(r, c) {
    if (
      r < 0 || c < 0 || r >= rows || c >= cols ||
      grid[r][c] !== '1'
    ) return;

    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islands++;
        dfs(r, c);
      }
    }
  }

  return islands;
}`,
};
