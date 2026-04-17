export default {
  id: 'product-except-self',
  title: 'Product of Array Except Self',
  difficulty: 'Medium',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(1) extra (excluding the output)',
  viz: 'array-pointers',
  concept: 'arrays-hashing',
  description:
    'Given an integer array nums, return an array answer such that answer[i] is the product of all elements of nums except nums[i]. Solve without division and in O(n).',
  examples: [
    { input: 'nums = [1,2,3,4]',    output: '[24,12,8,6]'  },
    { input: 'nums = [-1,1,0,-3,3]',output: '[0,0,9,0,0]' },
  ],
  testCases: [
    { input: [[1,2,3,4]],     expected: [24,12,8,6] },
    { input: [[-1,1,0,-3,3]], expected: [0,0,9,0,0] },
  ],
  hints: [
    'Think prefix products from the left and suffix products from the right.',
    'You can build the answer in two passes using the output array itself.',
  ],
  pattern_explanation:
    'Left-then-right scan. First pass: answer[i] = product of everything to the left. Second pass: multiply in the running product from the right.',
  solution: `function solve(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { out[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }
  return out;
}`,
};
