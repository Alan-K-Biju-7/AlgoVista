/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'validate-binary-search-tree',
  title: 'Validate Binary Search Tree',
  difficulty: 'Medium',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return true if the binary tree is a valid binary search tree, otherwise return false.',
  examples: [
    { input: 'root = [2,1,3]', output: 'true' },
    { input: 'root = [5,1,4,null,null,3,6]', output: 'false' },
  ],
  testCases: [
    { input: [[2,1,3]], expected: true },
    { input: [[5,1,4,null,null,3,6]], expected: false },
    { input: [[5,4,6,null,null,3,7]], expected: false },
  ],
  hints: [
    'Each node inherits a valid numeric range from its ancestors.',
    'The left subtree must stay strictly below the current value.',
    'The right subtree must stay strictly above the current value.',
  ],
  pattern_explanation:
    'BST validation is a range-check DFS, where each recursive call tightens the allowed minimum and maximum bounds.',
  solution: `function solve(values) {
  function dfs(index, low, high) {
    if (index >= values.length || values[index] == null) return true;

    const val = values[index];
    if (!(low < val && val < high)) return false;

    return (
      dfs(index * 2 + 1, low, val) &&
      dfs(index * 2 + 2, val, high)
    );
  }

  return dfs(0, -Infinity, Infinity);
}`,
};
