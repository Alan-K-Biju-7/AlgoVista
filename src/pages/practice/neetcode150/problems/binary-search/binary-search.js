export default {
  id: 'binary-search',
  title: 'Binary Search',
  difficulty: 'Easy',
  pattern: 'Binary Search',
  timeO: 'O(log n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'binary-search',
  description:
    'Given a sorted array of distinct integers, return the index of the target or -1 if it is not present.',
  examples: [
    { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
    { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
  ],
  testCases: [
    { input: [[-1,0,3,5,9,12], 9], expected: 4 },
    { input: [[-1,0,3,5,9,12], 2], expected: -1 },
    { input: [[5], 5], expected: 0 },
  ],
  hints: [
    'Use left and right boundaries on the sorted array.',
    'Compare the middle value with target.',
    'Discard the half that cannot contain the answer.',
  ],
  pattern_explanation:
    'Because the array is sorted, every comparison against the middle lets you safely eliminate half of the remaining search space.',
  solution: `function solve(nums, target) {
  let l = 0;
  let r = nums.length - 1;

  while (l <= r) {
    const m = Math.floor((l + r) / 2);

    if (nums[m] === target) return m;
    if (nums[m] < target) l = m + 1;
    else r = m - 1;
  }

  return -1;
}`,
};
