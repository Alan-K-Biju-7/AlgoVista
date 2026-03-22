export class BSTNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

export function cloneTree(root) {
  if (!root) return null;
  const n = new BSTNode(root.val);
  n.left = cloneTree(root.left);
  n.right = cloneTree(root.right);
  return n;
}

export function insert(root, val) {
  if (!root) return new BSTNode(val);
  if (val < root.val) root.left = insert(root.left, val);
  else if (val > root.val) root.right = insert(root.right, val);
  return root;
}

export function search(root, val, path = []) {
  if (!root) return { found: false, path };
  path.push(root.val);
  if (val === root.val) return { found: true, path };
  if (val < root.val) return search(root.left, val, path);
  return search(root.right, val, path);
}

function minNode(root) {
  let curr = root;
  while (curr.left) curr = curr.left;
  return curr;
}

export function deleteNode(root, val) {
  if (!root) return null;
  if (val < root.val) { root.left = deleteNode(root.left, val); }
  else if (val > root.val) { root.right = deleteNode(root.right, val); }
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    const successor = minNode(root.right);
    root.val = successor.val;
    root.right = deleteNode(root.right, successor.val);
  }
  return root;
}

export function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

export function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

export function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.val);
  return result;
}

export function buildFromArray(arr) {
  let root = null;
  arr.forEach((v) => { root = insert(root, v); });
  return root;
}

export function treeHeight(root) {
  if (!root) return 0;
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}
