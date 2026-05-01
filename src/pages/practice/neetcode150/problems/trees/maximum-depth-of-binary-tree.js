export default {
  id: 'maximum-depth-of-binary-tree',
  title: 'Maximum Depth of Binary Tree',
  difficulty: 'Easy',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return the maximum depth of a binary tree.',
  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
    { input: 'root = [1,null,2]', output: '2' },
  ],
  testCases: [
    { input: [[3,9,20,null,null,15,7]], expected: 3 },
    { input: [[1,null,2]], expected: 2 },
    { input: [[]], expected: 0 },
  ],
  hints: [
    'The depth of an empty tree is 0.',
    'The depth of a node depends on the deeper of its two subtrees.',
    'Use recursion to compute subtree depths.',
  ],
  pattern_explanation:
    'Each subtree returns its own depth, and the current node adds one on top of the larger child depth.',
  solution: `function solve(values) {
  function depth(index) {
    if (index >= values.length || values[index] == null) return 0;
    return 1 + Math.max(depth(index * 2 + 1), depth(index * 2 + 2));
  }

  return depth(0);
}`,
};
