import { INF } from './bellmanFordLogic';

export function generateBellmanFordSteps(nodes, edges, startId) {
  const steps = [];
  const dist = {};
  const prev = {};
  nodes.forEach((n) => { dist[n.id] = INF; prev[n.id] = null; });
  dist[startId] = 0;

  const V = nodes.length;

  steps.push({
    dist: { ...dist }, prev: { ...prev },
    iteration: 0, edgeIdx: null, activeEdge: null,
    relaxedEdge: null, negCycleEdges: [], phase: 'init',
    message: `Initialize. dist[${startId}] = 0, all others = ∞. Run V−1 = ${V - 1} relaxation iterations over all ${edges.length} edges.`,
  });

  for (let i = 1; i <= V - 1; i++) {
    steps.push({
      dist: { ...dist }, prev: { ...prev },
      iteration: i, edgeIdx: null, activeEdge: null,
      relaxedEdge: null, negCycleEdges: [], phase: 'iter_start',
      message: `Iteration ${i} of ${V - 1}. Relax every edge — if dist[u] + w(u,v) < dist[v], update.`,
    });

    let anyUpdate = false;

    for (let j = 0; j < edges.length; j++) {
      const edge = edges[j];
      const { from: u, to: v, weight } = edge;
      const newDist = dist[u] === INF ? INF : dist[u] + weight;
      const improved = dist[u] !== INF && newDist < dist[v];

      steps.push({
        dist: { ...dist }, prev: { ...prev },
        iteration: i, edgeIdx: j, activeEdge: edge.id,
        relaxedEdge: null, negCycleEdges: [], phase: improved ? 'relax' : 'no_relax',
        message: improved
          ? `Edge ${u}→${v} (w=${weight}): dist[${u}]${dist[u] === INF ? '=∞' : `=${dist[u]}`} + ${weight} = ${newDist} < dist[${v}]${dist[v] === INF ? '=∞' : `=${dist[v]}`}. ✓ Update!`
          : dist[u] === INF
            ? `Edge ${u}→${v}: dist[${u}] = ∞ — source unreachable, skip.`
            : `Edge ${u}→${v} (w=${weight}): ${newDist} ≥ dist[${v}]=${dist[v] === INF ? '∞' : dist[v]}. No improvement.`,
      });

      if (improved) {
        dist[v] = newDist;
        prev[v] = u;
        anyUpdate = true;
        steps.push({
          dist: { ...dist }, prev: { ...prev },
          iteration: i, edgeIdx: j, activeEdge: edge.id,
          relaxedEdge: edge.id, negCycleEdges: [], phase: 'updated',
          message: `dist[${v}] updated to ${newDist}. prev[${v}] = ${u}.`,
        });
      }
    }

    steps.push({
      dist: { ...dist }, prev: { ...prev },
      iteration: i, edgeIdx: null, activeEdge: null,
      relaxedEdge: null, negCycleEdges: [], phase: 'iter_end',
        message: anyUpdate
          ? `Iteration ${i} complete — some distances improved. ${i < V - 1 ? (V - 1 - i) + ' iterations remaining.' : 'Final iteration done.'}`
          : `Iteration ${i} complete — no updates. Graph has settled early. Remaining iterations will also produce no changes.`,
    });
  }

  const negCycleEdges = [];
  steps.push({
    dist: { ...dist }, prev: { ...prev },
    iteration: V, edgeIdx: null, activeEdge: null,
    relaxedEdge: null, negCycleEdges: [], phase: 'neg_check_start',
    message: `Negative cycle check: run one extra relaxation pass (iteration ${V}). If any edge still relaxes → negative cycle exists.`,
  });

  for (let j = 0; j < edges.length; j++) {
    const edge = edges[j];
    const { from: u, to: v, weight } = edge;
    const newDist = dist[u] === INF ? INF : dist[u] + weight;
    const wouldRelax = dist[u] !== INF && newDist < dist[v];

    steps.push({
      dist: { ...dist }, prev: { ...prev },
      iteration: V, edgeIdx: j, activeEdge: edge.id,
      relaxedEdge: wouldRelax ? edge.id : null,
      negCycleEdges: wouldRelax ? [...negCycleEdges, edge.id] : [...negCycleEdges],
      phase: wouldRelax ? 'neg_cycle_found' : 'neg_check',
      message: wouldRelax
        ? `⚠ Edge ${u}→${v} (w=${weight}) still relaxes after V−1 iterations! This edge is part of a negative cycle.`
        : `Edge ${u}→${v}: no further relaxation — clean.`,
    });

    if (wouldRelax) negCycleEdges.push(edge.id);
  }

  const hasNegCycle = negCycleEdges.length > 0;
  steps.push({
    dist: { ...dist }, prev: { ...prev },
    iteration: V, edgeIdx: null, activeEdge: null,
    relaxedEdge: null, negCycleEdges: [...negCycleEdges],
    phase: 'done',
    message: hasNegCycle
      ? `⚠ Negative cycle detected! ${negCycleEdges.length} edge(s) would still relax. Shortest paths are undefined for nodes reachable through the cycle.`
      : `Bellman-Ford complete ✓  No negative cycle. All ${nodes.length} shortest distances finalized.`,
  });

  return steps;
}
