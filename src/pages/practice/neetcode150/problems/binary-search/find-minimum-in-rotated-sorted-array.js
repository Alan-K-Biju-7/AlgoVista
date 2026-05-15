/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'find-minimum-in-rotated-sorted-array',
  title: 'Find Minimum in Rotated Sorted Array',
  difficulty: 'Medium',
  pattern: 'Binary Search',
  timeO: 'O(log n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'binary-search',
  description:
    'Return the minimum element in a rotated sorted array of unique elements.',
  examples: [
    { input: 'nums = [3,4,5,1,2]', output: '1' },
    { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
  ],
  testCases: [
    { input: [[3,4,5,1,2]], expected: 1 },
    { input: [[4,5,6,7,0,1,2]], expected: 0 },
    { input: [[11,13,15,17]], expected: 11 },
  ],
  hints: [
    'Compare the middle element with the right boundary.',
    'If middle is larger than right, the minimum must be to the right.',
    'Otherwise the minimum is at middle or to the left.',
  ],
  pattern_explanation:
    'Binary search works because the rotation creates one sorted side and one side containing the pivot, which is enough to discard half the space each step.',
  solution: `function solve(nums) {
  let l = 0;
  let r = nums.length - 1;

  while (l < r) {
    const m = Math.floor((l + r) / 2);

    if (nums[m] > nums[r]) {
      l = m + 1;
    } else {
      r = m;
    }
  }

  return nums[l];
}`,
};
