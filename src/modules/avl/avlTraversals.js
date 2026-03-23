export function avlSearch(node, val, path = []) {
  if (!node) return { found: false, path };
  path.push(node.val);
  if (val === node.val) return { found: true, path };
  if (val < node.val)  return avlSearch(node.left,  val, path);
  return               avlSearch(node.right, val, path);
}

export function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
  return result;
}

export function preorder(node, result = []) {
  if (!node) return result;
  result.push(node.val);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}

export function postorder(node, result = []) {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.val);
  return result;
}

export function collectAllVals(node, result = []) {
  if (!node) return result;
  result.push(node.val);
  collectAllVals(node.left, result);
  collectAllVals(node.right, result);
  return result;
}
