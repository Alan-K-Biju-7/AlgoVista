export const bsearchProblems = [
  {
    id: 13, title: 'Binary Search', difficulty: 'Easy', pattern: 'Binary Search', viz: 'bsearch',
    description: 'Given a sorted array of integers and a target, return the index of the target. If not found return -1. Must run in O(log n).',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 is at index 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 is not in the array.' },
    ],
    hints: [
      'The array is sorted — use that to eliminate half the search space each step.',
      'Set lo=0, hi=n-1. Compute mid=(lo+hi)>>1 each iteration.',
      'If target < arr[mid] → search left half (hi=mid-1). If target > arr[mid] → search right (lo=mid+1). Else return mid.',
    ],
    pattern_explanation: 'Classic binary search template. O(log n). Base of all search-on-answer problems.',
    solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    testCases: [
      { input: [[-1,0,3,5,9,12], 9],  expected: 4  },
      { input: [[-1,0,3,5,9,12], 2],  expected: -1 },
      { input: [[5], 5],              expected: 0  },
    ],
  },
  {
    id: 14, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', pattern: 'Binary Search', viz: 'bsearch',
    description: 'A sorted array was rotated at some pivot. Find the minimum element in O(log n).',
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1', explanation: 'Rotated at index 3.' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0', explanation: 'Rotated at index 4.' },
    ],
    hints: [
      'The minimum is at the rotation point — the only place where a value is less than its predecessor.',
      'Compare arr[mid] with arr[hi] to determine which half the minimum is in.',
      'If arr[mid] > arr[hi] → minimum is in right half → lo=mid+1. Else minimum is in left half including mid → hi=mid.',
    ],
    pattern_explanation: 'Modified binary search. Compare mid to hi (not target) to navigate.',
    solution: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`,
    testCases: [
      { input: [[3,4,5,1,2]],       expected: 1 },
      { input: [[4,5,6,7,0,1,2]],   expected: 0 },
      { input: [[11,13,15,17]],      expected: 11 },
    ],
  },
  {
    id: 15, title: 'Koko Eating Bananas', difficulty: 'Medium', pattern: 'Search on Answer', viz: 'bsearch',
    description: 'Koko has n piles of bananas and h hours. She eats at speed k bananas/hour (one pile per hour, leftovers carry to next hour). Find the minimum k to finish all piles within h hours.',
    examples: [
      { input: 'piles = [3,6,7,11], h = 8', output: '4', explanation: 'At speed 4: hours needed = 1+2+2+3 = 8.' },
    ],
    hints: [
      'The answer k is somewhere between 1 and max(piles). Binary search on the answer space.',
      'For a given speed k, hours needed = sum of ceil(pile/k) for each pile.',
      'If hours <= h the speed works — try smaller (hi=mid). Else too slow — try larger (lo=mid+1).',
    ],
    pattern_explanation: 'Binary search on answer. Key insight: feasibility function is monotone.',
    solution: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const hours = piles.reduce((s, p) => s + Math.ceil(p / mid), 0);
    if (hours <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    testCases: [
      { input: [[3,6,7,11], 8], expected: 4 },
      { input: [[30,11,23,4,20], 5], expected: 30 },
    ],
  },
];
