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
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    { input: 'nums = [3,3], target = 6', output: '[0,1]' },
  ],
  testCases: [
    { input: [[2,7,11,15], 9], expected: [0,1] },
    { input: [[3,2,4], 6], expected: [1,2] },
    { input: [[3,3], 6], expected: [0,1] },
  ],
  hints: [
    'Think about what number you need to complete the target.',
    'Store previously seen numbers in a map.',
    'Check the complement before inserting the current number.',
  ],
  pattern_explanation:
    'A hash map lets you look up the needed complement in O(1) while scanning once.',
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
