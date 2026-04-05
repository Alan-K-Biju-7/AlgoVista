export const arrayProblems = [
  {
    id: 1, title: 'Two Sum', difficulty: 'Easy', pattern: 'Hash Map', viz: 'array',
    description: 'Given an array of integers and a target sum, return the indices of the two numbers that add up to the target. Each input has exactly one solution and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    hints: [
      'Think about what information you need to store as you scan through the array.',
      'For each number x, you need to know if target−x exists somewhere earlier in the array.',
      'Use a hash map to store {number: index} as you go. For each x check if target−x is in the map before inserting x.',
    ],
    pattern_explanation: 'Hash Map lookup turns an O(n²) brute force into O(n). Store complement → index pairs as you scan.',
    solution: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in map) return [map[complement], i];
    map[nums[i]] = i;
  }
}`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6],     expected: [1,2] },
      { input: [[3,3], 6],       expected: [0,1] },
    ],
  },
  {
    id: 2, title: 'Contains Duplicate', difficulty: 'Easy', pattern: 'Hash Set', viz: 'array',
    description: 'Given an integer array, return true if any value appears at least twice, and false if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true', explanation: '1 appears at index 0 and 3' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: 'All elements are distinct' },
    ],
    hints: [
      'What data structure lets you check membership in O(1)?',
      'A Set stores unique values — if adding an element fails (already exists) you found a duplicate.',
      'Scan left to right. Before inserting each number into the Set, check if it is already there.',
    ],
    pattern_explanation: 'Set membership check in O(1). Single pass O(n) time, O(n) space.',
    solution: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
    testCases: [
      { input: [[1,2,3,1]],   expected: true },
      { input: [[1,2,3,4]],   expected: false },
      { input: [[1,1,1,3,3]], expected: true },
    ],
  },
  {
    id: 3, title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy', pattern: 'Sliding Window', viz: 'array',
    description: 'Given an array where prices[i] is the price of a stock on day i, return the maximum profit you can achieve by buying on one day and selling on a later day. Return 0 if no profit is possible.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 6−1 = 5.' },
      { input: 'prices = [7,6,4,3,1]',   output: '0', explanation: 'Prices only decrease, no profitable trade.' },
    ],
    hints: [
      'You need to find the largest difference prices[j] − prices[i] where j > i.',
      'Track the minimum price seen so far as you scan left to right.',
      'At each day compute profit = price − minSoFar. Update maxProfit if this is larger.',
    ],
    pattern_explanation: 'One pass with two trackers (minPrice, maxProfit). No need to look back.',
    solution: `function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    maxProfit = Math.max(maxProfit, p - minPrice);
  }
  return maxProfit;
}`,
    testCases: [
      { input: [[7,1,5,3,6,4]], expected: 5 },
      { input: [[7,6,4,3,1]],   expected: 0 },
      { input: [[1,2]],         expected: 1 },
    ],
  },
  {
    id: 4, title: 'Maximum Subarray', difficulty: 'Medium', pattern: "Kadane's Algorithm", viz: 'array',
    description: 'Given an integer array, find the contiguous subarray with the largest sum and return that sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,−1,2,1] has sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'Single element.' },
    ],
    hints: [
      'Think about when it makes sense to start a new subarray vs extending the current one.',
      'If your running sum goes negative, starting fresh from the next element is always better.',
      "Kadane's: currentSum = max(num, currentSum + num). maxSum = max(maxSum, currentSum).",
    ],
    pattern_explanation: "Kadane's algorithm — O(n) single pass. Reset when sum goes negative.",
    solution: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { input: [[1]],                      expected: 1 },
      { input: [[-1,-2,-3]],               expected: -1 },
    ],
  },
  {
    id: 5, title: 'Product of Array Except Self', difficulty: 'Medium', pattern: 'Prefix & Suffix', viz: 'array',
    description: 'Given an integer array, return an array where output[i] equals the product of all elements except nums[i]. Solve in O(n) without using division.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'output[0]=2×3×4=24, output[1]=1×3×4=12, ...' },
    ],
    hints: [
      'output[i] = product of everything to the LEFT × product of everything to the RIGHT.',
      'Build a prefix array: prefix[i] = product of nums[0..i-1].',
      'Then scan right to left maintaining a running suffix product. Multiply into result.',
    ],
    pattern_explanation: 'Two passes: left prefix products, then right suffix products. O(n) time, O(1) extra space.',
    solution: `function productExceptSelf(nums) {
  const n = nums.length, res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }
  return re
mkdir -p /Users/ancybiju/Documents/DSA2/algovista/src/pages/practice
cat > /Users/ancybiju/Documents/DSA2/algovista/src/pages/practice/problems_array.js << 'EOF'
export const arrayProblems = [
  {
    id: 1, title: 'Two Sum', difficulty: 'Easy', pattern: 'Hash Map', viz: 'array',
    description: 'Given an array of integers and a target sum, return the indices of the two numbers that add up to the target. Each input has exactly one solution and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    hints: [
      'Think about what information you need to store as you scan through the array.',
      'For each number x, you need to know if target−x exists somewhere earlier in the array.',
      'Use a hash map to store {number: index} as you go. For each x check if target−x is in the map before inserting x.',
    ],
    pattern_explanation: 'Hash Map lookup turns an O(n²) brute force into O(n). Store complement → index pairs as you scan.',
    solution: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in map) return [map[complement], i];
    map[nums[i]] = i;
  }
}`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6],     expected: [1,2] },
      { input: [[3,3], 6],       expected: [0,1] },
    ],
  },
  {
    id: 2, title: 'Contains Duplicate', difficulty: 'Easy', pattern: 'Hash Set', viz: 'array',
    description: 'Given an integer array, return true if any value appears at least twice, and false if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true', explanation: '1 appears at index 0 and 3' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: 'All elements are distinct' },
    ],
    hints: [
      'What data structure lets you check membership in O(1)?',
      'A Set stores unique values — if adding an element fails (already exists) you found a duplicate.',
      'Scan left to right. Before inserting each number into the Set, check if it is already there.',
    ],
    pattern_explanation: 'Set membership check in O(1). Single pass O(n) time, O(n) space.',
    solution: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
    testCases: [
      { input: [[1,2,3,1]],   expected: true },
      { input: [[1,2,3,4]],   expected: false },
      { input: [[1,1,1,3,3]], expected: true },
    ],
  },
  {
    id: 3, title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy', pattern: 'Sliding Window', viz: 'array',
    description: 'Given an array where prices[i] is the price of a stock on day i, return the maximum profit you can achieve by buying on one day and selling on a later day. Return 0 if no profit is possible.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 6−1 = 5.' },
      { input: 'prices = [7,6,4,3,1]',   output: '0', explanation: 'Prices only decrease, no profitable trade.' },
    ],
    hints: [
      'You need to find the largest difference prices[j] − prices[i] where j > i.',
      'Track the minimum price seen so far as you scan left to right.',
      'At each day compute profit = price − minSoFar. Update maxProfit if this is larger.',
    ],
    pattern_explanation: 'One pass with two trackers (minPrice, maxProfit). No need to look back.',
    solution: `function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    maxProfit = Math.max(maxProfit, p - minPrice);
  }
  return maxProfit;
}`,
    testCases: [
      { input: [[7,1,5,3,6,4]], expected: 5 },
      { input: [[7,6,4,3,1]],   expected: 0 },
      { input: [[1,2]],         expected: 1 },
    ],
  },
  {
    id: 4, title: 'Maximum Subarray', difficulty: 'Medium', pattern: "Kadane's Algorithm", viz: 'array',
    description: 'Given an integer array, find the contiguous subarray with the largest sum and return that sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,−1,2,1] has sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'Single element.' },
    ],
    hints: [
      'Think about when it makes sense to start a new subarray vs extending the current one.',
      'If your running sum goes negative, starting fresh from the next element is always better.',
      "Kadane's: currentSum = max(num, currentSum + num). maxSum = max(maxSum, currentSum).",
    ],
    pattern_explanation: "Kadane's algorithm — O(n) single pass. Reset when sum goes negative.",
    solution: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { input: [[1]],                      expected: 1 },
      { input: [[-1,-2,-3]],               expected: -1 },
    ],
  },
  {
    id: 5, title: 'Product of Array Except Self', difficulty: 'Medium', pattern: 'Prefix & Suffix', viz: 'array',
    description: 'Given an integer array, return an array where output[i] equals the product of all elements except nums[i]. Solve in O(n) without using division.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'output[0]=2×3×4=24, output[1]=1×3×4=12, ...' },
    ],
    hints: [
      'output[i] = product of everything to the LEFT × product of everything to the RIGHT.',
      'Build a prefix array: prefix[i] = product of nums[0..i-1].',
      'Then scan right to left maintaining a running suffix product. Multiply into result.',
    ],
    pattern_explanation: 'Two passes: left prefix products, then right suffix products. O(n) time, O(1) extra space.',
    solution: `function productExceptSelf(nums) {
  const n = nums.length, res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }
  return res;
}`,
    testCases: [
      { input: [[1,2,3,4]],  expected: [24,12,8,6] },
      { input: [[-1,1,0,-3]], expected: [0,0,9,0]  },
    ],
  },
];
