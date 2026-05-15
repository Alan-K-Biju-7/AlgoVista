/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'longest-consecutive-sequence',
  title: 'Longest Consecutive Sequence',
  difficulty: 'Medium',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'hashset',
  concept: 'arrays-hashing',
  description:
    'Return the length of the longest consecutive sequence in an unsorted array.',
  examples: [
    { input: 'nums = [100,4,200,1,3,2]', output: '4' },
  ],
  testCases: [
    { input: [[100,4,200,1,3,2]], expected: 4 },
    { input: [[0,3,7,2,5,8,4,6,0,1]], expected: 9 },
  ],
  hints: [
    'Only start counting from numbers that do not have a predecessor.',
  ],
  pattern_explanation:
    'A set gives O(1) membership checks, so you can grow only true starts of sequences.',
  solution: `function solve(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (!set.has(n - 1)) {
      let len = 1;
      let cur = n;
      while (set.has(cur + 1)) {
        cur++;
        len++;
      }
      best = Math.max(best, len);
    }
  }
  return best;
}`,
};
