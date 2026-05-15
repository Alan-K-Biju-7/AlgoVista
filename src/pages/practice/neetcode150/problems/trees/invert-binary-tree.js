/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'invert-binary-tree',
  title: 'Invert Binary Tree',
  difficulty: 'Easy',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Invert a binary tree by swapping the left and right child of every node.',
  examples: [
    { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
    { input: 'root = [2,1,3]', output: '[2,3,1]' },
  ],
  testCases: [
    { input: [[4,2,7,1,3,6,9]], expected: [4,7,2,9,6,3,1] },
    { input: [[2,1,3]], expected: [2,3,1] },
    { input: [[]], expected: [] },
  ],
  hints: [
    'At each node, swap the left and right subtree.',
    'Then recursively invert each child subtree.',
    'The null node is the base case.',
  ],
  pattern_explanation:
    'This is a direct recursive tree transformation: solve the same swap operation independently on each subtree.',
  solution: `function solve(values) {
  if (!values.length) return [];

  function helper(index) {
    if (index >= values.length || values[index] == null) return null;
    return {
      val: values[index],
      left: helper(index * 2 + 1),
      right: helper(index * 2 + 2),
    };
  }

  function invert(node) {
    if (!node) return null;
    const temp = node.left;
    node.left = invert(node.right);
    node.right = invert(temp);
    return node;
  }

  function bfs(root) {
    if (!root) return [];
    const out = [];
    const queue = [root];

    while (queue.length) {
      const node = queue.shift();
      if (!node) {
        out.push(null);
        continue;
      }
      out.push(node.val);
      if (node.left || node.right) {
        queue.push(node.left);
        queue.push(node.right);
      }
    }

    while (out.length && out[out.length - 1] == null) out.pop();
    return out;
  }

  return bfs(invert(helper(0)));
}`,
};
