/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'meeting-rooms',
  title: 'Meeting Rooms',
  difficulty: 'Easy',
  pattern: 'Intervals',
  timeO: 'O(n log n)',
  spaceO: 'O(1)',
  viz: 'intervals',
  concept: 'intervals',
  description:
    'Return true if a person can attend all meetings without any time conflicts.',
  examples: [
    { input: 'intervals = [[0,30],[5,10],[15,20]]', output: 'false' },
    { input: 'intervals = [[5,8],[9,15]]', output: 'true' },
  ],
  testCases: [
    { input: [[[0,30],[5,10],[15,20]]], expected: false },
    { input: [[[5,8],[9,15]]], expected: true },
    { input: [[[7,10],[2,4]]], expected: true },
  ],
  hints: [
    'Two meetings conflict if the later one starts before the earlier one ends.',
    'Sorting by start time makes conflicts visible between adjacent intervals.',
    'You only need to compare neighboring meetings after sorting.',
  ],
  pattern_explanation:
    'After sorting by start time, any overlap must appear between adjacent meetings, so a single scan detects conflicts.',
  solution: `function solve(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) {
      return false;
    }
  }

  return true;
}`,
};
