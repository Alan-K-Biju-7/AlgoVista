/* eslint-disable import/no-anonymous-default-export */
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
    'Return true if any value appears at least twice in the array.',
  examples: [
    { input: 'nums = [1,2,3,1]', output: 'true' },
    { input: 'nums = [1,2,3,4]', output: 'false' },
  ],
  testCases: [
    { input: [[1,2,3,1]], expected: true },
    { input: [[1,2,3,4]], expected: false },
    { input: [[1,1,1]], expected: true },
  ],
  hints: [
    'A set answers “have I seen this before?” quickly.',
  ],
  pattern_explanation:
    'Scan once, storing seen elements in a set. A repeat means a duplicate exists.',
  solution: `function solve(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
};
