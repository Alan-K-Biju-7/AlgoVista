export default {
  id: 'container-with-most-water',
  title: 'Container With Most Water',
  difficulty: 'Medium',
  pattern: 'Two Pointers',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'two-pointers',
  description:
    'Given an array of heights, return the maximum area of water a container can store.',
  examples: [
    { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
    { input: 'height = [1,1]', output: '1' },
  ],
  testCases: [
    { input: [[1,8,6,2,5,4,8,3,7]], expected: 49 },
    { input: [[1,1]], expected: 1 },
    { input: [[4,3,2,1,4]], expected: 16 },
  ],
  hints: [
    'Area depends on width and the shorter wall.',
    'Start with the widest container.',
    'Move the pointer at the shorter height.',
  ],
  pattern_explanation:
    'Two pointers work because once the shorter wall is fixed, shrinking width cannot produce a better container unless that shorter wall changes.',
  solution: `function solve(height) {
  let l = 0;
  let r = height.length - 1;
  let best = 0;

  while (l < r) {
    const area = (r - l) * Math.min(height[l], height[r]);
    best = Math.max(best, area);

    if (height[l] < height[r]) l++;
    else r--;
  }

  return best;
}`,
};
