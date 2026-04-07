export const arrayProblems = [
  {
    id: 1, title: 'Two Sum', timeO: 'O(n)', spaceO: 'O(n)', difficulty: 'Easy', pattern: 'Hash Map', viz: 'array',
    description: 'Given an array of integers and a target sum, return the indices of the two numbers that add up to the target. Each input has exactly one solution and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6',     output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    hints: [
      'Think about what information you need to store as you scan through the array.',
      'For each number x, you need to know if target minus x exists somewhere earlier in the array.',
      'Use a hash map storing number:index. For each x check if target-x is in the map before inserting x.',
    ],
    pattern_explanation: 'Hash Map lookup turns O(n squared) brute force into O(n). Store complement to index pairs as you scan.',
    solution: 'function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (complement in map) return [map[complement], i];\n    map[nums[i]] = i;\n  }\n}',
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6],     expected: [1,2] },
      { input: [[3,3], 6],       expected: [0,1] },
    ],
  },
  {
    id: 2, title: 'Contains Duplicate', timeO: 'O(n)', spaceO: 'O(n)', difficulty: 'Easy', pattern: 'Hash Set', viz: 'array',
    description: 'Given an integer array, return true if any value appears at least twice, and false if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true',  explanation: '1 appears at index 0 and 3' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: 'All elements are distinct' },
    ],
    hints: [
      'What data structure lets you check membership in O(1)?',
      'A Set stores unique values. If an element is already in the Set before you add it, you found a duplicate.',
      'Scan left to right. Before inserting each number into the Set, check if it is already there.',
    ],
    pattern_explanation: 'Set membership check in O(1). Single pass O(n) time, O(n) space.',
    solution: 'function containsDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}',
    testCases: [
      { input: [[1,2,3,1]],   expected: true  },
      { input: [[1,2,3,4]],   expected: false },
      { input: [[1,1,1,3,3]], expected: true  },
    ],
  },
  {
    id: 3, title: 'Best Time to Buy and Sell Stock', timeO: 'O(n)', spaceO: 'O(1)' to Buy and Sell Stock', difficulty: 'Easy', pattern: 'Sliding Window', viz: 'array',
    description: 'Given an array where prices[i] is the price of a stock on day i, return the maximum profit you can achieve by buying on one day and selling on a later day. Return 0 if no profit is possible.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 5.' },
      { input: 'prices = [7,6,4,3,1]',   output: '0', explanation: 'Prices only decrease, no profitable trade.' },
    ],
    hints: [
      'You need the largest difference prices[j] minus prices[i] where j is greater than i.',
      'Track the minimum price seen so far as you scan left to right.',
      'At each day compute profit = price minus minSoFar. Update maxProfit if this is larger.',
    ],
    pattern_explanation: 'One pass with two trackers: minPrice and maxProfit. No need to look back.',
    solution: 'function maxProfit(prices) {\n  let minPrice = Infinity, maxProfit = 0;\n  for (const p of prices) {\n    minPrice = Math.min(minPrice, p);\n    maxProfit = Math.max(maxProfit, p - minPrice);\n  }\n  return maxProfit;\n}',
    testCases: [
      { input: [[7,1,5,3,6,4]], expected: 5 },
      { input: [[7,6,4,3,1]],   expected: 0 },
      { input: [[1,2]],         expected: 1 },
    ],
  },
  {
    id: 4, title: 'Maximum Subarray', difficulty: 'Medium', pattern: 'Kadane Algorithm', viz: 'array',
    description: 'Given an integer array, find the contiguous subarray with the largest sum and return that sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has sum 6.' },
      { input: 'nums = [1]',                      output: '1', explanation: 'Single element.' },
    ],
    hints: [
      'Think about when it makes sense to start a new subarray vs extending the current one.',
      'If your running sum goes negative, starting fresh from the next element is always better.',
      'Kadane: currentSum = max(num, currentSum + num). maxSum = max(maxSum, currentSum).',
    ],
    pattern_explanation: 'Kadane algorithm — O(n) single pass. Reset the running sum when it goes negative.',
    solution: 'function maxSubArray(nums) {\n  let cur = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    best = Math.max(best, cur);\n  }\n  return best;\n}',
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6  },
      { input: [[1]],                      expected: 1  },
      { input: [[-1,-2,-3]],               expected: -1 },
    ],
  },
  {
    id: 5, title: 'Product of Array Except Self', difficulty: 'Medium', pattern: 'Prefix and Suffix', viz: 'array',
    description: 'Given an integer array, return an array where output[i] equals the product of all elements except nums[i]. Solve in O(n) without using division.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'output[0]=2x3x4=24, output[1]=1x3x4=12 ...' },
    ],
    hints: [
      'output[i] = product of everything to the LEFT times product of everything to the RIGHT.',
      'Build a prefix array left to right: prefix[i] = product of nums[0] through nums[i-1].',
      'Then scan right to left maintaining a running suffix product. Multiply into result.',
    ],
    pattern_explanation: 'Two passes: left prefix products then right suffix products. O(n) time, O(1) extra space.',
    solution: 'function productExceptSelf(nums) {\n  const n = nums.length, res = new Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }\n  return res;\n}',
    testCases: [
      { input: [[1,2,3,4]], expected: [24,12,8,6] },
    ],
  },
];
