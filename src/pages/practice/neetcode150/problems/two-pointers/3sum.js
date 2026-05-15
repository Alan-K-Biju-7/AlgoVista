/* eslint-disable import/no-anonymous-default-export */
export default {
  id: '3sum',
  title: '3Sum',
  difficulty: 'Medium',
  pattern: 'Two Pointers',
  timeO: 'O(n^2)',
  spaceO: 'O(1) extra excluding output',
  viz: 'array-pointers',
  concept: 'two-pointers',
  description:
    'Return all unique triplets [nums[i], nums[j], nums[k]] such that they add up to zero.',
  examples: [
    { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
    { input: 'nums = [0,1,1]', output: '[]' },
  ],
  testCases: [
    { input: [[-1,0,1,2,-1,-4]], expected: [[-1,-1,2],[-1,0,1]] },
    { input: [[0,1,1]], expected: [] },
    { input: [[0,0,0]], expected: [[0,0,0]] },
  ],
  hints: [
    'Sort the array first.',
    'Fix one number, then solve a two-sum style problem on the rest.',
    'Skip duplicate anchors and duplicate pointer values.',
  ],
  pattern_explanation:
    '3Sum reduces to repeated two-pointer searches on a sorted array after fixing one anchor.',
  solution: `function solve(nums) {
  nums.sort((a, b) => a - b);
  const out = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let l = i + 1;
    let r = nums.length - 1;

    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];

      if (sum === 0) {
        out.push([nums[i], nums[l], nums[r]]);
        l++;
        r--;

        while (l < r && nums[l] === nums[l - 1]) l++;
        while (l < r && nums[r] === nums[r + 1]) r--;
      } else if (sum < 0) {
        l++;
      } else {
        r--;
      }
    }
  }

  return out;
}`,
};
