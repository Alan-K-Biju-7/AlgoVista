/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'product-except-self',
  title: 'Product of Array Except Self',
  difficulty: 'Medium',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(1) extra excluding output',
  viz: 'array-pointers',
  concept: 'arrays-hashing',
  description:
    'Return an array where each element is the product of all other elements.',
  examples: [
    { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
  ],
  testCases: [
    { input: [[1,2,3,4]], expected: [24,12,8,6] },
    { input: [[-1,1,0,-3,3]], expected: [0,0,9,0,0] },
  ],
  hints: [
    'Build prefix products on the way in and suffix products on the way back.',
  ],
  pattern_explanation:
    'This is a two-pass prefix/suffix product technique without division.',
  solution: `function solve(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) {
    out[i] = left;
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}`,
};
