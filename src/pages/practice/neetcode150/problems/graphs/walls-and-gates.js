/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'walls-and-gates',
  title: 'Walls and Gates',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(rows * cols)',
  spaceO: 'O(rows * cols)',
  viz: 'grid-search',
  concept: 'graphs',
  description:
    'Fill each empty room with the distance to its nearest gate.',
  examples: [
    { input: 'rooms = [[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]', output: '[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]' },
    { input: 'rooms = [[-1]]', output: '[[-1]]' },
  ],
  testCases: [
    {
      input: [[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]],
      expected: [[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]
    },
    { input: [[[-1]]], expected: [[-1]] },
  ],
  hints: [
    'Starting BFS from every empty room is too expensive.',
    'Instead, start BFS from every gate at once.',
    'The first time you reach a room is its shortest distance to any gate.',
  ],
  pattern_explanation:
    'Multi-source BFS from all gates simultaneously guarantees the first assigned distance for each room is the nearest one.',
  solution: `function solve(rooms) {
  const rows = rooms.length;
  const cols = rooms[0].length;
  const queue = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === 0) queue.push([r, c]);
    }
  }

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while (queue.length) {
    const [r, c] = queue.shift();

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr < 0 || nc < 0 || nr >= rows || nc >= cols ||
        rooms[nr][nc] !== 2147483647
      ) continue;

      rooms[nr][nc] = rooms[r][c] + 1;
      queue.push([nr, nc]);
    }
  }

  return rooms;
}`,
};
