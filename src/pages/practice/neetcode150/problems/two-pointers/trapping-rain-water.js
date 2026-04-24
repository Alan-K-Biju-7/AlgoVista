export default {
  id: 'trapping-rain-water',
  title: 'Trapping Rain Water',
  difficulty: 'Hard',
  pattern: 'Two Pointers',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'two-pointers',
  description:
    'Given an elevation map, compute how much water it can trap after raining.',
  examples: [
    { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
    { input: 'height = [4,2,0,3,2,5]', output: '9' },
  ],
  testCases: [
    { input: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 },
    { input: [[4,2,0,3,2,5]], expected: 9 },
    { input: [[1,0,1]], expected: 1 },
  ],
  hints: [
    'Water level at an index depends on the tallest wall to the left and right.',
    'Track leftMax and rightMax while shrinking inward.',
    'Move the side with the smaller current height.',
  ],
  pattern_explanation:
    'The smaller side limits the guaranteed water level, so two pointers let you compute trapped water in one pass with constant extra space.',
  solution: `function solve(height) {
  let l = 0;
  let r = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= leftMax) leftMax = height[l];
      else water += leftMax - height[l];
      l++;
    } else {
      if (height[r] >= rightMax) rightMax = height[r];
      else water += rightMax - height[r];
      r--;
    }
  }

  return water;
}`,
};
