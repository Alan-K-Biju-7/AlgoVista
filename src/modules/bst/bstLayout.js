const NODE_R = 22;
const V_GAP  = 64;

export function computeLayout(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];
  let counter = 0;

  function assignX(node) {
    if (!node) return;
    assignX(node.left);
    node._x = counter++;
    assignX(node.right);
  }

  function assignY(node, depth) {
    if (!node) return;
    node._y = depth;
    assignY(node.left, depth + 1);
    assignY(node.right, depth + 1);
  }

  assignX(root);
  assignY(root, 0);

  const H_GAP = NODE_R * 2 + 18;

  function collect(node, parentX, parentY) {
    if (!node) return;
    const x = node._x * H_GAP + NODE_R + 8;
    const y = node._y * V_GAP  + NODE_R + 8;
    nodes.push({ val: node.val, x, y });
    if (parentX !== null) edges.push({ x1: parentX, y1: parentY, x2: x, y2: y });
    collect(node.left,  x, y);
    collect(node.right, x, y);
  }

  collect(root, null, null);
  return { nodes, edges, nodeR: NODE_R };
}
