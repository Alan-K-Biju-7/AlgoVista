export default {
  id: 'unique-paths',
  title: 'Unique Paths',
  difficulty: 'Medium',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(m * n)',
  spaceO: 'O(n)',
  viz: 'grid-dp',
  concept: '2d-dynamic-programming',
  description:
    'Return the number of unique paths from the top-left to the bottom-right of the grid.',
  examples: [
    { input: 'm = 3, n = 6', output: '21' },
    { input: 'm = 3, n = 3', output: '6' },
  ],
  testCases: [
    { input: [3, 6], expected: 21 },
    { input: [3, 3], expected: 6 },
    { input: [1, 5], expected: 1 },
  ],
  hints: [
    'You can only move right or down.',
    'So each cell depends only on the cell above and the cell to the left.',
    'A 1-D rolling DP array is enough because each row depends on the current row and the row below or above, depending on iteration direction.',
  ],
  pattern_explanation:
    'This grid DP builds the path count for each position from its neighboring subproblems, using repeated addition across rows and columns.',
  solution: `function solve(m, n) {
  let row = new Array(n).fill(1);

  for (let i = 0; i < m - 1; i++) {
    const newRow = new Array(n).fill(1);
    for (let j = n - 2; j >= 0; j--) {
      newRow[j] = newRow[j + 1] + row[j];
    }
    row = newRow;
  }

  return row[0];
}`,
};
