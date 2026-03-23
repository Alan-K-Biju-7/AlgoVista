export class AVLNode {
  constructor(val) {
    this.val    = val;
    this.left   = null;
    this.right  = null;
    this.height = 1;
  }
}

export function height(node) {
  return node ? node.height : 0;
}

export function balanceFactor(node) {
  return node ? height(node.left) - height(node.right) : 0;
}

export function updateHeight(node) {
  if (node) node.height = 1 + Math.max(height(node.left), height(node.right));
}

export function cloneAVL(node) {
  if (!node) return null;
  const n = new AVLNode(node.val);
  n.height = node.height;
  n.left   = cloneAVL(node.left);
  n.right  = cloneAVL(node.right);
  return n;
}
