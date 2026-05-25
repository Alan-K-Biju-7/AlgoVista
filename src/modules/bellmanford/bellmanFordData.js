export const DEFAULT_NODES = [
  { id: 'S', x: 90,  y: 200 },
  { id: 'A', x: 250, y: 80  },
  { id: 'B', x: 250, y: 320 },
  { id: 'C', x: 430, y: 80  },
  { id: 'D', x: 430, y: 320 },
  { id: 'E', x: 580, y: 200 },
];

export const DEFAULT_EDGES = [
  { id: 'SA', from: 'S', to: 'A', weight:  6 },
  { id: 'SB', from: 'S', to: 'B', weight:  7 },
  { id: 'AB', from: 'A', to: 'B', weight:  8 },
  { id: 'AC', from: 'A', to: 'C', weight:  5 },
  { id: 'AD', from: 'A', to: 'D', weight: -4 },
  { id: 'BC', from: 'B', to: 'C', weight: -3 },
  { id: 'BD', from: 'B', to: 'D', weight:  9 },
  { id: 'CE', from: 'C', to: 'E', weight: -2 },
  { id: 'DC', from: 'D', to: 'C', weight:  7 },
  { id: 'DE', from: 'D', to: 'E', weight:  2 },
  { id: 'EA', from: 'E', to: 'A', weight:  3 },
];

export const PRESET_GRAPHS = {
  default: { nodes: DEFAULT_NODES, edges: DEFAULT_EDGES },

  negCycle: {
    nodes: [
      { id: 'S', x: 100, y: 200 },
      { id: 'A', x: 280, y: 90  },
      { id: 'B', x: 460, y: 90  },
      { id: 'C', x: 460, y: 310 },
      { id: 'D', x: 280, y: 310 },
    ],
    edges: [
      { id: 'SA', from: 'S', to: 'A', weight:  1 },
      { id: 'AB', from: 'A', to: 'B', weight:  2 },
      { id: 'BC', from: 'B', to: 'C', weight: -6 },
      { id: 'CD', from: 'C', to: 'D', weight:  2 },
      { id: 'DA', from: 'D', to: 'A', weight:  1 },
      { id: 'DS', from: 'D', to: 'S', weight:  5 },
    ],
  },

  simple: {
    nodes: [
      { id: 'A', x: 100, y: 200 },
      { id: 'B', x: 280, y: 100 },
      { id: 'C', x: 460, y: 200 },
      { id: 'D', x: 280, y: 300 },
    ],
    edges: [
      { id: 'AB', from: 'A', to: 'B', weight:  4 },
      { id: 'AD', from: 'A', to: 'D', weight:  5 },
      { id: 'BC', from: 'B', to: 'C', weight: -3 },
      { id: 'DC', from: 'D', to: 'C', weight:  2 },
      { id: 'DB', from: 'D', to: 'B', weight: -2 },
    ],
  },
};

export function buildDirectedAdj(nodes, edges) {
  const adj = {};
  nodes.forEach((n) => { adj[n.id] = []; });
  edges.forEach((e) => {
    if (!adj[e.from]) adj[e.from] = [];
    adj[e.from].push({ to: e.to, weight: e.weight, edgeId: e.id });
  });
  return adj;
}

export function addDirectedEdge(edges, nodes, from, to, weight) {
  const f = from.trim().toUpperCase();
  const t = to.trim().toUpperCase();
  const w = Number(weight);
  if (!f || !t || f === t || isNaN(w)) return edges;
  if (!nodes.find((n) => n.id === f) || !nodes.find((n) => n.id === t)) return edges;
  if (edges.find((e) => e.from === f && e.to === t)) return edges;
  return [...edges, { id: `${f}${t}${Date.now()}`, from: f, to: t, weight: w }];
}
