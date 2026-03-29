import { MinPQ } from './minPQ';
import { INF } from './dijkstraLogic';

export function generateDijkstraSteps(adjList, nodes, startId) {
  const steps = [];
  const dist    = {};
  const prev    = {};
  const visited = new Set();
  const nodeIds = nodes.map((n) => n.id);

  nodeIds.forEach((id) => { dist[id] = INF; prev[id] = null; });
  dist[startId] = 0;

  const pq = new MinPQ();
  pq.push({ id: startId, dist: 0 });

  steps.push({
    dist: { ...dist }, prev: { ...prev },
    visited: [...visited], current: null,
    relaxedEdge: null, pqSnapshot: pq.toArray(),
    phase: 'init',
    message: `Initialize. Set dist[${startId}] = 0, all others = ∞. Push ${startId} into min-priority queue.`,
  });

  while (!pq.isEmpty()) {
    const { id: u, dist: uDist } = pq.pop();

    if (visited.has(u)) {
      steps.push({
        dist: { ...dist }, prev: { ...prev },
        visited: [...visited], current: u,
        relaxedEdge: null, pqSnapshot: pq.toArray(),
        phase: 'skip',
        message: `Pop ${u} (dist ${uDist}) — already visited with a shorter path. Skip.`,
      });
      continue;
    }

    visited.add(u);
    steps.push({
      dist: { ...dist }, prev: { ...prev },
      visited: [...visited], current: u,
      relaxedEdge: null, pqSnapshot: pq.toArray(),
      phase: 'visit',
      message: `Pop ${u} from PQ. dist[${u}] = ${dist[u]}. Mark visited. Relax all neighbors.`,
    });

    for (const { to: v, weight } of (adjList[u] || [])) {
      if (visited.has(v)) {
        steps.push({
          dist: { ...dist }, prev: { ...prev },
          visited: [...visited], current: u,
          relaxedEdge: { from: u, to: v }, pqSnapshot: pq.toArray(),
          phase: 'skip_neighbor',
          message: `Neighbor ${v} already visited — skip relaxation.`,
        });
        continue;
      }

      const newDist = dist[u] + weight;
      const improved = newDist < dist[v];

      steps.push({
        dist: { ...dist }, prev: { ...prev },
        visited: [...visited], current: u,
        relaxedEdge: { from: u, to: v }, pqSnapshot: pq.toArray(),
        phase: improved ? 'relax' : 'no_relax',
        message: improved
          ? `Relax edge ${u}→${v} (w=${weight}): dist[${u}] + ${weight} = ${newDist} < dist[${v}] (${dist[v] === INF ? '∞' : dist[v]}). Update! Push ${v}(${newDist}) to PQ.`
          : `Edge ${u}→${v} (w=${weight}): ${newDist} ≥ dist[${v}] (${dist[v]}). No improvement — skip.`,
      });

      if (improved) {
        dist[v] = newDist;
        prev[v] = u;
        pq.push({ id: v, dist: newDist });
        steps.push({
          dist: { ...dist }, prev: { ...prev },
          visited: [...visited], current: u,
          relaxedEdge: { from: u, to: v }, pqSnapshot: pq.toArray(),
          phase: 'updated',
          message: `dist[${v}] updated to ${newDist}. prev[${v}] = ${u}. PQ size: ${pq.size()}.`,
        });
      }
    }
  }

  steps.push({
    dist: { ...dist }, prev: { ...prev },
    visited: [...visited], current: null,
    relaxedEdge: null, pqSnapshot: [],
    phase: 'done',
    message: `Dijkstra complete ✓  All reachable nodes settled. Select any destination to see its shortest path.`,
  });

  return steps;
}
