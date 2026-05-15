/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'combination-sum-ii',
  title: 'Combination Sum II',
  difficulty: 'Medium',
  pattern: 'Backtracking',
  timeO: 'Exponential',
  spaceO: 'O(n)',
  viz: 'recursion-tree',
  concept: 'backtracking',
  description:
    'Return all unique combinations where the chosen numbers sum to target. Each number may be used at most once.',
  examples: [
    { input: 'candidates = [10,1,2,7,6,1,5], target = 8', output: '[[1,1,6],[1,2,5],[1,7],[2,6]]' },
    { input: 'candidates = [2,5,2,1,2], target = 5', output: '[[1,2,2],[5]]' },
  ],
  testCases: [
    { input: [[10,1,2,7,6,1,5], 8], expected: [[1,1,6],[1,2,5],[1,7],[2,6]] },
    { input: [[2,5,2,1,2], 5], expected: [[1,2,2],[5]] },
  ],
  hints: [
    'Sort first so duplicates are next to each other.',
    'Each recursive call should move to the next index because numbers cannot be reused.',
    'Skip repeated values at the same depth to avoid duplicate combinations.',
  ],
  pattern_explanation:
    'Backtracking explores combinations in sorted order while skipping duplicate branches and preventing reuse of the same index.',
  solution: `function solve(candidates, target) {
  candidates = candidates.slice().sort((a, b) => a - b);
  const res = [];
  const path = [];

  function dfs(start, total) {
    if (total === target) {
      res.push(path.slice());
      return;
    }

    if (total > target) return;

    for (let i = start; i < candidates.length; i++) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;

      path.push(candidates[i]);
      dfs(i + 1, total + candidates[i]);
      path.pop();
    }
  }

  dfs(0, 0);
  return res;
}`,
};
