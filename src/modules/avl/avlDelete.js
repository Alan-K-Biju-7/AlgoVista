import { updateHeight } from './avlUtils';
import { rebalance } from './avlRebalance';

function minNode(node) {
  let curr = node;
  while (curr.left) curr = curr.left;
  return curr;
}

export function avlDelete(node, val, rotationLog) {
  if (!node) return null;

  if (val < node.val) {
    node.left = avlDelete(node.left, val, rotationLog);
  } else if (val > node.val) {
    node.right = avlDelete(node.right, val, rotationLog);
  } else {
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    const successor = minNode(node.right);
    node.val   = successor.val;
    node.right = avlDelete(node.right, successor.val, rotationLog);
  }

  updateHeight(node);
  return rebalance(node, rotationLog);
}
