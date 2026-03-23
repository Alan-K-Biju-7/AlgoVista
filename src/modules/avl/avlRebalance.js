import { balanceFactor } from './avlUtils';
import { rotateRight, rotateLeft } from './avlRotations';

export function rebalance(node, rotationLog) {
  const bf = balanceFactor(node);

  if (bf > 1) {
    if (balanceFactor(node.left) >= 0) {
      rotationLog && rotationLog.push({ type: 'LL', pivot: node.val, description: `Right-heavy left child at ${node.val} — single Right rotation (LL)` });
      return rotateRight(node);
    } else {
      rotationLog && rotationLog.push({ type: 'LR', pivot: node.val, description: `Left-Right case at ${node.val} — Left rotation on left child, then Right rotation (LR)` });
      node.left = rotateLeft(node.left);
      return rotateRight(node);
    }
  }

  if (bf < -1) {
    if (balanceFactor(node.right) <= 0) {
      rotationLog && rotationLog.push({ type: 'RR', pivot: node.val, description: `Left-heavy right child at ${node.val} — single Left rotation (RR)` });
      return rotateLeft(node);
    } else {
      rotationLog && rotationLog.push({ type: 'RL', pivot: node.val, description: `Right-Left case at ${node.val} — Right rotation on right child, then Left rotation (RL)` });
      node.right = rotateRight(node.right);
      return rotateLeft(node);
    }
  }

  return node;
}
