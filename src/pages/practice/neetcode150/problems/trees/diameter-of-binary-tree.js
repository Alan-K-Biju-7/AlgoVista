export default {
  id: 'diameter-of-binary-tree',
  title: 'Diameter of Binary Tree',
  difficulty: 'Easy',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return the length of the longest path between any two nodes in a binary tree.',
  examples: [
    { input: 'root = [1,2,3,4,5]', output: '3' },
    { input: 'root = [1,2]', output: '1' },
  ],
  testCases: [
    { input: [[1,2,3,4,5]], expected: 3 },
    { input: [[1,2]], expected: 1 },
    { input: [[1]], expected: 0 },
  ],
  hints: [
    'The longest path through a node uses the height of its left subtree plus the height of its right subtree.',
    'Use DFS to compute heights bottom-up.',
    'Track the maximum diameter seen so far during traversal.',
  ],
  pattern_explanation:
    'A single DFS can compute subtree heights and update the best diameter at each node using left height plus right height.',
  solution: `function solve(values) {
  let best = 0;

  function height(index) {
    if (index >= values.length || values[index] == null) return 0;

    const left = height(index * 2 + 1);
    const right = height(index * 2 + 2);

    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  }

  height(0);
  return best;
}`,
};
