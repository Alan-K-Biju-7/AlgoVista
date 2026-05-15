/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'longest-increasing-path-in-a-matrix',
  title: 'Longest Increasing Path in a Matrix',
  difficulty: 'Hard',
  pattern: '2-D Dynamic Programming',
  timeO: 'O(m * n)',
  spaceO: 'O(m * n)',
  viz: 'grid-dp',
  concept: 'dynamic-programming',
  description:
    'Return the length of the longest strictly increasing path in the matrix.',
  examples: [
    { input: 'matrix = [[9,9,4],[6,6,8],[2,1,1]]', output: '4' },
    { input: 'matrix = [[3,4,5],[3,2,6],[2,2,1]]', output: '4' },
  ],
  testCases: [
    { input: [[[9,9,4],[6,6,8],[2,1,1]]], expected: 4 },
    { input: [[[3,4,5],[3,2,6],[2,2,1]]], expected: 4 },
    { input: [[[1]]], expected: 1 },
  ],
  hints: [
    'From each cell, you can move in four directions only to a larger value.',
    'A plain DFS repeats work across overlapping subproblems.',
    'Memoize the best path length starting from each cell.',
  ],
  pattern_explanation:
    'This is top-down grid DP because each cell’s answer depends on neighboring larger cells, and memoization prevents recomputation.',
  solution: `function solve(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  function dfs(r, c) {
    if (dp[r][c] !== 0) return dp[r][c];

    let best = 1;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        matrix[nr][nc] > matrix[r][c]
      ) {
        best = Math.max(best, 1 + dfs(nr, nc));
      }
    }

    dp[r][c] = best;
    return best;
  }

  let res = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      res = Math.max(res, dfs(r, c));
    }
  }

  return res;
}`,
};
