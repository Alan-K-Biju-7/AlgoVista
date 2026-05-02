export default {
  id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
  title: 'Construct Binary Tree from Preorder and Inorder Traversal',
  difficulty: 'Medium',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Reconstruct the binary tree from its preorder and inorder traversals.',
  examples: [
    { input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]' },
    { input: 'preorder = [-1], inorder = [-1]', output: '[-1]' },
  ],
  testCases: [
    { input: [[3,9,20,15,7], [9,3,15,20,7]], expected: [3,9,20,null,null,15,7] },
    { input: [[-1], [-1]], expected: [-1] },
  ],
  hints: [
    'The first value in preorder is always the root of the current subtree.',
    'Find that root in inorder to determine how many nodes belong to the left subtree.',
    'Recurse on left and right ranges instead of slicing arrays repeatedly.',
  ],
  pattern_explanation:
    'Preorder identifies roots, while inorder identifies subtree boundaries, so the two traversals together uniquely reconstruct the tree.',
  solution: `function solve(preorder, inorder) {
  const pos = new Map();
  inorder.forEach((v, i) => pos.set(v, i));
  let pre = 0;

  function build(l, r) {
    if (l > r) return null;

    const rootVal = preorder[pre++];
    const mid = pos.get(rootVal);

    return {
      val: rootVal,
      left: build(l, mid - 1),
      right: build(mid + 1, r),
    };
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
      queue.push(node.left);
      queue.push(node.right);
    }

    while (out.length && out[out.length - 1] == null) out.pop();
    return out;
  }

  return bfs(build(0, inorder.length - 1));
}`,
};
