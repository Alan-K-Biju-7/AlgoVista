/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'kth-smallest-integer-in-bst',
  title: 'Kth Smallest Integer in BST',
  difficulty: 'Medium',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return the kth smallest value in a binary search tree.',
  examples: [
    { input: 'root = [3,1,4,null,2], k = 1', output: '1' },
    { input: 'root = [5,3,6,2,4,null,null,1], k = 3', output: '3' },
  ],
  testCases: [
    { input: [[3,1,4,null,2], 1], expected: 1 },
    { input: [[5,3,6,2,4,null,null,1], 3], expected: 3 },
    { input: [[2,1,3], 2], expected: 2 },
  ],
  hints: [
    'In-order traversal of a BST yields values in ascending order.',
    'Count nodes as you visit them.',
    'Return when you reach the kth visit.',
  ],
  pattern_explanation:
    'BST ordering turns in-order traversal into a sorted walk, so counting visits gives the kth smallest element directly.',
  solution: `function solve(values, k) {
  const inorder = [];

  function dfs(index) {
    if (index >= values.length || values[index] == null) return;
    dfs(index * 2 + 1);
    inorder.push(values[index]);
    dfs(index * 2 + 2);
  }

  dfs(0);
  return inorder[k - 1];
}`,
};
