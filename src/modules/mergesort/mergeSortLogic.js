export function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

export function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

export function buildSplitTree(arr, depth = 0, startIdx = 0) {
  const node = { arr: [...arr], depth, startIdx, left: null, right: null };
  if (arr.length <= 1) return node;
  const mid = Math.floor(arr.length / 2);
  node.left  = buildSplitTree(arr.slice(0, mid), depth + 1, startIdx);
  node.right = buildSplitTree(arr.slice(mid), depth + 1, startIdx + mid);
  return node;
}

export function getMaxDepth(node) {
  if (!node) return 0;
  return 1 + Math.max(getMaxDepth(node.left), getMaxDepth(node.right));
}

export const DEFAULT_ARRAY = [38, 27, 43, 3, 9, 82, 10, 25];
export const PRESET_ARRAYS = {
  default:  [38, 27, 43, 3, 9, 82, 10, 25],
  sorted:   [1, 2, 3, 4, 5, 6, 7, 8],
  reversed: [8, 7, 6, 5, 4, 3, 2, 1],
  random:   () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 5),
};
