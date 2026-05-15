/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'number-of-connected-components-in-an-undirected-graph',
  title: 'Number of Connected Components in an Undirected Graph',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(n + e)',
  spaceO: 'O(n + e)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return the number of connected components in an undirected graph.',
  examples: [
    { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2' },
    { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', output: '1' },
  ],
  testCases: [
    { input: [5, [[0,1],[1,2],[3,4]]], expected: 2 },
    { input: [5, [[0,1],[1,2],[2,3],[3,4]]], expected: 1 },
    { input: [4, []], expected: 4 },
  ],
  hints: [
    'Each component is one fully reachable group of nodes.',
    'Start a DFS or BFS from every unvisited node and count how many traversals you begin.',
    'Union-Find can also merge endpoints and count final roots.',
  ],
  pattern_explanation:
    'Connected-component counting works by grouping nodes that are mutually reachable and counting how many groups remain.',
  solution: `function solve(n, edges) {
  const graph = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const seen = new Array(n).fill(false);
  let count = 0;

  function dfs(node) {
    if (seen[node]) return;
    seen[node] = true;
    for (const nei of graph[node]) dfs(nei);
  }

  for (let i = 0; i < n; i++) {
    if (!seen[i]) {
      count++;
      dfs(i);
    }
  }

  return count;
}`,
};
