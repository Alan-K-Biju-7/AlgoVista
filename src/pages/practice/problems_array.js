export const arrayProblems = [
  {
    id: 1,
    title: 'Two Sum',
    timeO: 'O(n)',
    spaceO: 'O(n)',
    difficulty: 'Easy',
    pattern: 'Hash Map',
    viz: 'array',
    description:
      'Given an array of integers and a target sum, return the indices of the two numbers that add up to the target. Each input has exactly one solution and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6',
      },
    ],
    hints: [
      'Think about what information you need to store as you scan through the array.',
      'For each number x, you need to know if target minus x exists somewhere earlier in the array.',
      'Use a hash map storing number:index. For each x check if target-x is in the map before inserting x.',
    ],
    pattern_explanation:
      'Hash Map lookup turns O(n squared) brute force into O(n). Store complement to index pairs as you scan.',
    solution:
      'function twoSum(nums, target) {\\n  const map = {};\\n  for (let i = 0; i < nums.length; i++) {\\n    const complement = target - nums[i];\\n    if (complement in map) return [map[complement], i];\\n    map[nums[i]] = i;\\n  }\\n}',
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
  },
  {
    id: 2,
    title: 'Contains Duplicate',
    timeO: 'O(n)',
    spaceO: 'O(n)',
    difficulty: 'Easy',
    pattern: 'Hash Set',
    viz: 'array',
    description:
      'Given an integer array, return true if any value appears at least twice, and false if every element is distinct.',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
        explanation: '1 appears at index 0 and 3',
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
        explanation: 'All elements are distinct',
      },
    ],
    hints: [
      'What data structure lets you check membership in O(1)?',
      'A Set stores unique values. If an element is already in the Set before you add it, you found a duplicate.',
      'Scan left to right. Before inserting each number into the Set, check if it is already there.',
    ],
    pattern_explanation:
      'Set membership check in O(1). Single pass O(n) time, O(n) space.',
    solution:
      'function containsDuplicate(nums) {\\n  const seen = new Set();\\n  for (const n of nums) {\\n    if (seen.has(n)) return true;\\n    seen.add(n);\\n  }\\n  return false;\\n}',
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true },
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[1, 1, 1, 3, 3]], expected: true },
    ],
  },
  {
    id: 3,
    title: 'Best Time to Buy and Sell Stock',
    timeO: 'O(n)',
    spaceO: 'O(1)',
    difficulty: 'Easy',
    pattern: 'Sliding Window',
    viz: 'array',
    description:
      'Given an array where prices[i] is the price of a stock on day i, return the maximum profit you can achieve by buying on one day and selling on a later day. Return 0 if no profit is possible.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 at 1, sell on day 5 at 6.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'Prices only decrease, so no profit is possible.',
      },
    ],
    hints: [
      'You need the largest difference where the buy day comes before the sell day.',
      'Track the minimum price seen so far.',
      'At each price, compare current profit against the best profit.',
    ],
    pattern_explanation:
      'One pass with a running minimum and a running best profit.',
    solution:
      'function maxProfit(prices) {\\n  let minPrice = Infinity, maxProfit = 0;\\n  for (const p of prices) {\\n    minPrice = Math.min(minPrice, p);\\n    maxProfit = Math.max(maxProfit, p - minPrice);\\n  }\\n  return maxProfit;\\n}',
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
      { input: [[1, 2]], expected: 1 },
    ],
  },
  {
    id: 4,
    title: 'Maximum Subarray',
    timeO: 'O(n)',
    spaceO: 'O(1)',
    difficulty: 'Medium',
    pattern: 'Kadane Algorithm',
    viz: 'array',
    description:
      'Given an integer array, find the contiguous subarray with the largest sum and return that sum.',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'Subarray [4,-1,2,1] has sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'Single element.',
      },
    ],
    hints: [
      'Think about when to start a fresh subarray.',
      'If the running sum becomes harmful, reset it.',
      'Track both the current subarray sum and the best sum so far.',
    ],
    pattern_explanation:
      'Kadane algorithm keeps the best running sum in one pass.',
    solution:
      'function maxSubArray(nums) {\\n  let cur = nums[0], best = nums[0];\\n  for (let i = 1; i < nums.length; i++) {\\n    cur = Math.max(nums[i], cur + nums[i]);\\n    best = Math.max(best, cur);\\n  }\\n  return best;\\n}',
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[-1, -2, -3]], expected: -1 },
    ],
  },
  {
    id: 5,
    title: 'Product of Array Except Self',
    timeO: 'O(n)',
    spaceO: 'O(1) extra',
    difficulty: 'Medium',
    pattern: 'Prefix and Suffix',
    viz: 'array',
    description:
      'Given an integer array, return an array where output[i] equals the product of all elements except nums[i]. Solve it in O(n) without division.',
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
        explanation: 'Each output value is the product of all other elements.',
      },
    ],
    hints: [
      'Think of each answer as left product times right product.',
      'Build prefix products first.',
      'Then sweep from the right with a running suffix product.',
    ],
    pattern_explanation:
      'Two passes: one for prefix products and one for suffix products.',
    solution:
      'function productExceptSelf(nums) {\\n  const n = nums.length, res = new Array(n).fill(1);\\n  let prefix = 1;\\n  for (let i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }\\n  let suffix = 1;\\n  for (let i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }\\n  return res;\\n}',
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
    ],
  },
  {
    id: 6,
    title: 'Valid Anagram',
    timeO: 'O(n)',
    spaceO: 'O(n)',
    difficulty: 'Easy',
    pattern: 'Frequency Count',
    viz: 'array',
    description:
      'Given two strings s and t, return true if t is an anagram of s and false otherwise.',
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Both words contain the same letters with the same counts.',
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
        explanation: 'The letter counts do not match.',
      },
    ],
    hints: [
      'Anagrams have equal lengths and equal character counts.',
      'Use a frequency map or fixed-size count array.',
      'Compare both structures after counting.',
    ],
    pattern_explanation:
      'Count each character in both strings and compare the totals.',
    solution:
      'function isAnagram(s, t) {\\n  if (s.length !== t.length) return false;\\n  const count = {};\\n  for (const ch of s) count[ch] = (count[ch] || 0) + 1;\\n  for (const ch of t) {\\n    if (!count[ch]) return false;\\n    count[ch]--;\\n  }\\n  return true;\\n}',
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true },
      { input: ['rat', 'car'], expected: false },
    ],
  },
  {
    id: 7,
    title: 'Top K Frequent Elements',
    timeO: 'O(n)',
    spaceO: 'O(n)',
    difficulty: 'Medium',
    pattern: 'Bucket Frequency',
    viz: 'array',
    description:
      'Given an integer array and an integer k, return the k most frequent elements.',
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: '1 appears 3 times and 2 appears 2 times.',
      },
    ],
    hints: [
      'Count frequencies first.',
      'Then group numbers by frequency.',
      'Walk frequencies from high to low until you collect k values.',
    ],
    pattern_explanation:
      'Bucket by frequency so you can pull the most common values quickly.',
    solution:
      'function topKFrequent(nums, k) {\\n  const count = {};\\n  for (const n of nums) count[n] = (count[n] || 0) + 1;\\n  const buckets = Array(nums.length + 1).fill(0).map(() => []);\\n  for (const key in count) buckets[count[key]].push(Number(key));\\n  const res = [];\\n  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {\\n    for (const n of buckets[i]) {\\n      res.push(n);\\n      if (res.length === k) break;\\n    }\\n  }\\n  return res;\\n}',
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { input: [[1], 1], expected: [1] },
    ],
  },
];
