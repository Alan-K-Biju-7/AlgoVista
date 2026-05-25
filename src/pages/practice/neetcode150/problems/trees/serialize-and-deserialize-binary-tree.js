export default {
  id: 'serialize-and-deserialize-binary-tree',
  title: 'Serialize and Deserialize Binary Tree',
  difficulty: 'Hard',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Design an algorithm to serialize a binary tree to a string and deserialize it back to the same tree.',
  examples: [
    { input: 'root = [1,2,3,null,null,4,5]', output: '"1,2,3,N,N,4,5,N,N,N,N"' },
    { input: 'root = []', output: '"N"' },
  ],
  testCases: [
    { input: [[1,2,3,null,null,4,5]], expected: '1,2,3,N,N,4,5,N,N,N,N' },
    { input: [[]], expected: 'N' },
  ],
  hints: [
    'A traversal order plus null markers is enough to preserve tree structure.',
    'Level-order with placeholders is easy to serialize and rebuild.',
    'Deserialization should consume values in the same order they were encoded.',
  ],
  pattern_explanation:
    'Serialization works by recording both node values and missing-child positions, so deserialization can rebuild the exact original structure.',
  solution: `function solve(values) {
  if (!values.length || values[0] == null) return 'N';

  const nodes = values.map((val) =>
    val == null ? null : { val, left: null, right: null }
  );

  let childIndex = 1;
  for (const node of nodes) {
    if (!node) continue;
    if (childIndex < nodes.length) node.left = nodes[childIndex++];
    if (childIndex < nodes.length) node.right = nodes[childIndex++];
  }

  const out = [];
  const queue = [nodes[0]];

  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      out.push('N');
      continue;
    }

    out.push(String(node.val));
    queue.push(node.left);
    queue.push(node.right);
  }

  return out.join(',');
}`,
};
