export function parent(i)      { return Math.floor((i - 1) / 2); }
export function leftChild(i)   { return 2 * i + 1; }
export function rightChild(i)  { return 2 * i + 2; }

export function swap(arr, i, j) {
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

export function buildMinHeap(arr) {
  const h = [...arr];
  for (let i = Math.floor(h.length / 2) - 1; i >= 0; i--) {
    let cur = i;
    while (true) {
      let smallest = cur;
      const l = leftChild(cur);
      const r = rightChild(cur);
      if (l < h.length && h[l] < h[smallest]) smallest = l;
      if (r < h.length && h[r] < h[smallest]) smallest = r;
      if (smallest === cur) break;
      [h[cur], h[smallest]] = [h[smallest], h[cur]];
      cur = smallest;
    }
  }
  return h;
}

export function heapifyUp(heap, idx) {
  const h = [...heap];
  let i = idx;
  while (i > 0 && h[i] < h[parent(i)]) {
    [h[i], h[parent(i)]] = [h[parent(i)], h[i]];
    i = parent(i);
  }
  return h;
}

export function heapifyDown(heap, idx, size) {
  const h = [...heap];
  let i = idx;
  while (true) {
    let smallest = i;
    const l = leftChild(i);
    const r = rightChild(i);
    if (l < size && h[l] < h[smallest]) smallest = l;
    if (r < size && h[r] < h[smallest]) smallest = r;
    if (smallest === i) break;
    [h[i], h[smallest]] = [h[smallest], h[i]];
    i = smallest;
  }
  return h;
}
