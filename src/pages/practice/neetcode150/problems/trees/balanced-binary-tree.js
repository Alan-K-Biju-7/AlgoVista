/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'balanced-binary-tree',
  title: 'Balanced Binary Tree',
  difficulty: 'Easy',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return true if the binary tree is height-balanced, otherwise return false.',
  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: 'true' },
    { input: 'root = [1,2,2,3,3,null,null,4,4]', output: 'false' },
  ],
  testCases: [
    { input: [[3,9,20,null,null,15,7]], expected: true },
    { input: [[1,2,2,3,3,null,null,4,4]], expected: false },
    { input: [[]], expected: true },
  ],
  hints: [
    'You need subtree heights to check balance.',
    'A node is balanced only if both subtrees are balanced and their heights differ by at most 1.',
    'Return both the balance status and the height from DFS.',
  ],
  pattern_explanation:
    'A bottom-up DFS avoids recomputing heights by returning both subtree height and whether that subtree is balanced.',
  solution: `function solve(values) {
  function dfs(index) {
    if (index >= values.length || values[index] == null) return [true, 0];

    const [leftBalanced, leftHeight] = dfs(index * 2 + 1);
    const [rightBalanced, rightHeight] = dfs(index * 2 + 2);

    const balanced =
      leftBalanced &&
      rightBalanced &&
      Math.abs(leftHeight - rightHeight) <= 1;

    return [balanced, 1 + Math.max(leftHeight, rightHeight)];
  }

  return dfs(0)[0];
}`,
};
