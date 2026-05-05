export default {
  id: 'redundant-connection',
  title: 'Redundant Connection',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(n * alpha(n))',
  spaceO: 'O(n)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return the edge that can be removed so the graph becomes a tree again.',
  examples: [
    { input: 'edges = [[1,2],[1,3],[2,3]]', output: '[2,3]' },
    { input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', output: '[1,4]' },
  ],
  testCases: [
    { input: [[[1,2],[1,3],[2,3]]], expected: [2,3] },
    { input: [[[1,2],[2,3],[3,4],[1,4],[1,5]]], expected: [1,4] },
  ],
  hints: [
    'A tree becomes invalid only when an added edge creates a cycle.',
    'Union-Find can tell whether two nodes are already connected.',
    'If an edge connects two nodes in the same set, that edge is redundant.',
  ],
  pattern_explanation:
    'Union-Find tracks connected components efficiently, so the first failed union reveals the cycle-forming edge.',
  solution: `function solve(edges) {
  const n = edges.length;
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  const rank = new Array(n + 1).fill(1);

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a, b) {
    let pa = find(a);
    let pb = find(b);
    if (pa === pb) return false;

    if (rank[pa] < rank[pb]) [pa, pb] = [pb, pa];
    parent[pb] = pa;
    rank[pa] += rank[pb];
    return true;
  }

  for (const [u, v] of edges) {
    if (!union(u, v)) return [u, v];
  }

  return [];
}`,
};
