/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'subsets-ii',
  title: 'Subsets II',
  difficulty: 'Medium',
  pattern: 'Backtracking',
  timeO: 'O(n * 2^n)',
  spaceO: 'O(n)',
  viz: 'recursion-tree',
  concept: 'backtracking',
  description:
    'Return all possible subsets of an array that may contain duplicates, without duplicate subsets in the answer.',
  examples: [
    { input: 'nums = [1,2,2]', output: '[[],[1],[2],[1,2],[2,2],[1,2,2]]' },
    { input: 'nums = [0]', output: '[[],[0]]' },
  ],
  testCases: [
    { input: [[1,2,2]], expected: [[],[1],[1,2],[1,2,2],[2],[2,2]] },
    { input: [[0]], expected: [[],[0]] },
  ],
  hints: [
    'Sort the array so duplicates are adjacent.',
    'When iterating choices at one depth, skip equal values you have already used at that depth.',
    'Backtracking still works the same after that duplicate check.',
  ],
  pattern_explanation:
    'Sorting groups duplicates together, which lets backtracking skip repeated branches and avoid duplicate subsets.',
  solution: `function solve(nums) {
  nums = nums.slice().sort((a, b) => a - b);
  const res = [];
  const path = [];

  function dfs(start) {
    res.push(path.slice());

    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    }
  }

  dfs(0);
  return res;
}`,
};
