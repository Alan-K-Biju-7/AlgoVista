export default {
  id: 'rotate-image',
  title: 'Rotate Image',
  difficulty: 'Medium',
  pattern: 'Math & Geometry',
  timeO: 'O(n^2)',
  spaceO: 'O(1)',
  viz: 'matrix',
  concept: 'math-and-geometry',
  description:
    'Rotate the n x n matrix by 90 degrees clockwise in place.',
  examples: [
    { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
    { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' },
  ],
  testCases: [
    { input: [[[1,2,3],[4,5,6],[7,8,9]]], expected: [[7,4,1],[8,5,2],[9,6,3]] },
    { input: [[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]], expected: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]] },
  ],
  hints: [
    'A clockwise rotation can be decomposed into two matrix operations.',
    'First transpose across the main diagonal.',
    'Then reverse each row.',
  ],
  pattern_explanation:
    'Transposing swaps rows and columns, and reversing rows completes the 90-degree clockwise rotation without extra matrix storage.',
  solution: `function solve(matrix) {
  const n = matrix.length;

  for (let r = 0; r < n; r++) {
    for (let c = r; c < n; c++) {
      [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];
    }
  }

  for (let r = 0; r < n; r++) {
    matrix[r].reverse();
  }

  return matrix;
}`,
};
