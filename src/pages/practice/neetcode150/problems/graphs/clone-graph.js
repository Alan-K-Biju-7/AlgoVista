/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'clone-graph',
  title: 'Clone Graph',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(V + E)',
  spaceO: 'O(V)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return a deep copy of a connected undirected graph.',
  examples: [
    { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
    { input: 'adjList = [[]]', output: '[[]]' },
  ],
  testCases: [
    { input: [[[2,4],[1,3],[2,4],[1,3]]], expected: [[2,4],[1,3],[2,4],[1,3]] },
    { input: [[[]]], expected: [[]] },
    { input: [[]], expected: [] },
  ],
  hints: [
    'If you revisit a node during traversal, you should return the already-created copy.',
    'Use a map from original node id to cloned node.',
    'Clone neighbors recursively or iteratively after creating the current copy.',
  ],
  pattern_explanation:
    'Graph cloning is graph traversal plus memoization: each original node maps to exactly one clone.',
  solution: `function solve(adjList) {
  if (!adjList.length) return [];

  const clone = Array.from({ length: adjList.length }, () => []);
  const seen = new Set([1]);
  const stack = [1];

  while (stack.length) {
    const node = stack.pop();
    for (const nei of adjList[node - 1]) {
      clone[node - 1].push(nei);
      if (!seen.has(nei)) {
        seen.add(nei);
        stack.push(nei);
      }
    }
  }

  return clone;
}`,
};
