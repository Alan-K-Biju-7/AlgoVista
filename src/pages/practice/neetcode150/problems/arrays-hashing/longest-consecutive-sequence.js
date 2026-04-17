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
    'Given an unsorted array of integers, return the length of the longest sequence of consecutive integers. Must run in O(n).',
  examples: [
    { input: 'nums = [100,4,200,1,3,2]',        output: '4' },
    { input: 'nums = [0,3,7,2,5,8,4,6,0,1]',    output: '9' },
  ],
  testCases: [
    { input: [[100,4,200,1,3,2]],    expected: 4 },
    { input: [[0,3,7,2,5,8,4,6,0,1]],expected: 9 },
    { input: [[]],                   expected: 0 },
  ],
  hints: [
    'Put everything in a set.',
    'Only start counting from numbers that do not have a predecessor.',
  ],
  pattern_explanation:
    'Set membership lets you pick true sequence starts and walk forward once. Each number is visited at most twice total.',
  solution: `function solve(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (!set.has(n - 1)) {
      let cur = n, len = 1;
      while (set.has(cur + 1)) { cur++; len++; }
      if (len > best) best = len;
    }
  }
  return best;
}`,
};
