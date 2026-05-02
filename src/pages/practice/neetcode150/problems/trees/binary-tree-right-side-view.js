export default {
  id: 'binary-tree-right-side-view',
  title: 'Binary Tree Right Side View',
  difficulty: 'Medium',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return the values of the nodes visible when looking at the tree from the right side.',
  examples: [
    { input: 'root = [1,2,3,null,5,null,4]', output: '[1,3,4]' },
    { input: 'root = [1,2,3,4,null,null,null,5]', output: '[1,3,4,5]' },
  ],
  testCases: [
    { input: [[1,2,3,null,5,null,4]], expected: [1,3,4] },
    { input: [[1,2,3,4,null,null,null,5]], expected: [1,3,4,5] },
    { input: [[]], expected: [] },
  ],
  hints: [
    'Only one node per depth is visible from the right.',
    'With BFS, that is the last node processed at each level.',
    'With DFS, visit right children before left children.',
  ],
  pattern_explanation:
    'Right-side visibility is a per-level question, so either BFS level boundaries or right-first DFS can capture the visible node at each depth.',
  solution: `function solve(values) {
  if (!values.length || values[0] == null) return [];

  const out = [];
  let level = [0];

  while (level.length) {
    const next = [];
    let rightMost = null;

    for (const i of level) {
      if (i >= values.length || values[i] == null) continue;
      rightMost = values[i];

      const left = i * 2 + 1;
      const right = i * 2 + 2;

      if (left < values.length && values[left] != null) next.push(left);
      if (right < values.length && values[right] != null) next.push(right);
    }

    if (rightMost != null) out.push(rightMost);
    level = next;
  }

  return out;
}`,
};
