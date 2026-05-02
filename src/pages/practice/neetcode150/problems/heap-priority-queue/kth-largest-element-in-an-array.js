export default {
  id: 'kth-largest-element-in-an-array',
  title: 'Kth Largest Element in an Array',
  difficulty: 'Medium',
  pattern: 'Heap / Priority Queue',
  timeO: 'O(n log k)',
  spaceO: 'O(k)',
  viz: 'heap',
  concept: 'heap-priority-queue',
  description:
    'Return the kth largest element in an unsorted array.',
  examples: [
    { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
    { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
  ],
  testCases: [
    { input: [[3,2,1,5,6,4], 2], expected: 5 },
    { input: [[3,2,3,1,2,4,5,5,6], 4], expected: 4 },
    { input: [[1], 1], expected: 1 },
  ],
  hints: [
    'The kth largest is the smallest among the top k elements.',
    'A min-heap of size k tracks those top k elements efficiently.',
    'Whenever heap size exceeds k, remove the smallest element.',
  ],
  pattern_explanation:
    'A bounded min-heap stores exactly the top k values, so its root is the kth largest overall.',
  solution: `class MinHeap {
  constructor() {
    this.data = [];
  }

  push(val) {
    this.data.push(val);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.data[p] <= this.data[i]) break;
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
      let smallest = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;

      if (l < this.data.length && this.data[l] < this.data[smallest]) smallest = l;
      if (r < this.data.length && this.data[r] < this.data[smallest]) smallest = r;
      if (smallest === i) break;

      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }

    return top;
  }

  peek() {
    return this.data[0];
  }

  size() {
    return this.data.length;
  }
}

function solve(nums, k) {
  const heap = new MinHeap();

  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) heap.pop();
  }

  return heap.peek();
}`,
};
