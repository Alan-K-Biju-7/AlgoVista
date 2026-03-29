import { MinPQ } from './minPQ';

export const INF = Infinity;

export function runDijkstra(adjList, startId) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  Object.keys(adjList).forEach((id) => { dist[id] = INF; prev[id] = null; });
  dist[startId] = 0;
  const pq = new MinPQ();
  pq.push({ id: startId, dist: 0 });

  while (!pq.isEmpty()) {
    const { id: u } = pq.pop();
    if (visited.has(u)) continue;
    visited.add(u);
    for (const { to: v, weight } of (adjList[u] || [])) {
      if (visited.has(v)) continue;
      const newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        prev[v] = u;
        pq.push({ id: v, dist: newDist });
      }
    }
  }
  return { dist, prev };
}

export function reconstructPath(prev, startId, endId) {
  const path = [];
  let cur = endId;
  while (cur !== null && cur !== undefined) {
    path.unshift(cur);
    if (cur === startId) break;
    cur = prev[cur];
  }
  if (path[0] !== startId) return [];
  return path;
}
