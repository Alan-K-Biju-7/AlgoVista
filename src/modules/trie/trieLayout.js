const NODE_R = 18;
const V_GAP  = 58;
const H_GAP  = NODE_R * 2 + 10;

export function computeTrieLayout(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];
  let counter = 0;

  function assignX(node) {
    let hasChildren = false;
    for (const ch of Object.keys(node.children).sort()) {
      assignX(node.children[ch]);
      hasChildren = true;
    }
    if (!hasChildren) { node._x = counter++; return; }
    const keys = Object.keys(node.children).sort();
    const first = node.children[keys[0]]._x;
    const last  = node.children[keys[keys.length - 1]]._x;
    node._x = (first + last) / 2;
  }

  function assignDepth(node, depth) {
    node._depth = depth;
    for (const ch of Object.keys(node.children)) assignDepth(node.children[ch], depth + 1);
  }

  assignDepth(root, 0);
  assignX(root);

  function collect(node, label, parentX, parentY) {
    const x = node._x * H_GAP + NODE_R + 8;
    const y = node._depth * V_GAP + NODE_R + 8;
    nodes.push({ id: `${label}_${node._depth}_${node._x}`, label, x, y, isEnd: node.isEnd, word: node.word });
    if (parentX !== null) edges.push({ x1: parentX, y1: parentY, x2: x, y2: y, label });
    for (const ch of Object.keys(node.children).sort()) {
      collect(node.children[ch], ch, x, y);
    }
  }

  collect(root, 'ROOT', null, null);
  return { nodes, edges, nodeR: NODE_R };
}
