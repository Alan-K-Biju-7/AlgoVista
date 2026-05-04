export default {
  id: 'word-search',
  title: 'Word Search',
  difficulty: 'Medium',
  pattern: 'Backtracking',
  timeO: 'O(rows * cols * 4^L)',
  spaceO: 'O(L)',
  viz: 'grid-search',
  concept: 'backtracking',
  description:
    'Return true if the word exists in the board by moving horizontally or vertically without reusing a cell.',
  examples: [
    { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
    { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false' },
  ],
  testCases: [
    {
      input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'ABCCED'],
      expected: true
    },
    {
      input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'SEE'],
      expected: true
    },
    {
      input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'ABCB'],
      expected: false
    }
  ],
  hints: [
    'Try each cell as a possible starting point.',
    'Mark a cell as visited while it is on the current path.',
    'Undo that visit mark when backing out of the recursive call.',
  ],
  pattern_explanation:
    'This is DFS backtracking on a grid: build a path character by character, reject invalid moves early, and undo visited marks on return.',
  solution: `function solve(board, word) {
  const rows = board.length;
  const cols = board[0].length;

  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (
      r < 0 || c < 0 || r >= rows || c >= cols ||
      board[r][c] !== word[i]
    ) return false;

    const temp = board[r][c];
    board[r][c] = '#';

    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);

    board[r][c] = temp;
    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }

  return false;
}`,
};
