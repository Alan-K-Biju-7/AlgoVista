/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'n-queens',
  title: 'N-Queens',
  difficulty: 'Hard',
  pattern: 'Backtracking',
  timeO: 'Exponential',
  spaceO: 'O(n)',
  viz: 'grid-search',
  concept: 'backtracking',
  description:
    'Return all distinct solutions to the n-queens puzzle.',
  examples: [
    { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
    { input: 'n = 1', output: '[["Q"]]' },
  ],
  testCases: [
    { input: [4], expected: [['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']] },
    { input: [1], expected: [['Q']] },
  ],
  hints: [
    'Place one queen per row.',
    'Track blocked columns and diagonals.',
    'Backtrack immediately when a placement is unsafe.',
  ],
  pattern_explanation:
    'Backtracking explores board placements row by row, pruning any branch that creates an attacking queen pair.',
  solution: `function solve(n) {
  const res = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();

  function dfs(r) {
    if (r === n) {
      res.push(board.map((row) => row.join('')));
      return;
    }

    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;

      cols.add(c);
      diag1.add(r - c);
      diag2.add(r + c);
      board[r][c] = 'Q';

      dfs(r + 1);

      board[r][c] = '.';
      cols.delete(c);
      diag1.delete(r - c);
      diag2.delete(r + c);
    }
  }

  dfs(0);
  return res;
}`,
};
