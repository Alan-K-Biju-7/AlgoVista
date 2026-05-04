export default {
  id: 'combination-sum',
  title: 'Combination Sum',
  difficulty: 'Medium',
  pattern: 'Backtracking',
  timeO: 'Exponential',
  spaceO: 'O(target)',
  viz: 'recursion-tree',
  concept: 'backtracking',
  description:
    'Return all unique combinations of candidates where the chosen numbers sum to target. You may reuse the same number unlimited times.',
  examples: [
    { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
    { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' },
  ],
  testCases: [
    { input: [[2,3,6,7], 7], expected: [[2,2,3],[7]] },
    { input: [[2,3,5], 8], expected: [[2,2,2,2],[2,3,3],[3,5]] },
  ],
  hints: [
    'At each step, decide whether to use the current candidate again or move to the next one.',
    'If the running sum exceeds target, stop exploring that branch.',
    'If the running sum equals target, save the current combination.',
  ],
  pattern_explanation:
    'Backtracking works by exploring candidate reuse and pruning branches once the running total becomes impossible.',
  solution: `function solve(candidates, target) {
  const res = [];
  const path = [];

  function dfs(i, total) {
    if (total === target) {
      res.push(path.slice());
      return;
    }

    if (i === candidates.length || total > target) return;

    path.push(candidates[i]);
    dfs(i, total + candidates[i]);
    path.pop();

    dfs(i + 1, total);
  }

  dfs(0, 0);
  return res;
}`,
};
