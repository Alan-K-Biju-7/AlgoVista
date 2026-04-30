export default {
  id: 'search-a-2d-matrix',
  title: 'Search a 2D Matrix',
  difficulty: 'Medium',
  pattern: 'Binary Search',
  timeO: 'O(log(m * n))',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'binary-search',
  description:
    'Given a matrix with rows sorted and each row starting after the previous row ends, return true if target exists.',
  examples: [
    { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true' },
    { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', output: 'false' },
  ],
  testCases: [
    { input: [[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3], expected: true },
    { input: [[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13], expected: false },
    { input: [[[1]], 1], expected: true },
  ],
  hints: [
    'Think of the matrix as one long sorted array.',
    'Map a middle index back to row and column.',
    'Use normal binary search rules after that.',
  ],
  pattern_explanation:
    'The matrix ordering guarantees global sorted order across rows, so flattening by index preserves binary search.',
  solution: `function solve(matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let l = 0;
  let r = rows * cols - 1;

  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    const row = Math.floor(m / cols);
    const col = m % cols;
    const value = matrix[row][col];

    if (value === target) return true;
    if (value < target) l = m + 1;
    else r = m - 1;
  }

  return false;
}`,
};
