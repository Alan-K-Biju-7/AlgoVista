/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'k-closest-points-to-origin',
  title: 'K Closest Points to Origin',
  difficulty: 'Medium',
  pattern: 'Heap / Priority Queue',
  timeO: 'O(n log k)',
  spaceO: 'O(k)',
  viz: 'heap',
  concept: 'heap-priority-queue',
  description:
    'Return the k points closest to the origin.',
  examples: [
    { input: 'points = [[1,3],[-2,2]], k = 1', output: '[[-2,2]]' },
    { input: 'points = [[3,3],[5,-1],[-2,4]], k = 2', output: '[[3,3],[-2,4]]' },
  ],
  testCases: [
    { input: [[[1,3],[-2,2]], 1], expected: [[-2,2]] },
    { input: [[[3,3],[5,-1],[-2,4]], 2], expected: [[3,3],[-2,4]] },
  ],
  hints: [
    'Distance comparison does not need a square root.',
    'You only need the closest k points, not a fully sorted list.',
    'A heap can discard worse candidates as you go.',
  ],
  pattern_explanation:
    'A bounded heap keeps only the best k candidates seen so far, which is more efficient than sorting everything when k is small.',
  solution: `function solve(points, k) {
  return points
    .slice()
    .sort((a, b) => (a[0] * a[0] + a[1] * a[1]) - (b[0] * b[0] + b[1] * b[1]))
    .slice(0, k);
}`,
};
