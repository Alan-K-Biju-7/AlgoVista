export default {
  id: 'rotting-oranges',
  title: 'Rotting Oranges',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(rows * cols)',
  spaceO: 'O(rows * cols)',
  viz: 'grid-search',
  concept: 'graphs',
  description:
    'Return the minimum minutes needed until no fresh orange remains, or -1 if impossible.',
  examples: [
    { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4' },
    { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1' },
  ],
  testCases: [
    { input: [[[2,1,1],[1,1,0],[0,1,1]]], expected: 4 },
    { input: [[[2,1,1],[0,1,1],[1,0,1]]], expected: -1 },
    { input: [[[0,2]]], expected: 0 },
  ],
  hints: [
    'All rotten oranges begin spreading at the same time.',
    'Put every initially rotten orange into the queue first.',
    'Each BFS level represents one minute of spread.',
  ],
  pattern_explanation:
    'Multi-source BFS models simultaneous spread from all rotten oranges, and traversal depth directly matches elapsed time.',
  solution: `function solve(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let fresh = 0;
  let minutes = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while (queue.length && fresh > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr < 0 || nc < 0 || nr >= rows || nc >= cols ||
          grid[nr][nc] !== 1
        ) continue;

        grid[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc]);
      }
    }
    minutes++;
  }

  return fresh === 0 ? minutes : -1;
}`,
};
