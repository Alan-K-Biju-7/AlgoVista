// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'merge-k-sorted-lists',
  title: 'Merge K Sorted Lists',
  difficulty: 'Hard',
  pattern: 'Linked List',
  timeO: 'O(n log k)',
  spaceO: 'O(k)',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Merge k sorted linked lists into one sorted list.',
  examples: [
    { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
    { input: 'lists = []', output: '[]' },
  ],
  testCases: [
    { input: [[[1,4,5], [1,3,4], [2,6]]], expected: [1,1,2,3,4,4,5,6] },
    { input: [[]], expected: [] },
    { input: [[[], [1]]], expected: [1] },
  ],
  hints: [
    'This is the same merge operation as two sorted lists, repeated efficiently.',
    'A min-heap can always expose the smallest current node.',
    'Another option is divide and conquer: merge lists in pairs.',
  ],
  pattern_explanation:
    'The heap keeps one frontier value from each list, so each extracted minimum is the next node in the merged order.',
  solution: `function solve(lists) {
  const heap = [];

  function push(item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[p].value <= heap[i].value) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  }

  function pop() {
    if (heap.length === 1) return heap.pop();
    const top = heap[0];
    heap[0] = heap.pop();
    let i = 0;

    while (true) {
      let smallest = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;

      if (l < heap.length && heap[l].value < heap[smallest].value) smallest = l;
      if (r < heap.length && heap[r].value < heap[smallest].value) smallest = r;
      if (smallest === i) break;

      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }

    return top;
  }

  for (let listIndex = 0; listIndex < lists.length; listIndex++) {
    if (lists[listIndex].length) {
      push({ value: lists[listIndex][0], listIndex, itemIndex: 0 });
    }
  }

  const out = [];
  while (heap.length) {
    const { value, listIndex, itemIndex } = pop();
    out.push(value);

    const nextIndex = itemIndex + 1;
    if (nextIndex < lists[listIndex].length) {
      push({ value: lists[listIndex][nextIndex], listIndex, itemIndex: nextIndex });
    }
  }

  return out;
}`,
};
