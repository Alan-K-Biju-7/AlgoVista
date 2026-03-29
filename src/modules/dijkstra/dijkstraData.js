export const DEFAULT_NODES = [
  { id: 'A', x: 100, y: 200 },
  { id: 'B', x: 250, y: 90  },
  { id: 'C', x: 430, y: 90  },
  { id: 'D', x: 560, y: 200 },
  { id: 'E', x: 430, y: 310 },
  { id: 'F', x: 250, y: 310 },
];

export const DEFAULT_EDGES = [
  { id: 'AB', from: 'A', to: 'B', weight: 4  },
  { id: 'AF', from: 'A', to: 'F', weight: 2  },
  { id: 'BC', from: 'B', to: 'C', weight: 5  },
  { id: 'BF', from: 'B', to: 'F', weight: 1  },
  { id: 'BE', from: 'B', to: 'E', weight: 3  },
  { id: 'CD', from: 'C', to: 'D', weight: 2  },
  { id: 'CE', from: 'C', to: 'E', weight: 4  },
  { id: 'DE', from: 'D', to: 'E', weight: 1  },
  { id: 'EF', from: 'E', to: 'F', weight: 5  },
];

export function buildWeightedAdj(nodes, edges) {
  const adj = {};
  nodes.forEach((n) => { adj[n.id] = []; });
  edges.forEach((e) => {
    if (!adj[e.from]) adj[e.from] = [];
    if (!adj[e.to])   adj[e.to]   = [];
    adj[e.from].push({ to: e.to,   weight: e.weight });
    adj[e.to].push(  { to: e.from, weight: e.weight });
  });
  Object.keys(adj).forEach((k) => adj[k].sort((a, b) => a.to.localeCompare(b.to)));
  return adj;
}

export function addWeightedNode(nodes, id) {
  const clean = id.trim().toUpperCase();
  if (!clean || nodes.find((n) => n.id === clean)) return nodes;
  const angle = Math.random() * 2 * Math.PI;
  const r = 120 + Math.random() * 80;
  return [...nodes, { id: clean, x: Math.round(330 + r * Math.cos(angle)), y: Math.round(200 + r * Math.sin(angle)) }];
}

export function addWeightedEdge(edges, nodes, from, to, weight) {
  const f = from.trim().toUpperCase();
  const t = to.trim().toUpperCase();
  const w = Number(weight);
  if (!f || !t || f === t || isNaN(w) || w <= 0) return edges;
  if (!nodes.find((n) => n.id === f) || !nodes.find((n) => n.id === t)) return edges;
  if (edges.find((e) => (e.from === f && e.to === t) || (e.from === t && e.to === f))) return edges;
  return [...edges, { id: `${f}${t}`, from: f, to: t, weight: w }];
}
