export default {
  id: 'same-tree',
  title: 'Same Tree',
  difficulty: 'Easy',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return true if two binary trees are structurally identical and have the same node values.',
  examples: [
    { input: 'p = [1,2,3], q = [1,2,3]', output: 'true' },
    { input: 'p = [1,2], q = [1,null,2]', output: 'false' },
  ],
  testCases: [
    { input: [[1,2,3], [1,2,3]], expected: true },
    { input: [[1,2], [1,null,2]], expected: false },
    { input: [[1,2,1], [1,1,2]], expected: false },
  ],
  hints: [
    'If both nodes are null, that part matches.',
    'If exactly one node is null, the trees differ.',
    'Otherwise compare values and recurse on left and right children.',
  ],
  pattern_explanation:
    'Tree equality is a structural recursive check: every matching node requires equal values plus equal left and right subtrees.',
  solution: `function solve(p, q) {
  function same(i, j) {
    const pNull = i >= p.length || p[i] == null;
    const qNull = j >= q.length || q[j] == null;

    if (pNull && qNull) return true;
    if (pNull || qNull) return false;
    if (p[i] !== q[j]) return false;

    return same(i * 2 + 1, j * 2 + 1) && same(i * 2 + 2, j * 2 + 2);
  }

  return same(0, 0);
}`,
};
