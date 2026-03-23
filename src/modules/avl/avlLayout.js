import { balanceFactor } from './avlUtils';

const NODE_R = 24;
const V_GAP  = 72;
const H_GAP  = NODE_R * 2 + 16;

export function computeAVLLayout(root) {
  if (!root) return { nodes: [], edges: [] };

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
    assignY(node.left,  depth + 1);
    assignY(node.right, depth + 1);
  }

  assignX(root);
  assignY(root, 0);

  const nodes = [];
  const edges = [];

  function collect(node, parentX, parentY) {
    if (!node) return;
    const x = node._x * H_GAP + NODE_R + 8;
    const y = node._y * V_GAP  + NODE_R + 8;
    const bf = balanceFactor(node);
    nodes.push({ val: node.val, x, y, bf, height: node.height });
    if (parentX !== null) edges.push({ x1: parentX, y1: parentY, x2: x, y2: y });
    collect(node.left,  x, y);
    collect(node.right, x, y);
  }

  collect(root, null, null);
  return { nodes, edges, nodeR: NODE_R };
}
