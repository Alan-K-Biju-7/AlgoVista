export default {
  id: 'surrounded-regions',
  title: 'Surrounded Regions',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(rows * cols)',
  spaceO: 'O(rows * cols)',
  viz: 'grid-search',
  concept: 'graphs',
  description:
    'Capture all regions surrounded by X by flipping enclosed O cells to X.',
  examples: [
    { input: 'board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]', output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' },
    { input: 'board = [["X"]]', output: '[["X"]]' },
  ],
  testCases: [
    {
      input: [[['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']]],
      expected: [['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']]
    },
    { input: [[['X']]], expected: [['X']] },
  ],
  hints: [
    'Any O connected to the border cannot be captured.',
    'Mark all border-connected O cells first.',
    'Then flip unmarked O to X and restore the marked cells.',
  ],
  pattern_explanation:
    'This is border-reachability on a grid: protected cells are the O regions that remain connected to the boundary.',
  solution: `function solve(board) {
  const rows = board.length;
  const cols = board[0].length;

  function dfs(r, c) {
    if (
      r < 0 || c < 0 || r >= rows || c >= cols ||
      board[r][c] !== 'O'
    ) return;

    board[r][c] = 'T';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0);
    dfs(r, cols - 1);
  }

  for (let c = 0; c < cols; c++) {
    dfs(0, c);
    dfs(rows - 1, c);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'O') board[r][c] = 'X';
      else if (board[r][c] === 'T') board[r][c] = 'O';
    }
  }

  return board;
}`,
};
