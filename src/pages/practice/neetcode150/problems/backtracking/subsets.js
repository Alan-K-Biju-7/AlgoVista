export default {
  id: 'subsets',
  title: 'Subsets',
  difficulty: 'Medium',
  pattern: 'Backtracking',
  timeO: 'O(n * 2^n)',
  spaceO: 'O(n)',
  viz: 'recursion-tree',
  concept: 'backtracking',
  description:
    'Return all possible subsets of an array of unique integers.',
  examples: [
    { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
    { input: 'nums = [0]', output: '[[],[0]]' },
  ],
  testCases: [
    { input: [[1,2,3]], expected: [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]] },
    { input: [[0]], expected: [[],[0]] },
  ],
  hints: [
    'For each number, either include it or skip it.',
    'That means every index creates two recursive branches.',
    'When you reach the end, save the current subset.',
  ],
  pattern_explanation:
    'Backtracking explores the decision tree where each element is either chosen or not chosen, generating every subset.',
  solution: `function solve(nums) {
  const res = [];
  const subset = [];

  function dfs(start) {
    res.push(subset.slice());

    for (let i = start; i < nums.length; i++) {
      subset.push(nums[i]);
      dfs(i + 1);
      subset.pop();
    }
  }

  dfs(0);
  return res;
}`,
};
