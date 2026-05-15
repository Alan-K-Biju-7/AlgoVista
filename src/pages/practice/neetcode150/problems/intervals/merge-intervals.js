/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'merge-intervals',
  title: 'Merge Intervals',
  difficulty: 'Medium',
  pattern: 'Intervals',
  timeO: 'O(n log n)',
  spaceO: 'O(n)',
  viz: 'intervals',
  concept: 'intervals',
  description:
    'Merge all overlapping intervals and return the resulting non-overlapping intervals.',
  examples: [
    { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
  ],
  testCases: [
    { input: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]] },
    { input: [[[1,4],[4,5]]], expected: [[1,5]] },
    { input: [[[1,4],[0,2],[3,5]]], expected: [[0,5]] },
  ],
  hints: [
    'Sort intervals by start time first.',
    'Only the most recently merged interval can overlap with the current one.',
    'If they overlap, extend the end; otherwise, append a new interval.',
  ],
  pattern_explanation:
    'Sorting makes overlaps local, so one scan can greedily merge each interval into the current output tail when needed.',
  solution: `function solve(intervals) {
  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0].slice()];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = res[res.length - 1];

    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      res.push([start, end]);
    }
  }

  return res;
}`,
};
