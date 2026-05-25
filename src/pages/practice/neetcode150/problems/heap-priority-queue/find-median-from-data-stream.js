// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'find-median-from-data-stream',
  title: 'Find Median From Data Stream',
  difficulty: 'Hard',
  pattern: 'Heap / Priority Queue',
  timeO: 'O(log n) per add',
  spaceO: 'O(n)',
  viz: 'heap',
  concept: 'heap-priority-queue',
  description:
    'Design a data structure that supports adding numbers and finding the current median.',
  examples: [
    { input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()', output: '[1.5, 2]' },
    { input: 'addNum(5), findMedian(), addNum(10), findMedian()', output: '[5, 7.5]' },
  ],
  testCases: [
    { input: [[['add',1], ['add',2], ['median'], ['add',3], ['median']]], expected: [1.5, 2] },
    { input: [[['add',5], ['median'], ['add',10], ['median']]], expected: [5, 7.5] },
    { input: [[['add',2], ['add',1], ['add',5], ['median']]], expected: [2] },
  ],
  hints: [
    'Keep the smaller half in a max-heap and the larger half in a min-heap.',
    'Rebalance so the heaps differ in size by at most one.',
    'The median comes from the heap tops.',
  ],
  pattern_explanation:
    'Two heaps split the stream around the median: one heap owns the lower half and one owns the upper half.',
  solution: `class Heap {
  constructor(compare) {
    this.data = [];
    this.compare = compare;
  }

  peek() {
    return this.data[0];
  }

  size() {
    return this.data.length;
  }

  push(value) {
    this.data.push(value);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.compare(this.data[p], this.data[i])) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  pop() {
    if (this.data.length === 1) return this.data.pop();
    const top = this.data[0];
    this.data[0] = this.data.pop();
    let i = 0;

    while (true) {
      let best = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;

      if (l < this.data.length && !this.compare(this.data[best], this.data[l])) best = l;
      if (r < this.data.length && !this.compare(this.data[best], this.data[r])) best = r;
      if (best === i) break;

      [this.data[i], this.data[best]] = [this.data[best], this.data[i]];
      i = best;
    }

    return top;
  }
}

function solve(operations) {
  const low = new Heap((a, b) => a >= b);
  const high = new Heap((a, b) => a <= b);
  const out = [];

  function addNum(num) {
    if (!low.size() || num <= low.peek()) low.push(num);
    else high.push(num);

    if (low.size() > high.size() + 1) high.push(low.pop());
    if (high.size() > low.size()) low.push(high.pop());
  }

  function findMedian() {
    if (low.size() === high.size()) return (low.peek() + high.peek()) / 2;
    return low.peek();
  }

  for (const op of operations) {
    if (op[0] === 'add') addNum(op[1]);
    if (op[0] === 'median') out.push(findMedian());
  }

  return out;
}`,
};
