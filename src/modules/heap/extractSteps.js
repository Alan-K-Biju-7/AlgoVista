import { leftChild, rightChild } from './heapLogic';

export function generateExtractSteps(heap) {
  if (heap.length === 0) return [];
  const steps = [];
  let h = [...heap];
  const minVal = h[0];

  steps.push({
    heap: [...h], highlightIdx: [0], swapPair: null, phase: 'extract', extractedVal: minVal,
    message: `Extract minimum: ${minVal} at index 0 (root). This is always the smallest element in a min-heap.`,
  });

  // Move last element to root
  h[0] = h[h.length - 1];
  h = h.slice(0, h.length - 1);

  steps.push({
    heap: [...h], highlightIdx: [0], swapPair: null, phase: 'move', extractedVal: minVal,
    message: `Move last element ${h[0]} to root (index 0). Remove last slot. Heap size is now ${h.length}. Now heapify down.`,
  });

  // Heapify down with steps
  let i = 0;
  while (true) {
    let smallest = i;
    const l = leftChild(i);
    const r = rightChild(i);
    if (l < h.length && h[l] < h[smallest]) smallest = l;
    if (r < h.length && h[r] < h[smallest]) smallest = r;

    const candidates = [i, l < h.length ? l : null, r < h.length ? r : null].filter((x) => x !== null);

    steps.push({
      heap: [...h], highlightIdx: candidates, swapPair: smallest !== i ? [i, smallest] : null,
      phase: 'compare', extractedVal: minVal,
      message: smallest !== i
        ? `Compare ${h[i]} (idx ${i}) with children${l < h.length ? ` L=${h[l]}` : ''}${r < h.length ? ` R=${h[r]}` : ''}. Smallest is ${h[smallest]} at index ${smallest} — swap.`
        : `${h[i]} at index ${i} is already ≤ both children. Min-heap property restored — stop.`,
    });

    if (smallest === i) break;

    const tmp = h[i]; h[i] = h[smallest]; h[smallest] = tmp;

    steps.push({
      heap: [...h], highlightIdx: [smallest], swapPair: null, phase: 'swap', extractedVal: minVal,
      message: `Swapped. ${h[smallest]} is now at index ${smallest}. Continue heapifying down.`,
    });

    i = smallest;
  }

  steps.push({
    heap: [...h], highlightIdx: [], swapPair: null, phase: 'done', extractedVal: minVal,
    message: `Extract-min complete ✓  Removed: ${minVal}. New minimum: ${h.length > 0 ? h[0] : 'heap is empty'}.`,
  });

  return steps;
}
