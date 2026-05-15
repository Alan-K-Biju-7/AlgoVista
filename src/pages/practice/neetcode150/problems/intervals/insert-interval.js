/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'insert-interval',
  title: 'Insert Interval',
  difficulty: 'Medium',
  pattern: 'Intervals',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'intervals',
  concept: 'intervals',
  description:
    'Insert a new interval into a sorted non-overlapping list and merge if necessary.',
  examples: [
    { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]' },
    { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]' },
  ],
  testCases: [
    { input: [[[1,3],[6,9]], [2,5]], expected: [[1,5],[6,9]] },
    { input: [[[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]], expected: [[1,2],[3,10],[12,16]] },
    { input: [[], [5,7]], expected: [[5,7]] },
  ],
  hints: [
    'Intervals completely before the new one can be appended directly.',
    'Intervals overlapping the new one should be merged into a single interval.',
    'Intervals completely after the merged result can be appended afterward.',
  ],
  pattern_explanation:
    'Because the input intervals are already sorted and disjoint, one linear scan can separate before, overlap, and after regions cleanly.',
  solution: `function solve(intervals, newInterval) {
  const res = [];
  let i = 0;

  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i]);
    i++;
  }

  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }

  res.push(newInterval);

  while (i < intervals.length) {
    res.push(intervals[i]);
    i++;
  }

  return res;
}`,
};
