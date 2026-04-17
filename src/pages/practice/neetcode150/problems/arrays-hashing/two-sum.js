export default {
  id: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'hashmap',
  concept: 'arrays-hashing',
  description:
    'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. Exactly one solution exists; do not use the same element twice.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explain: '2 + 7 == 9' },
    { input: 'nums = [3,2,4], target = 6',     output: '[1,2]', explain: '2 + 4 == 6' },
    { input: 'nums = [3,3], target = 6',       output: '[0,1]', explain: '3 + 3 == 6' },
  ],
  testCases: [
    { input: [[2,7,11,15], 9], expected: [0,1] },
    { input: [[3,2,4], 6],     expected: [1,2] },
    { input: [[3,3], 6],       expected: [0,1] },
  ],
  hints: [
    'Brute force is O(n^2). Can you remember what you have already seen?',
    'For each x at index i, the value you need is target - x.',
    'Store value to index in a map while scanning once.',
  ],
  pattern_explanation:
    'Walk the array once. Before inserting nums[i], ask the map for the complement. This turns a nested loop into a single pass.',
  solution: `function solve(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
};
