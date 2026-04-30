export default {
  id: 'search-in-rotated-sorted-array',
  title: 'Search in Rotated Sorted Array',
  difficulty: 'Medium',
  pattern: 'Binary Search',
  timeO: 'O(log n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'binary-search',
  description:
    'Return the index of target in a rotated sorted array of unique values, or -1 if it is not present.',
  examples: [
    { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
    { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
  ],
  testCases: [
    { input: [[4,5,6,7,0,1,2], 0], expected: 4 },
    { input: [[4,5,6,7,0,1,2], 3], expected: -1 },
    { input: [[1], 0], expected: -1 },
  ],
  hints: [
    'At least one half is always sorted.',
    'Decide whether the target belongs in the sorted half.',
    'Discard the half that cannot contain the target.',
  ],
  pattern_explanation:
    'The rotated array still preserves enough ordering to choose which half is searchable and eliminate the other half in each step.',
  solution: `function solve(nums, target) {
  let l = 0;
  let r = nums.length - 1;

  while (l <= r) {
    const m = Math.floor((l + r) / 2);

    if (nums[m] === target) return m;

    if (nums[l] <= nums[m]) {
      if (nums[l] <= target && target < nums[m]) {
        r = m - 1;
      } else {
        l = m + 1;
      }
    } else {
      if (nums[m] < target && target <= nums[r]) {
        l = m + 1;
      } else {
        r = m - 1;
      }
    }
  }

  return -1;
}`,
};
