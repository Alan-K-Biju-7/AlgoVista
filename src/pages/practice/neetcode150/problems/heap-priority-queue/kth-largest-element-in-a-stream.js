export default {
  id: 'kth-largest-element-in-a-stream',
  title: 'Kth Largest Element in a Stream',
  difficulty: 'Easy',
  pattern: 'Heap / Priority Queue',
  timeO: 'O(log k) per add',
  spaceO: 'O(k)',
  viz: 'heap',
  concept: 'heap-priority-queue',
  description:
    'Design a class that returns the kth largest element after each addition to the stream.',
  examples: [
    { input: 'k = 3, nums = [4,5,8,2], add(3), add(5), add(10), add(9), add(4)', output: '[4,5,5,8,8]' },
    { input: 'k = 1, nums = [], add(-3), add(-2), add(-4), add(0), add(4)', output: '[-3,-2,-2,0,4]' },
  ],
  testCases: [
    {
      input: [3, [4,5,8,2], [3,5,10,9,4]],
      expected: [4,5,5,8,8]
    },
    {
      input: [1, [], [-3,-2,-4,0,4]],
      expected: [-3,-2,-2,0,4]
    }
  ],
  hints: [
    'You do not need to keep every value in the stream.',
    'Keep only the k largest values seen so far.',
    'The smallest value among those k values is the kth largest overall.',
  ],
  pattern_explanation:
    'A min-heap of size k keeps exactly the top k elements, with the kth largest sitting at the root.',
  solution: `class MinHeap {
  constructor() {
    this.data = [];
  }

  peek() {
    return this.data[0];
  }

  push(val) {
    this.data.push(val);
    this.bubbleUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 1) return this.data.pop();
    const top = this.data[0];
    this.data[0] = this.data.pop();
    this.bubbleDown(0);
    return top;
  }

  bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.data[p] <= this.data[i]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  bubbleDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;

      if (l < n && this.data[l] < this.data[smallest]) smallest = l;
      if (r < n && this.data[r] < this.data[smallest]) smallest = r;
      if (smallest === i) break;

      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }

  size() {
    return this.data.length;
  }
}

function solve(k, nums, additions) {
  const heap = new MinHeap();

  function add(val) {
    heap.push(val);
    if (heap.size() > k) heap.pop();
    return heap.peek();
  }

  for (const num of nums) add(num);
  return additions.map(add);
}`,
};
