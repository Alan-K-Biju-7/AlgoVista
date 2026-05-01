export default {
  id: 'subtree-of-another-tree',
  title: 'Subtree of Another Tree',
  difficulty: 'Easy',
  pattern: 'Trees',
  timeO: 'O(n * m)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return true if subRoot is a subtree of root.',
  examples: [
    { input: 'root = [3,4,5,1,2], subRoot = [4,1,2]', output: 'true' },
    { input: 'root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]', output: 'false' },
  ],
  testCases: [
    { input: [[3,4,5,1,2], [4,1,2]], expected: true },
    { input: [[3,4,5,1,2,null,null,null,null,0], [4,1,2]], expected: false },
    { input: [[1,1], [1]], expected: true },
  ],
  hints: [
    'You already know how to compare two trees for exact equality.',
    'At each node in root, ask whether the subtree there matches subRoot.',
    'If not, recurse into the left and right subtree.',
  ],
  pattern_explanation:
    'This combines tree traversal with tree equality checking: search every possible root candidate and compare structures recursively.',
  solution: `function solve(root, subRoot) {
  function same(a, b, i, j) {
    const aNull = i >= a.length || a[i] == null;
    const bNull = j >= b.length || b[j] == null;

    if (aNull && bNull) return true;
    if (aNull || bNull) return false;
    if (a[i] !== b[j]) return false;

    return same(a, b, i * 2 + 1, j * 2 + 1) && same(a, b, i * 2 + 2, j * 2 + 2);
  }

  function dfs(i) {
    if (i >= root.length || root[i] == null) return false;
    if (same(root, subRoot, i, 0)) return true;
    return dfs(i * 2 + 1) || dfs(i * 2 + 2);
  }

  return dfs(0);
}`,
};
