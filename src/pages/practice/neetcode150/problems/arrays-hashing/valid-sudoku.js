export default {
  id: 'valid-sudoku',
  title: 'Valid Sudoku',
  difficulty: 'Medium',
  pattern: 'Arrays & Hashing',
  timeO: 'O(1) (9x9 board)',
  spaceO: 'O(1)',
  viz: 'hashset',
  concept: 'arrays-hashing',
  description:
    'Given a 9x9 Sudoku board, determine if it is valid. Only filled cells need to be checked for the three rules: no duplicates in any row, column, or 3x3 box.',
  examples: [
    { input: 'board = [...]', output: 'true or false depending on the board' },
  ],
  testCases: [
    { input: [[
        ["5","3",".",".","7",".",".",".","."],
        ["6",".",".","1","9","5",".",".","."],
        [".","9","8",".",".",".",".","6","."],
        ["8",".",".",".","6",".",".",".","3"],
        ["4",".",".","8",".","3",".",".","1"],
        ["7",".",".",".","2",".",".",".","6"],
        [".","6",".",".",".",".","2","8","."],
        [".",".",".","4","1","9",".",".","5"],
        [".",".",".",".","8",".",".","7","9"]
      ]], expected: true },
  ],
  hints: [
    'Build three kinds of sets: rows, cols, boxes.',
    'Box index is Math.floor(r/3) * 3 + Math.floor(c/3).',
  ],
  pattern_explanation:
    'Encode each digit with the structure it belongs to and push into a set. A duplicate means invalid.',
  solution: `function solve(board) {
  const seen = new Set();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === '.') continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      const keys = [\`r\${r}:\${v}\`, \`c\${c}:\${v}\`, \`b\${b}:\${v}\`];
      for (const k of keys) {
        if (seen.has(k)) return false;
        seen.add(k);
      }
    }
  }
  return true;
}`,
};
