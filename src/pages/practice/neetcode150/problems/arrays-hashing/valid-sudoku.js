export default {
  id: 'valid-sudoku',
  title: 'Valid Sudoku',
  difficulty: 'Medium',
  pattern: 'Arrays & Hashing',
  timeO: 'O(1)',
  spaceO: 'O(1)',
  viz: 'hashset',
  concept: 'arrays-hashing',
  description:
    'Determine if a partially filled 9x9 Sudoku board is valid.',
  examples: [
    { input: 'board = [...]', output: 'true' },
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
    'Track digits seen in rows, columns, and 3x3 boxes.',
  ],
  pattern_explanation:
    'Encode row, column, and box occupancy in sets. Any repeat breaks validity.',
  solution: `function solve(board) {
  const seen = new Set();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === '.') continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      const keys = [\`r\${r}-\${v}\`, \`c\${c}-\${v}\`, \`b\${b}-\${v}\`];
      for (const key of keys) {
        if (seen.has(key)) return false;
        seen.add(key);
      }
    }
  }
  return true;
}`,
};
