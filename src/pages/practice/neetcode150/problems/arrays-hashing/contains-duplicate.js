export default {
  id: 'contains-duplicate',
  title: 'Contains Duplicate',
  difficulty: 'Easy',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'hashset',
  concept: 'arrays-hashing',
  description:
    'Given an array nums, return true if any value appears at least twice, and false if every element is distinct.',
  examples: [
    { input: 'nums = [1,2,3,1]',       output: 'true' },
    { input: 'nums = [1,2,3,4]',       output: 'false' },
    { input: 'nums = [1,1,1,3,3,4,3]', output: 'true' },
  ],
  testCases: [
    { input: [[1,2,3,1]],       expected: true  },
    { input: [[1,2,3,4]],       expected: false },
    { input: [[1,1,1,3,3,4,3]], expected: true  },
    { input: [[]],              expected: false },
  ],
  hints: [
    'Sorting gives O(n log n). Can you check duplicates in a single pass?',
    'A set answers "have I seen this value?" in O(1).',
  ],
  pattern_explanation:
    'Use a set as a membership oracle. Add while you scan, and short-circuit on the first repeat.',
  solution: `function solve(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
};
