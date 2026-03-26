export const DEFAULT_NODES = [
  { id: 'A', x: 120, y: 190 },
  { id: 'B', x: 260, y: 90  },
  { id: 'C', x: 420, y: 90  },
  { id: 'D', x: 520, y: 190 },
  { id: 'E', x: 420, y: 300 },
  { id: 'F', x: 260, y: 300 },
];

export const DEFAULT_EDGES = [
  { id: 'AB', from: 'A', to: 'B' },
  { id: 'AF', from: 'A', to: 'F' },
  { id: 'BC', from: 'B', to: 'C' },
  { id: 'BE', from: 'B', to: 'E' },
  { id: 'CD', from: 'C', to: 'D' },
  { id: 'DE', from: 'D', to: 'E' },
  { id: 'EF', from: 'E', to: 'F' },
];

export function buildAdjList(nodes, edges) {
  const adj = {};
  nodes.forEach((n) => { adj[n.id] = []; });
  edges.forEach((e) => {
    if (!adj[e.from]) adj[e.from] = [];
    if (!adj[e.to])   adj[e.to]   = [];
    if (!adj[e.from].includes(e.to)) adj[e.from].push(e.to);
    if (!adj[e.to].includes(e.from)) adj[e.to].push(e.from);
  });
  Object.keys(adj).forEach((k) => adj[k].sort());
  return adj;
}

export function addNode(nodes, id) {
  const clean = id.trim().toUpperCase();
  if (!clean || nodes.find((n) => n.id === clean)) return nodes;
  const angle = Math.random() * 2 * Math.PI;
  const r = 120 + Math.random() * 80;
  return [...nodes, { id: clean, x: Math.round(320 + r * Math.cos(angle)), y: Math.round(195 + r * Math.sin(angle)) }];
}

export function addEdge(edges, nodes, from, to) {
  const f = from.trim().toUpperCase();
  const t = to.trim().toUpperCase();
  if (!f || !t || f === t) return edges;
  if (!nodes.find((n) => n.id === f) || !nodes.find((n) => n.id === t)) return edges;
  if (edges.find((e) => (e.from === f && e.to === t) || (e.from === t && e.to === f))) return edges;
  return [...edges, { id: `${f}${t}`, from: f, to: t }];
}

export function removeNode(nodes, edges, id) {
  return {
    nodes: nodes.filter((n) => n.id !== id),
    edges: edges.filter((e) => e.from !== id && e.to !== id),
  };
}
