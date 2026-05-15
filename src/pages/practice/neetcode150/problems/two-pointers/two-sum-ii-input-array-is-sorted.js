/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'two-sum-ii-input-array-is-sorted',
  title: 'Two Sum II - Input Array Is Sorted',
  difficulty: 'Medium',
  pattern: 'Two Pointers',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'two-pointers',
  description:
    'Given a 1-indexed sorted array of integers, return the indices of the two numbers that add up to the target.',
  examples: [
    { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]' },
    { input: 'numbers = [2,3,4], target = 6', output: '[1,3]' },
  ],
  testCases: [
    { input: [[2,7,11,15], 9], expected: [1,2] },
    { input: [[2,3,4], 6], expected: [1,3] },
    { input: [[-1,0], -1], expected: [1,2] },
  ],
  hints: [
    'Because the array is sorted, you can decide which side to move after each sum.',
    'If the sum is too small, move left forward.',
    'If the sum is too large, move right backward.',
  ],
  pattern_explanation:
    'Sorting gives monotonic behavior, so two pointers can converge to the target in one pass.',
  solution: `function solve(numbers, target) {
  let l = 0;
  let r = numbers.length - 1;

  while (l < r) {
    const sum = numbers[l] + numbers[r];
    if (sum === target) return [l + 1, r + 1];
    if (sum < target) l++;
    else r--;
  }

  return [];
}`,
};
