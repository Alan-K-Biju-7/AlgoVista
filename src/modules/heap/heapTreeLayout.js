const NODE_R = 24;
const V_GAP  = 70;

export function computeHeapTreeLayout(heap) {
  if (!heap || heap.length === 0) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];
  const levelWidth = {};

  function countByLevel(i, level) {
    if (i >= heap.length) return;
    levelWidth[level] = (levelWidth[level] || 0) + 1;
    countByLevel(2 * i + 1, level + 1);
    countByLevel(2 * i + 2, level + 1);
  }
  countByLevel(0, 0);

  const maxLevel = Math.max(...Object.keys(levelWidth).map(Number));
  const totalWidth = (Math.pow(2, maxLevel) * (NODE_R * 2 + 12));

  function layout(i, level, left, right) {
    if (i >= heap.length) return;
    const x = (left + right) / 2;
    const y = level * V_GAP + NODE_R + 8;
    nodes.push({ idx: i, val: heap[i], x: Math.round(x), y: Math.round(y) });
    const pNode = nodes.find((n) => n.idx === Math.floor((i - 1) / 2));
    if (pNode && i > 0) edges.push({ x1: pNode.x, y1: pNode.y, x2: Math.round(x), y2: Math.round(y) });
    layout(2 * i + 1, level + 1, left, (left + right) / 2);
    layout(2 * i + 2, level + 1, (left + right) / 2, right);
  }

  layout(0, 0, 0, Math.max(totalWidth, 400));
  return { nodes, edges, nodeR: NODE_R };
}
