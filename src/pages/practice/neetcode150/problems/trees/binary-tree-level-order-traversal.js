export default {
  id: 'binary-tree-level-order-traversal',
  title: 'Binary Tree Level Order Traversal',
  difficulty: 'Medium',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return the level order traversal of a binary tree as a list of node values by depth.',
  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
    { input: 'root = [1]', output: '[[1]]' },
  ],
  testCases: [
    { input: [[3,9,20,null,null,15,7]], expected: [[3],[9,20],[15,7]] },
    { input: [[1]], expected: [[1]] },
    { input: [[]], expected: [] },
  ],
  hints: [
    'Use a queue instead of recursion if you want to process by level.',
    'At the start of each level, note the queue size.',
    'Process exactly that many nodes to build one level.',
  ],
  pattern_explanation:
    'Breadth-first search naturally visits a tree in depth order, and queue length boundaries separate one level from the next.',
  solution: `function solve(values) {
  if (!values.length || values[0] == null) return [];

  const out = [];
  let level = [0];

  while (level.length) {
    const next = [];
    const row = [];

    for (const i of level) {
      if (i >= values.length || values[i] == null) continue;
      row.push(values[i]);

      const left = i * 2 + 1;
      const right = i * 2 + 2;

      if (left < values.length && values[left] != null) next.push(left);
      if (right < values.length && values[right] != null) next.push(right);
    }

    if (row.length) out.push(row);
    level = next;
  }

  return out;
}`,
};
