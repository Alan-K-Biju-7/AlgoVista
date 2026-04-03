export const INF = Infinity;

export function runBellmanFord(nodes, edges, startId) {
  const dist = {};
  const prev = {};
  nodes.forEach((n) => { dist[n.id] = INF; prev[n.id] = null; });
  dist[startId] = 0;

  const V = nodes.length;

  for (let i = 0; i < V - 1; i++) {
    for (const edge of edges) {
      const { from: u, to: v, weight } = edge;
      if (dist[u] !== INF && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        prev[v] = u;
      }
    }
  }

  const negCycleEdges = [];
  for (const edge of edges) {
    const { from: u, to: v, weight } = edge;
    if (dist[u] !== INF && dist[u] + weight < dist[v]) {
      negCycleEdges.push(edge.id);
    }
  }

  return { dist, prev, negCycleEdges, hasNegCycle: negCycleEdges.length > 0 };
}

export function reconstructPath(prev, startId, endId) {
  const path = [];
  const visited = new Set();
  let cur = endId;
  while (cur !== null && cur !== undefined) {
    if (visited.has(cur)) return [];
    visited.add(cur);
    path.unshift(cur);
    if (cur === startId) break;
    cur = prev[cur];
  }
  if (path[0] !== startId) return [];
  return path;
}
