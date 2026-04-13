export const bstProblems = [
  {
    id: 16,
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    pattern: 'DFS',
    viz: 'bst',
    timeO: 'O(n)',
    spaceO: 'O(h)',
    description: 'Given the root of a binary tree, invert the tree and return its root.',
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Swap the left and right subtree at every node.' },
    ],
    hints: [
      'At each node, swap the left and right child references.',
      'After swapping, recurse into both children.',
      'The base case is a null node.',
    ],
    pattern_explanation: 'This is a direct depth-first traversal where each node performs a constant-time swap.',
    solution: 'function invertTree(root) {\\n  if (!root) return null;\\n  [root.left, root.right] = [root.right, root.left];\\n  invertTree(root.left);\\n  invertTree(root.right);\\n  return root;\\n}',
    testCases: [
      { input: [[4,2,7,1,3,6,9]], expected: [4,7,2,9,6,3,1] },
    ],
  },
  {
    id: 17,
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    pattern: 'DFS',
    viz: 'bst',
    timeO: 'O(n)',
    spaceO: 'O(h)',
    description: 'Given the root of a binary tree, return its maximum depth.',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: 'The longest root-to-leaf path contains 3 nodes.' },
    ],
    hints: [
      'The depth of a node is 1 plus the greater depth of its two children.',
      'A null node contributes depth 0.',
      'Use recursion to compute depth bottom-up.',
    ],
    pattern_explanation: 'Tree height problems often reduce to recursive decomposition on left and right subtrees.',
    solution: 'function maxDepth(root) {\\n  if (!root) return 0;\\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\\n}',
    testCases: [
      { input: [[3,9,20,null,null,15,7]], expected: 3 },
      { input: [[1,null,2]], expected: 2 },
    ],
  },
  {
    id: 18,
    title: 'Validate BST',
    difficulty: 'Medium',
    pattern: 'DFS with Bounds',
    viz: 'bst',
    timeO: 'O(n)',
    spaceO: 'O(h)',
    description: 'Given the root of a binary tree, determine whether it is a valid binary search tree.',
    examples: [
      { input: 'root = [2,1,3]', output: 'true', explanation: 'All left values are smaller and all right values are larger.' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The value 3 lies in the right subtree of 5 but is smaller than 5.' },
    ],
    hints: [
      'Checking only each node against its immediate children is not enough.',
      'Carry lower and upper bounds down the recursion.',
      'Every node in the left subtree must stay below the parent, and every node in the right subtree must stay above it.',
    ],
    pattern_explanation: 'Passing valid bounds down the tree is the standard way to validate BST structure correctly.',
    solution: 'function isValidBST(root, min = -Infinity, max = Infinity) {\\n  if (!root) return true;\\n  if (root.val <= min || root.val >= max) return false;\\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\\n}',
    testCases: [
      { input: [[2,1,3]], expected: true },
      { input: [[5,1,4,null,null,3,6]], expected: false },
    ],
  },
];

export const heapProblems = [
  {
    id: 19,
    title: 'Kth Largest Element',
    difficulty: 'Medium',
    pattern: 'Min-Heap',
    viz: 'heap',
    timeO: 'O(n log k)',
    spaceO: 'O(k)',
    description: 'Given an integer array, return the kth largest element in the array.',
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: 'The sorted order is [6,5,4,3,2,1], so the 2nd largest is 5.' },
    ],
    hints: [
      'A full sort works but is more expensive than needed.',
      'Keep a min-heap of size k holding the k largest elements seen so far.',
      'If the heap grows larger than k, remove the smallest element.',
    ],
    pattern_explanation: 'A min-heap of size k gives better scaling than sorting the full array when k is small.',
    solution: 'function findKthLargest(nums, k) {\\n  nums.sort((a, b) => b - a);\\n  return nums[k - 1];\\n}',
    testCases: [
      { input: [[3,2,1,5,6,4], 2], expected: 5 },
      { input: [[3,2,3,1,2,4,5,5,6], 4], expected: 4 },
    ],
  },
  {
    id: 20,
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    pattern: 'Heap + HashMap',
    viz: 'heap',
    timeO: 'O(n)',
    spaceO: 'O(n)',
    description: 'Given an integer array and an integer k, return the k most frequent elements.',
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explanation: '1 appears 3 times and 2 appears 2 times.' },
    ],
    hints: [
      'Count the frequency of each number first.',
      'Instead of sorting by frequency, place numbers into buckets indexed by frequency.',
      'Scan the buckets from highest frequency down until you collect k results.',
    ],
    pattern_explanation: 'Bucket sort on frequency gives linear-time performance for this classic top-k problem.',
    solution: 'function topKFrequent(nums, k) {\\n  const freq = new Map();\\n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\\n  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);\\n  for (const [n, f] of freq) buckets[f].push(n);\\n  const result = [];\\n  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {\\n    result.push(...buckets[i]);\\n  }\\n  return result.slice(0, k);\\n}',
    testCases: [
      { input: [[1,1,1,2,2,3], 2], expected: [1,2] },
      { input: [[1], 1], expected: [1] },
    ],
  },
];

export const graphProblems = [
  {
    id: 21,
    title: 'Number of Islands',
    difficulty: 'Medium',
    pattern: 'DFS Grid',
    viz: 'graph',
    timeO: 'O(mn)',
    spaceO: 'O(mn)',
    description: 'Given a 2D grid of land and water, count how many islands are present.',
    examples: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: '2', explanation: 'There are two disconnected groups of land.' },
    ],
    hints: [
      'Scan the grid cell by cell.',
      'When you find unvisited land, start a DFS or BFS to mark the whole island.',
      'Increment the island count each time you start a new traversal.',
    ],
    pattern_explanation: 'Grid traversal problems often reduce to flood-fill from each unvisited land cell.',
    solution: 'function numIslands(grid) {\\n  let count = 0;\\n  const dfs = (r, c) => {\\n    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === "0") return;\\n    grid[r][c] = "0";\\n    dfs(r + 1, c);\\n    dfs(r - 1, c);\\n    dfs(r, c + 1);\\n    dfs(r, c - 1);\\n  };\\n  for (let r = 0; r < grid.length; r++) {\\n    for (let c = 0; c < grid[0].length; c++) {\\n      if (grid[r][c] === "1") {\\n        dfs(r, c);\\n        count++;\\n      }\\n    }\\n  }\\n  return count;\\n}',
    testCases: [
      { input: [[['1','1','0'],['0','1','0'],['0','0','1']]], expected: 2 },
    ],
  },
  {
    id: 22,
    title: 'Course Schedule',
    difficulty: 'Medium',
    pattern: 'Cycle Detection',
    viz: 'graph',
    timeO: 'O(v + e)',
    spaceO: 'O(v + e)',
    description: 'Given the number of courses and prerequisite pairs, return whether it is possible to finish all courses.',
    examples: [
      { input: 'n = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take course 0 before course 1.' },
      { input: 'n = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: 'The dependency graph contains a cycle.' },
    ],
    hints: [
      'Model courses as a directed graph.',
      'A cycle in the prerequisite graph means it is impossible to finish all courses.',
      'Track unvisited, visiting, and visited states during DFS.',
    ],
    pattern_explanation: 'Three-state DFS cycle detection is a standard pattern for directed graph dependency problems.',
    solution: 'function canFinish(numCourses, prerequisites) {\\n  const graph = Array.from({ length: numCourses }, () => []);\\n  for (const [course, prereq] of prerequisites) graph[prereq].push(course);\\n  const state = new Array(numCourses).fill(0);\\n  const dfs = (node) => {\\n    if (state[node] === 1) return false;\\n    if (state[node] === 2) return true;\\n    state[node] = 1;\\n    for (const next of graph[node]) {\\n      if (!dfs(next)) return false;\\n    }\\n    state[node] = 2;\\n    return true;\\n  };\\n  for (let i = 0; i < numCourses; i++) {\\n    if (!dfs(i)) return false;\\n  }\\n  return true;\\n}',
    testCases: [
      { input: [2, [[1,0]]], expected: true },
      { input: [2, [[1,0],[0,1]]], expected: false },
    ],
  },
];

export const sortingProblems = [
  {
    id: 23,
    title: 'Sort Colors',
    difficulty: 'Medium',
    pattern: 'Dutch National Flag',
    viz: 'bubble',
    timeO: 'O(n)',
    spaceO: 'O(1)',
    description: 'Given an array containing only 0, 1, and 2, sort it in-place without using the built-in sort function.',
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: 'Partition the array into low, middle, and high regions.' },
    ],
    hints: [
      'Use three pointers: low, mid, and high.',
      'Elements before low are 0, after high are 2, and mid scans the unknown region.',
      'Swap based on the value at mid and adjust the correct pointers.',
    ],
    pattern_explanation: 'The Dutch National Flag algorithm sorts this constrained array in one pass.',
    solution: 'function sortColors(nums) {\\n  let low = 0, mid = 0, high = nums.length - 1;\\n  while (mid <= high) {\\n    if (nums[mid] === 0) {\\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\\n      low++;\\n      mid++;\\n    } else if (nums[mid] === 2) {\\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\\n      high--;\\n    } else {\\n      mid++;\\n    }\\n  }\\n}',
    testCases: [
      { input: [[2,0,2,1,1,0]], expected: [0,0,1,1,2,2] },
      { input: [[2,0,1]], expected: [0,1,2] },
    ],
  },
];
