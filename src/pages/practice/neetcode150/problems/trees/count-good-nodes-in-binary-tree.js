export default {
  id: 'count-good-nodes-in-binary-tree',
  title: 'Count Good Nodes in Binary Tree',
  difficulty: 'Medium',
  pattern: 'Trees',
  timeO: 'O(n)',
  spaceO: 'O(h)',
  viz: 'tree',
  concept: 'trees',
  description:
    'Return the number of good nodes in the binary tree.',
  examples: [
    { input: 'root = [3,1,4,3,null,1,5]', output: '4' },
    { input: 'root = [3,3,null,4,2]', output: '3' },
  ],
  testCases: [
    { input: [[3,1,4,3,null,1,5]], expected: 4 },
    { input: [[3,3,null,4,2]], expected: 3 },
    { input: [[1]], expected: 1 },
  ],
  hints: [
    'A node is good if its value is at least the maximum seen on the path from the root.',
    'Pass the path maximum down during DFS.',
    'Update the path maximum before recursing into children.',
  ],
  pattern_explanation:
    'This is a path-state DFS: each recursive call carries the best value seen so far and uses it to classify the current node.',
  solution: `function solve(values) {
  function dfs(index, maxSoFar) {
    if (index >= values.length || values[index] == null) return 0;

    const val = values[index];
    const nextMax = Math.max(maxSoFar, val);
    const isGood = val >= maxSoFar ? 1 : 0;

    return (
      isGood +
      dfs(index * 2 + 1, nextMax) +
      dfs(index * 2 + 2, nextMax)
    );
  }

  if (!values.length || values[0] == null) return 0;
  return dfs(0, values[0]);
}`,
};
