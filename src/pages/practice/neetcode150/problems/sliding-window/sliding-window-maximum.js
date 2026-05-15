/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'sliding-window-maximum',
  title: 'Sliding Window Maximum',
  difficulty: 'Hard',
  pattern: 'Sliding Window',
  timeO: 'O(n)',
  spaceO: 'O(k)',
  viz: 'array-pointers',
  concept: 'sliding-window',
  description:
    'Return the maximum value in every contiguous subarray of size k.',
  examples: [
    { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]' },
    { input: 'nums = [1], k = 1', output: '[1]' },
  ],
  testCases: [
    { input: [[1,3,-1,-3,5,3,6,7], 3], expected: [3,3,5,5,6,7] },
    { input: [[1], 1], expected: [1] },
    { input: [[7,2,4], 2], expected: [7,4] },
  ],
  hints: [
    'A deque can store candidate indices for the max.',
    'Remove indices that fall out of the window.',
    'Remove smaller values from the back before pushing the new index.',
  ],
  pattern_explanation:
    'A monotonic deque maintains window maximum candidates in decreasing order, so the front always gives the current answer.',
  solution: `function solve(nums, k) {
  const deque = [];
  const out = [];

  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) {
      deque.shift();
    }

    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }

    deque.push(i);

    if (i >= k - 1) {
      out.push(nums[deque[0]]);
    }
  }

  return out;
}`,
};
