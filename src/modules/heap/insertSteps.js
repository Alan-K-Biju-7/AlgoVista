import { parent, heapifyUp } from './heapLogic';

export function generateInsertSteps(heap, val) {
  const steps = [];
  let h = [...heap, val];
  let i = h.length - 1;

  steps.push({
    heap: [...h], highlightIdx: [i], swapPair: null, phase: 'insert',
    message: `Insert ${val} at index ${i} (end of array). Now bubble it up to restore min-heap property.`,
  });

  while (i > 0) {
    const p = parent(i);
    steps.push({
      heap: [...h], highlightIdx: [i, p], swapPair: [i, p], phase: 'compare',
      message: `Compare ${h[i]} at index ${i} with parent ${h[p]} at index ${p}. ${h[i] < h[p] ? `${h[i]} < ${h[p]} — swap needed.` : `${h[i]} ≥ ${h[p]} — heap property satisfied, stop.`}`,
    });
    if (h[i] >= h[p]) break;
    const tmp = h[i]; h[i] = h[p]; h[p] = tmp;
    steps.push({
      heap: [...h], highlightIdx: [p], swapPair: null, phase: 'swap',
      message: `Swapped. ${h[p]} is now at index ${p}. Continue bubbling up.`,
    });
    i = p;
  }

  steps.push({
    heap: [...h], highlightIdx: [], swapPair: null, phase: 'done',
    message: `Insert complete. Min-heap property restored. Min value: ${h[0]}.`,
  });

  return steps;
}
