/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'spiral-matrix',
  title: 'Spiral Matrix',
  difficulty: 'Medium',
  pattern: 'Math & Geometry',
  timeO: 'O(m * n)',
  spaceO: 'O(1)',
  viz: 'matrix',
  concept: 'math-and-geometry',
  description:
    'Return all elements of the matrix in spiral order.',
  examples: [
    { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' },
    { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
  ],
  testCases: [
    { input: [[[1,2,3],[4,5,6],[7,8,9]]], expected: [1,2,3,6,9,8,7,4,5] },
    { input: [[[1,2,3,4],[5,6,7,8],[9,10,11,12]]], expected: [1,2,3,4,8,12,11,10,9,5,6,7] },
    { input: [[[1],[2],[3]]], expected: [1,2,3] },
  ],
  hints: [
    'Track the current top, bottom, left, and right boundaries.',
    'Traverse one side at a time, then shrink that boundary.',
    'After shrinking, check whether the boundaries still define a valid rectangle.',
  ],
  pattern_explanation:
    'A spiral traversal is just repeated perimeter traversal while the active rectangle shrinks inward after each side is processed.',
  solution: `function solve(matrix) {
  const res = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) {
      res.push(matrix[top][c]);
    }
    top++;

    for (let r = top; r <= bottom; r++) {
      res.push(matrix[r][right]);
    }
    right--;

    if (top <= bottom) {
      for (let c = right; c >= left; c--) {
        res.push(matrix[bottom][c]);
      }
      bottom--;
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r--) {
        res.push(matrix[r][left]);
      }
      left++;
    }
  }

  return res;
}`,
};
