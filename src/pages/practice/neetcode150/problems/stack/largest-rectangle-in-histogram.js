/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'largest-rectangle-in-histogram',
  title: 'Largest Rectangle in Histogram',
  difficulty: 'Hard',
  pattern: 'Stack',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'stack',
  concept: 'stack',
  description:
    'Return the area of the largest rectangle that can be formed in the histogram.',
  examples: [
    { input: 'heights = [2,1,5,6,2,3]', output: '10' },
    { input: 'heights = [2,4]', output: '4' },
  ],
  testCases: [
    { input: [[2,1,5,6,2,3]], expected: 10 },
    { input: [[2,4]], expected: 4 },
    { input: [[2,1,2]], expected: 3 },
  ],
  hints: [
    'Each bar wants to know how far it can extend left and right before hitting a shorter bar.',
    'Use a monotonic increasing stack of indices or start positions.',
    'When the current height is smaller, pop taller bars and compute their areas.',
  ],
  pattern_explanation:
    'A monotonic stack lets each bar discover its effective width in O(1) amortized time, producing an overall O(n) solution.',
  solution: `function solve(heights) {
  let maxArea = 0;
  const stack = [];

  for (let i = 0; i < heights.length; i++) {
    let start = i;

    while (stack.length && stack[stack.length - 1][1] > heights[i]) {
      const [index, height] = stack.pop();
      maxArea = Math.max(maxArea, height * (i - index));
      start = index;
    }

    stack.push([start, heights[i]]);
  }

  for (const [index, height] of stack) {
    maxArea = Math.max(maxArea, height * (heights.length - index));
  }

  return maxArea;
}`,
};
