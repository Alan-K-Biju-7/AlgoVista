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
    'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
  examples: [
    { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
    { input: 'nums = [1], k = 1',           output: '[1]'   },
  ],
  testCases: [
    { input: [[1,1,1,2,2,3], 2], expected: [1,2] },
    { input: [[1], 1],           expected: [1]   },
    { input: [[4,4,4,5,5,6], 2], expected: [4,5] },
  ],
  hints: [
    'Count frequencies first.',
    'Bucket sort by frequency gives O(n) without a heap.',
  ],
  pattern_explanation:
    'Count with a map, then place numbers into buckets indexed by their frequency. Walk buckets from high to low until you collect k.',
  solution: `function solve(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count) buckets[freq].push(num);
  const out = [];
  for (let f = buckets.length - 1; f >= 0 && out.length < k; f--) {
    for (const n of buckets[f]) { out.push(n); if (out.length === k) break; }
  }
  return out;
}`,
};
