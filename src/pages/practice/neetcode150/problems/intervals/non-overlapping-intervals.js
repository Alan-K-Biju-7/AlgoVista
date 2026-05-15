/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'non-overlapping-intervals',
  title: 'Non-Overlapping Intervals',
  difficulty: 'Medium',
  pattern: 'Intervals',
  timeO: 'O(n log n)',
  spaceO: 'O(1)',
  viz: 'intervals',
  concept: 'intervals',
  description:
    'Return the minimum number of intervals you must remove to make the rest non-overlapping.',
  examples: [
    { input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1' },
    { input: 'intervals = [[1,2],[1,2],[1,2]]', output: '2' },
  ],
  testCases: [
    { input: [[[1,2],[2,3],[3,4],[1,3]]], expected: 1 },
    { input: [[[1,2],[1,2],[1,2]]], expected: 2 },
    { input: [[[1,2],[2,3]]], expected: 0 },
  ],
  hints: [
    'Sort intervals by start time.',
    'When two intervals overlap, keep the one that ends earlier.',
    'That choice leaves more room for future intervals.',
  ],
  pattern_explanation:
    'The greedy rule of keeping the interval with the smaller end minimizes future overlap risk and yields the minimum removals.',
  solution: `function solve(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  let removals = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];

    if (start < prevEnd) {
      removals++;
      prevEnd = Math.min(prevEnd, end);
    } else {
      prevEnd = end;
    }
  }

  return removals;
}`,
};
