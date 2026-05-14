export default {
  id: 'set-matrix-zeroes',
  title: 'Set Matrix Zeroes',
  difficulty: 'Medium',
  pattern: 'Math & Geometry',
  timeO: 'O(m * n)',
  spaceO: 'O(1)',
  viz: 'matrix',
  concept: 'math-and-geometry',
  description:
    'If an element is 0, set its entire row and column to 0 in place.',
  examples: [
    { input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]' },
    { input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]' },
  ],
  testCases: [
    { input: [[[1,1,1],[1,0,1],[1,1,1]]], expected: [[1,0,1],[0,0,0],[1,0,1]] },
    { input: [[[0,1,2,0],[3,4,5,2],[1,3,1,5]]], expected: [[0,0,0,0],[0,4,5,0],[0,3,1,0]] },
  ],
  hints: [
    'Using extra sets for rows and columns works, but the optimal solution reuses the matrix itself.',
    'Use the first row and first column as marker storage.',
    'Track separately whether the first row or first column originally contained a zero.',
  ],
  pattern_explanation:
    'The matrix can store its own row and column zero-markers in the first row and first column, giving an in-place constant-space solution.',
  solution: `function solve(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  let firstRowZero = false;
  let firstColZero = false;

  for (let r = 0; r < rows; r++) {
    if (matrix[r][0] === 0) firstColZero = true;
  }

  for (let c = 0; c < cols; c++) {
    if (matrix[0][c] === 0) firstRowZero = true;
  }

  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }

  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) {
        matrix[r][c] = 0;
      }
    }
  }

  if (firstRowZero) {
    for (let c = 0; c < cols; c++) matrix[0][c] = 0;
  }

  if (firstColZero) {
    for (let r = 0; r < rows; r++) matrix[r][0] = 0;
  }

  return matrix;
}`,
};
