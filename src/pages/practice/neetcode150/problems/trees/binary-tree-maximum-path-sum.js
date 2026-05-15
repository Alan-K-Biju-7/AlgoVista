/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'binary-tree-maximum-path-sum',
  title: 'Binary Tree Maximum Path Sum',
  difficulty: 'Hard',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return the maximum path sum of any non-empty path in the binary tree.',
  examples: [
    { input: 'root = [1,2,3]', output: '6' },
    { input: 'root = [-10,9,20,null,null,15,7]', output: '42' },
  ],
  testCases: [
    { input: [[1,2,3]], expected: 6 },
    { input: [[-10,9,20,null,null,15,7]], expected: 42 },
    { input: [[-3]], expected: -3 },
  ],
  hints: [
    'A path can bend at one node and use both left and right branches only there.',
    'When returning to a parent, you can extend through only one child.',
    'Ignore negative branch gains with max(0, gain).',
  ],
  pattern_explanation:
    'Tree DP separates two ideas: the best path anywhere in the subtree, and the best upward gain the current node can contribute to its parent.',
  solution: `function solve(values) {
  let best = -Infinity;

  function gain(index) {
    if (index >= values.length || values[index] == null) return 0;

    const left = Math.max(0, gain(index * 2 + 1));
    const right = Math.max(0, gain(index * 2 + 2));
    const val = values[index];

    best = Math.max(best, val + left + right);
    return val + Math.max(left, right);
  }

  gain(0);
  return best;
}`,
};
