export default {
  id: 'graph-valid-tree',
  title: 'Graph Valid Tree',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(n + e)',
  spaceO: 'O(n + e)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return true if the undirected graph is a valid tree.',
  examples: [
    { input: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]', output: 'true' },
    { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]', output: 'false' },
  ],
  testCases: [
    { input: [5, [[0,1],[0,2],[0,3],[1,4]]], expected: true },
    { input: [5, [[0,1],[1,2],[2,3],[1,3],[1,4]]], expected: false },
    { input: [4, [[0,1],[2,3]]], expected: false },
  ],
  hints: [
    'A valid tree cannot contain a cycle.',
    'A valid tree must also connect all nodes.',
    'The edge-count shortcut n - 1 is a strong early check.',
  ],
  pattern_explanation:
    'An undirected graph is a tree exactly when it is connected and acyclic, which can be verified with traversal after an edge-count check.',
  solution: `function solve(n, edges) {
  if (edges.length !== n - 1) return false;

  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const seen = new Set();

  function dfs(node) {
    if (seen.has(node)) return;
    seen.add(node);
    for (const nei of graph[node]) dfs(nei);
  }

  dfs(0);
  return seen.size === n;
}`,
};
