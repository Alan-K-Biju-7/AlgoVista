import { AVLNode, updateHeight } from './avlUtils';
import { rebalance } from './avlRebalance';

export function avlInsert(node, val, rotationLog) {
  if (!node) return new AVLNode(val);
  if (val < node.val)      node.left  = avlInsert(node.left,  val, rotationLog);
  else if (val > node.val) node.right = avlInsert(node.right, val, rotationLog);
  else return node;
  updateHeight(node);
  return rebalance(node, rotationLog);
}

export function buildAVLFromArray(arr) {
  let root = null;
  arr.forEach((v) => { root = avlInsert(root, v, []); });
  return root;
}
