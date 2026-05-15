/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'meeting-rooms-ii',
  title: 'Meeting Rooms II',
  difficulty: 'Medium',
  pattern: 'Intervals',
  timeO: 'O(n log n)',
  spaceO: 'O(n)',
  viz: 'intervals',
  concept: 'intervals',
  description:
    'Return the minimum number of meeting rooms required to schedule all meetings.',
  examples: [
    { input: 'intervals = [[0,40],[5,10],[15,20]]', output: '2' },
    { input: 'intervals = [[4,9]]', output: '1' },
  ],
  testCases: [
    { input: [[[0,40],[5,10],[15,20]]], expected: 2 },
    { input: [[[4,9]]], expected: 1 },
    { input: [[[0,8],[8,10]]], expected: 1 },
  ],
  hints: [
    'Separate all start times and end times.',
    'If the next meeting starts before the earliest current ending time, you need another room.',
    'Otherwise, reuse a room by advancing the end pointer.',
  ],
  pattern_explanation:
    'Sorting start and end times reduces the problem to counting how many meetings are simultaneously active during a sweep across time.',
  solution: `function solve(intervals) {
  const start = intervals.map(i => i[0]).sort((a, b) => a - b);
  const end = intervals.map(i => i[1]).sort((a, b) => a - b);

  let s = 0;
  let e = 0;
  let rooms = 0;
  let maxRooms = 0;

  while (s < start.length) {
    if (start[s] < end[e]) {
      rooms++;
      maxRooms = Math.max(maxRooms, rooms);
      s++;
    } else {
      rooms--;
      e++;
    }
  }

  return maxRooms;
}`,
};
