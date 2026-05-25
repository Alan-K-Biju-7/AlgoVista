// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'find-the-duplicate-number',
  title: 'Find the Duplicate Number',
  difficulty: 'Medium',
  pattern: 'Linked List',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'linked-list',
  description:
    'Given an array containing n + 1 integers where each integer is in the range 1 to n, return the repeated number without modifying the array.',
  examples: [
    { input: 'nums = [1,3,4,2,2]', output: '2' },
    { input: 'nums = [3,1,3,4,2]', output: '3' },
  ],
  testCases: [
    { input: [[1,3,4,2,2]], expected: 2 },
    { input: [[3,1,3,4,2]], expected: 3 },
    { input: [[3,3,3,3,3]], expected: 3 },
  ],
  hints: [
    'Treat each value as a pointer to the next index.',
    'The duplicate creates a cycle in this implicit linked list.',
    'Use slow and fast pointers to find the cycle entrance.',
  ],
  pattern_explanation:
    'Floyd cycle detection works because nums[i] points to another index, and the repeated value creates the entry point of a cycle.',
  solution: `function solve(nums) {
  let slow = nums[0];
  let fast = nums[0];

  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }

  return slow;
}`,
};
