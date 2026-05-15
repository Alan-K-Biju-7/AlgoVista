/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'permutations',
  title: 'Permutations',
  difficulty: 'Medium',
  pattern: 'Backtracking',
  timeO: 'O(n * n!)',
  spaceO: 'O(n)',
  viz: 'recursion-tree',
  concept: 'backtracking',
  description:
    'Return all possible permutations of distinct integers.',
  examples: [
    { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
    { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' },
  ],
  testCases: [
    { input: [[1,2,3]], expected: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]] },
    { input: [[0,1]], expected: [[0,1],[1,0]] },
  ],
  hints: [
    'At each position, choose any number that has not been used yet.',
    'Track which elements are already in the current permutation.',
    'Undo the choice after exploring that branch.',
  ],
  pattern_explanation:
    'Permutation generation uses backtracking with a used-set, where each level picks the next unused element in the ordering.',
  solution: `function solve(nums) {
  const res = [];
  const path = [];
  const used = new Array(nums.length).fill(false);

  function dfs() {
    if (path.length === nums.length) {
      res.push(path.slice());
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      path.push(nums[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  }

  dfs();
  return res;
}`,
};
