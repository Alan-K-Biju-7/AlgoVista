export default {
  id: 'minimum-interval-to-include-each-query',
  title: 'Minimum Interval to Include Each Query',
  difficulty: 'Hard',
  pattern: 'Intervals',
  timeO: 'O((n + q) log n)',
  spaceO: 'O(n)',
  viz: 'intervals',
  concept: 'intervals',
  description:
    'For each query, return the size of the smallest interval that includes it, or -1 if none does.',
  examples: [
    { input: 'intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]', output: '[3,3,1,4]' },
    { input: 'intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]', output: '[2,-1,4,6]' },
  ],
  testCases: [
    { input: [[[1,4],[2,4],[3,6],[4,4]], [2,3,4,5]], expected: [3,3,1,4] },
    { input: [[[2,3],[2,5],[1,8],[20,25]], [2,19,5,22]], expected: [2,-1,4,6] },
  ],
  hints: [
    'Sort intervals by left endpoint and queries by value.',
    'As you advance through queries, add every interval whose left endpoint is now active.',
    'Discard heap intervals whose right endpoint is too small for the current query.',
  ],
  pattern_explanation:
    'A sweep over sorted queries plus a min-heap of active intervals lets each query see the smallest covering interval currently available.',
  solution: `function solve(intervals, queries) {
  intervals.sort((a, b) => a[0] - b[0]);
  const sortedQueries = queries.map((q, i) => [q, i]).sort((a, b) => a[0] - b[0]);

  const heap = [];

  function push(item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      if (heap[p][0] <= heap[i][0]) break;
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
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let smallest = i;

      if (left < heap.length && heap[left][0] < heap[smallest][0]) smallest = left;
      if (right < heap.length && heap[right][0] < heap[smallest][0]) smallest = right;
      if (smallest === i) break;

      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }

    return top;
  }

  const res = new Array(queries.length).fill(-1);
  let i = 0;

  for (const [q, idx] of sortedQueries) {
    while (i < intervals.length && intervals[i][0] <= q) {
      const [l, r] = intervals[i];
      push([r - l + 1, r]);
      i++;
    }

    while (heap.length && heap[0][1] < q) {
      pop();
    }

    if (heap.length) {
      res[idx] = heap[0][0];
    }
  }

  return res;
}`,
};
