/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'last-stone-weight',
  title: 'Last Stone Weight',
  difficulty: 'Easy',
  pattern: 'Heap / Priority Queue',
  timeO: 'O(n log n)',
  spaceO: 'O(n)',
  viz: 'heap',
  concept: 'heap-priority-queue',
  description:
    'Return the weight of the last remaining stone after repeatedly smashing the two heaviest stones.',
  examples: [
    { input: 'stones = [2,7,4,1,8,1]', output: '1' },
    { input: 'stones = [1]', output: '1' },
  ],
  testCases: [
    { input: [[2,7,4,1,8,1]], expected: 1 },
    { input: [[1]], expected: 1 },
    { input: [[9,3,2,10]], expected: 0 },
  ],
  hints: [
    'You need the two largest stones over and over.',
    'A max-heap supports repeated largest extraction efficiently.',
    'If the stones differ, push the difference back into the heap.',
  ],
  pattern_explanation:
    'A max-heap efficiently simulates repeated extraction of the two largest items and reinsertion of any remainder.',
  solution: `class MaxHeap {
  constructor(arr = []) {
    this.data = [];
    for (const x of arr) this.push(x);
  }

  push(val) {
    this.data.push(val);
    this.up(this.data.length - 1);
  }

  pop() {
    if (!this.data.length) return 0;
    if (this.data.length === 1) return this.data.pop();
    const top = this.data[0];
    this.data[0] = this.data.pop();
    this.down(0);
    return top;
  }

  up(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.data[p] >= this.data[i]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  down(i) {
    const n = this.data.length;
    while (true) {
      let largest = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < n && this.data[l] > this.data[largest]) largest = l;
      if (r < n && this.data[r] > this.data[largest]) largest = r;
      if (largest === i) break;
      [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
      i = largest;
    }
  }

  size() {
    return this.data.length;
  }
}

function solve(stones) {
  const heap = new MaxHeap(stones);

  while (heap.size() > 1) {
    const y = heap.pop();
    const x = heap.pop();
    if (y !== x) heap.push(y - x);
  }

  return heap.size() ? heap.pop() : 0;
}`,
};
