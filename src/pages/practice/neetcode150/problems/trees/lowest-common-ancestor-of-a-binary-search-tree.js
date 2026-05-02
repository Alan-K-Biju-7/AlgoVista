export default {
  id: 'lowest-common-ancestor-of-a-binary-search-tree',
  title: 'Lowest Common Ancestor of a Binary Search Tree',
  difficulty: 'Medium',
  pattern: 'Trees',
  timeO: 'O(h)',
  spaceO: 'O(1)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return the lowest common ancestor of two nodes in a binary search tree.',
  examples: [
    { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', output: '6' },
    { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4', output: '2' },
  ],
  testCases: [
    { input: [[6,2,8,0,4,7,9,null,null,3,5], 2, 8], expected: 6 },
    { input: [[6,2,8,0,4,7,9,null,null,3,5], 2, 4], expected: 2 },
    { input: [[2,1], 2, 1], expected: 2 },
  ],
  hints: [
    'Use the BST ordering property.',
    'If both nodes are smaller, go left; if both are larger, go right.',
    'If they split around the current node, you found the LCA.',
  ],
  pattern_explanation:
    'The BST property lets you move directly toward both nodes until their paths diverge, which identifies the lowest common ancestor.',
  solution: `function solve(values, p, q) {
  let i = 0;

  while (i < values.length && values[i] != null) {
    const val = values[i];

    if (p < val && q < val) i = i * 2 + 1;
    else if (p > val && q > val) i = i * 2 + 2;
    else return val;
  }

  return null;
}`,
};
