/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'top-k-frequent-elements',
  title: 'Top K Frequent Elements',
  difficulty: 'Medium',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'hashmap',
  concept: 'arrays-hashing',
  description:
    'Return the k most frequent elements in the array.',
  examples: [
    { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
  ],
  testCases: [
    { input: [[1,1,1,2,2,3], 2], expected: [1,2] },
    { input: [[1], 1], expected: [1] },
  ],
  hints: [
    'Count first, then group numbers by frequency.',
  ],
  pattern_explanation:
    'Hash the frequencies, then use buckets indexed by frequency to collect the top k values in linear time.',
  solution: `function solve(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count) buckets[freq].push(num);
  const out = [];
  for (let f = buckets.length - 1; f >= 0 && out.length < k; f--) {
    for (const n of buckets[f]) {
      out.push(n);
      if (out.length === k) break;
    }
  }
  return out;
}`,
};
