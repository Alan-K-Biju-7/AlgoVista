function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

export function getConceptKind(concept) {
  const title = concept.title.toLowerCase();
  const section = concept.sectionId;

  if (section === 'arrays') return 'array';
  if (includesAny(title, ['big-o', 'omega', 'theta', 'complexity'])) return 'complexity';
  if (includesAny(title, ['matrix', 'transpose', 'spiral', 'rotate'])) return 'matrix';
  if (includesAny(title, ['binary search', 'linear search', 'ternary search', 'sorted matrix'])) return 'search';
  if (section === 'strings' || includesAny(title, ['string', 'palindrome', 'anagram', 'kmp', 'rabin', 'z algorithm'])) return 'string';
  if (section === 'recursion-backtracking' || includesAny(title, ['recursion', 'backtracking', 'permutation', 'combination', 'subset', 'sudoku', 'n-queens', 'maze'])) return 'recursion';
  if (section === 'linked-list' || includesAny(title, ['linked list', 'random pointer', 'cycle'])) return 'linked-list';
  if (section === 'stack') return 'stack';
  if (section === 'queue') return 'queue';
  if (section === 'hashing' || includesAny(title, ['hash', 'frequency', 'consecutive'])) return 'hashing';
  if (section === 'sorting' || includesAny(title, ['sort'])) return 'sorting';
  if (section === 'trees' || includesAny(title, ['tree', 'bst', 'avl', 'heap', 'trie', 'lca', 'fenwick', 'segment'])) return 'tree';
  if (section === 'graphs' || includesAny(title, ['graph', 'bfs', 'dfs', 'dijkstra', 'bellman', 'floyd', 'prim', 'kruskal', 'union', 'tarjan', 'kosaraju'])) return 'graph';
  if (section === 'greedy' || includesAny(title, ['greedy', 'knapsack', 'scheduling', 'huffman'])) return 'greedy';
  if (section === 'dynamic-programming' || includesAny(title, ['dp', 'memoization', 'tabulation', 'knapsack', 'subsequence', 'edit distance', 'coin change'])) return 'dp';
  if (section === 'bit-manipulation' || includesAny(title, ['bit', 'xor', 'shift', 'power of 2'])) return 'bits';
  if (section === 'divide-conquer') return 'divide';
  return 'foundation';
}

const arrayLessons = {
  'arrays-introduction-and-basic-operations': {
    visual: 'array-memory',
    headline: 'Arrays become simple when you see them as indexed boxes with instant address lookup.',
    coreIdea: 'An array stores values in order and lets you access any position by index. The superpower is O(1) random access; the tradeoff is that inserting or deleting in the middle forces elements to shift.',
    intuition: 'Think of an array like numbered lockers. If you know locker 4, you can open it directly. But if you insert a new locker between 2 and 3, every locker after it must move.',
    pattern: 'Use arrays when order matters, index access matters, or you need to scan a fixed sequence.',
    dryRun: ['nums = [10, 20, 30, 40]', 'nums[2] reads 30 immediately.', 'Insert 25 at index 2: shift 30 and 40 right, then write 25.', 'Delete index 1: shift 25, 30, 40 left.'],
    template: 'const value = nums[i];\nnums[i] = newValue;\nfor (let i = 0; i < nums.length; i++) {\n  // visit nums[i]\n}',
    complexity: { time: 'Access O(1), search O(n), insert/delete middle O(n)', space: 'O(n)' },
    reasoningSteps: ['Name what each index represents.', 'Use direct access when the target index is known.', 'Scan when the value is unknown.', 'Expect shifting when size changes in the middle.'],
    traps: ['Confusing value with index.', 'Forgetting arrays are zero-indexed in JavaScript, Java, C++, and Python lists.', 'Assuming middle insertion is constant time.'],
    practice: 'Create an array of 5 values. Read index 3, update index 1, insert mentally at index 2, and count every shift.',
  },
  'arrays-array-traversal': {
    visual: 'array-traversal',
    headline: 'Traversal is the first pattern: one pointer, one invariant, one pass.',
    coreIdea: 'Array traversal means visiting each element exactly once in a controlled order. Almost every array algorithm starts as traversal plus a useful variable you update while scanning.',
    intuition: 'The index is a spotlight. At step i, everything before i has already been processed, and everything after i is untouched.',
    pattern: 'Use traversal for counting, finding min/max, computing totals, validating all elements, or building a transformed result.',
    dryRun: ['nums = [4, 1, 7, 3]', 'i = 0, current = 4, max = 4', 'i = 1, current = 1, max stays 4', 'i = 2, current = 7, max becomes 7', 'i = 3, current = 3, answer is 7'],
    template: 'let answer = initialValue;\nfor (let i = 0; i < nums.length; i++) {\n  const x = nums[i];\n  // update answer using x\n}',
    complexity: { time: 'O(n)', space: 'O(1) unless you build output' },
    reasoningSteps: ['Define what is true before index i.', 'Read nums[i].', 'Update your running state.', 'Move forward without revisiting old work.'],
    traps: ['Using i <= nums.length and reading out of bounds.', 'Updating the answer after the loop when it should update inside.', 'Forgetting empty arrays need an initial plan.'],
    practice: 'Traverse [5, -2, 8, 1] and track sum, max, and count of positive values in one pass.',
  },
  'arrays-insertion-and-deletion': {
    visual: 'array-shift',
    headline: 'Insertion and deletion are really shifting problems.',
    coreIdea: 'To insert into the middle, open a gap by shifting elements right. To delete from the middle, close a gap by shifting elements left. The farther from the end you edit, the more work you do.',
    intuition: 'Imagine a row of chairs. Adding a chair in the middle makes everyone to the right move one seat. Removing a chair makes everyone close the gap.',
    pattern: 'Use this concept to understand dynamic arrays, manual array operations, and why linked lists sometimes beat arrays for frequent middle edits.',
    dryRun: ['nums = [3, 6, 9, 12]', 'Insert 7 at index 2.', 'Shift 12 right, shift 9 right.', 'Write 7 at index 2 -> [3, 6, 7, 9, 12]'],
    template: 'for (let i = size; i > index; i--) {\n  nums[i] = nums[i - 1];\n}\nnums[index] = value;\nsize++;',
    complexity: { time: 'O(n) worst case, O(1) at the end', space: 'O(1) extra' },
    reasoningSteps: ['Decide where the gap should open or close.', 'Shift from the safe direction so values are not overwritten.', 'Write or remove the target.', 'Update size after movement.'],
    traps: ['Shifting left-to-right during insertion and overwriting data.', 'Forgetting to update logical size.', 'Ignoring capacity in fixed-size arrays.'],
    practice: 'Manually insert 11 into [2, 5, 8, 14] at index 3 and list the shifts in order.',
  },
  'arrays-linear-search': {
    visual: 'linear-search',
    headline: 'Linear search is the honest scan: check every candidate until proof appears.',
    coreIdea: 'Linear search works when the array is unsorted or when no stronger structure exists. It keeps a simple invariant: every position before i has already been checked and did not contain the target.',
    intuition: 'You are walking down a shelf one item at a time. You stop when you find the item, or when the shelf ends.',
    pattern: 'Use it for unsorted arrays, small inputs, or as the baseline before optimizing.',
    dryRun: ['nums = [8, 4, 9, 2], target = 9', 'i = 0 -> 8 is not target', 'i = 1 -> 4 is not target', 'i = 2 -> 9 found, return 2'],
    template: 'for (let i = 0; i < nums.length; i++) {\n  if (nums[i] === target) return i;\n}\nreturn -1;',
    complexity: { time: 'O(n)', space: 'O(1)' },
    reasoningSteps: ['Start at index 0.', 'Compare current value with target.', 'Return immediately on match.', 'Return not found only after the full scan.'],
    traps: ['Returning not found too early.', 'Skipping index 0 or the last index.', 'Using binary search on unsorted data.'],
    practice: 'Search for 6 in [1, 6, 6, 9]. Decide whether you need the first match, last match, or any match.',
  },
  'arrays-binary-search': {
    visual: 'binary-search',
    headline: 'Binary search is not about the middle; it is about safely deleting half the search space.',
    coreIdea: 'Binary search only works when the search space is sorted or monotonic. The invariant is: if the answer exists, it is always inside [left, right]. Every comparison must preserve that truth.',
    intuition: 'The middle value is a judge. If target is bigger, every value left of mid is too small. If target is smaller, every value right of mid is too large.',
    pattern: 'Use binary search when sorted order or a true/false monotonic condition lets you discard half of the candidates.',
    dryRun: ['nums = [2, 5, 8, 12, 16, 23], target = 16', 'left = 0, right = 5, mid = 2 -> 8 too small', 'left = 3, right = 5, mid = 4 -> 16 found'],
    template: 'let left = 0;\nlet right = nums.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor(left + (right - left) / 2);\n  if (nums[mid] === target) return mid;\n  if (nums[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    reasoningSteps: ['Keep the answer inside [left, right].', 'Probe mid.', 'Use sorted order to discard one side.', 'Stop when the interval is empty or target is found.'],
    traps: ['Using it on unsorted arrays.', 'Writing left = mid or right = mid and getting stuck.', 'Forgetting boundary variants need different update rules.'],
    practice: 'Dry-run target 3 in [1, 3, 5, 7, 9] and write left, mid, right at every step.',
  },
  'arrays-ternary-search': {
    visual: 'ternary-search',
    headline: 'Ternary search splits the search space into three zones.',
    coreIdea: 'Ternary search compares two midpoints and removes one third or more of the candidates. It is most useful for unimodal functions where values increase then decrease, or decrease then increase.',
    intuition: 'Instead of asking one middle question, you ask two. Their relationship tells you which third cannot contain the best answer.',
    pattern: 'Use it for unimodal optimization, not as a normal replacement for binary search on sorted arrays.',
    dryRun: ['Search a peak in [1, 4, 9, 12, 8, 3]', 'm1 checks left third, m2 checks right third.', 'If value at m1 < value at m2, the peak is to the right of m1.', 'Otherwise the peak is to the left of m2.'],
    template: 'while (right - left > 2) {\n  const m1 = left + Math.floor((right - left) / 3);\n  const m2 = right - Math.floor((right - left) / 3);\n  if (f(m1) < f(m2)) left = m1 + 1;\n  else right = m2 - 1;\n}',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    reasoningSteps: ['Confirm the function is unimodal.', 'Compute two midpoints.', 'Compare their values.', 'Discard the side that cannot contain the optimum.'],
    traps: ['Using ternary search on arbitrary arrays.', 'Thinking it is automatically faster than binary search.', 'Forgetting integer ternary search needs a final small scan.'],
    practice: 'Given values [1, 3, 7, 11, 10, 4], mark which region is discarded after comparing m1 and m2.',
  },
  'arrays-two-pointers-technique': {
    visual: 'two-pointers',
    headline: 'Two pointers turn nested search into directed movement.',
    coreIdea: 'Two pointers use two indexes that move according to a rule. The power comes from proving each movement eliminates work you never need to revisit.',
    intuition: 'One pointer watches the left side, one watches the right side. When the current pair is too small or too large, sorted order tells you which pointer should move.',
    pattern: 'Use it for sorted pair problems, reversing, partitioning, removing duplicates, and comparing from both ends.',
    dryRun: ['nums = [1, 2, 4, 6, 9], target = 10', 'left = 0, right = 4 -> 1 + 9 = 10, found', 'If sum were too small, move left rightward.', 'If sum were too large, move right leftward.'],
    template: 'let left = 0;\nlet right = nums.length - 1;\nwhile (left < right) {\n  const sum = nums[left] + nums[right];\n  if (sum === target) return [left, right];\n  if (sum < target) left++;\n  else right--;\n}',
    complexity: { time: 'O(n)', space: 'O(1)' },
    reasoningSteps: ['Define what each pointer means.', 'Evaluate the current pair or window.', 'Move exactly the pointer that cannot stay.', 'Never move a pointer without a reason.'],
    traps: ['Using the pattern without sorted order when the rule depends on sorting.', 'Moving both pointers too early.', 'Forgetting left < right.'],
    practice: 'Use two pointers to find target 13 in [2, 3, 5, 8, 11].',
  },
  'arrays-prefix-sum-suffix-sum': {
    visual: 'prefix-sum',
    headline: 'Prefix sums turn repeated range work into subtraction.',
    coreIdea: 'A prefix sum stores the total up to each index. Once built, any range sum can be answered by subtracting the total before the range from the total at the end.',
    intuition: 'Instead of recounting books on shelves 2 through 6 every time, keep a running total from the start and subtract what came before shelf 2.',
    pattern: 'Use prefix/suffix arrays for range sums, product except self, equilibrium index, and repeated interval queries.',
    dryRun: ['nums = [2, 4, 1, 7]', 'prefix = [0, 2, 6, 7, 14]', 'sum from index 1 to 3 = prefix[4] - prefix[1]', '14 - 2 = 12'],
    template: 'const prefix = new Array(nums.length + 1).fill(0);\nfor (let i = 0; i < nums.length; i++) {\n  prefix[i + 1] = prefix[i] + nums[i];\n}\nconst rangeSum = prefix[right + 1] - prefix[left];',
    complexity: { time: 'Build O(n), query O(1)', space: 'O(n)' },
    reasoningSteps: ['Build a running total.', 'Store a leading zero to simplify ranges.', 'Translate [left, right] into prefix indexes.', 'Subtract what comes before left.'],
    traps: ['Off-by-one errors without a leading zero.', 'Mutating nums when a separate prefix is clearer.', 'Forgetting suffix is the same idea from the right.'],
    practice: 'Build prefix for [3, -1, 4, 2] and answer sum(1, 3).',
  },
  'arrays-sliding-window-technique': {
    visual: 'sliding-window',
    headline: 'Sliding window keeps a live subarray instead of rebuilding it.',
    coreIdea: 'A window is a contiguous range [left, right]. You expand right to include new elements and move left to remove old or invalid elements.',
    intuition: 'Think of a scanner frame moving across the array. The frame has a current sum, count, or frequency map that updates as it moves.',
    pattern: 'Use fixed windows for exact length k and variable windows when a constraint decides when to shrink.',
    dryRun: ['nums = [2, 1, 5, 1, 3], k = 3', 'Window [2,1,5] sum = 8', 'Slide: remove 2, add 1 -> [1,5,1] sum = 7', 'Slide: remove 1, add 3 -> [5,1,3] sum = 9'],
    template: 'let left = 0;\nlet window = 0;\nfor (let right = 0; right < nums.length; right++) {\n  window += nums[right];\n  while (windowIsInvalid()) {\n    window -= nums[left];\n    left++;\n  }\n  // update answer using [left, right]\n}',
    complexity: { time: 'O(n)', space: 'O(1) or O(k) for counts' },
    reasoningSteps: ['Add the right element.', 'Check whether the window is valid.', 'Shrink from the left until valid.', 'Update the best answer after the window is valid.'],
    traps: ['Shrinking before adding.', 'Updating the answer while the window is invalid.', 'Using sliding window when negative numbers break monotonicity.'],
    practice: 'Find the best sum of length 3 in [4, 2, 1, 7, 8] by sliding one step at a time.',
  },
  'arrays-kadane-s-algorithm-maximum-subarray': {
    visual: 'kadane',
    headline: 'Kadane keeps the best subarray ending here and the best seen anywhere.',
    coreIdea: 'At each index, choose whether to extend the previous subarray or start fresh at the current value. If the old sum hurts you, drop it.',
    intuition: 'A negative running sum is baggage. Once it makes the future worse, you leave it behind and restart.',
    pattern: 'Use Kadane for maximum contiguous subarray sum and as a base idea for many 1D DP problems.',
    dryRun: ['nums = [-2, 3, -1, 5, -6]', 'current = max(3, -2 + 3) = 3', 'current at -1 = 2, best = 3', 'current at 5 = 7, best = 7', 'answer = 7 from [3, -1, 5]'],
    template: 'let current = nums[0];\nlet best = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  current = Math.max(nums[i], current + nums[i]);\n  best = Math.max(best, current);\n}\nreturn best;',
    complexity: { time: 'O(n)', space: 'O(1)' },
    reasoningSteps: ['Define current as best sum ending at i.', 'Choose extend or restart.', 'Update global best.', 'Handle all-negative arrays by starting from nums[0].'],
    traps: ['Resetting to 0 and failing all-negative cases.', 'Confusing subsequence with subarray.', 'Returning current instead of best.'],
    practice: 'Run Kadane on [-4, -1, -7] and explain why the answer is -1.',
  },
  'arrays-matrix-problems-spiral-traversal-rotate-matrix-transpose': {
    visual: 'matrix-boundaries',
    headline: 'Matrix problems are boundary management problems.',
    coreIdea: 'Matrix algorithms become manageable when you name row, column, and boundary variables. Spiral traversal moves boundaries inward; transpose swaps row and column; rotation combines transpose with reversal.',
    intuition: 'A matrix is a grid. Good solutions do not wander; they follow rails: top row, right column, bottom row, left column, then shrink.',
    pattern: 'Use boundary variables for spiral traversal, coordinate swaps for transpose, and layer-by-layer thinking for rotation.',
    dryRun: ['top = 0, bottom = rows - 1, left = 0, right = cols - 1', 'Read top row left to right, then top++.', 'Read right column top to bottom, then right--.', 'Repeat while boundaries are valid.'],
    template: 'while (top <= bottom && left <= right) {\n  for (let c = left; c <= right; c++) visit(matrix[top][c]);\n  top++;\n  for (let r = top; r <= bottom; r++) visit(matrix[r][right]);\n  right--;\n  // bottom row and left column need boundary checks\n}',
    complexity: { time: 'O(rows * cols)', space: 'O(1) extra, O(n) output if returning traversal' },
    reasoningSteps: ['Name all four boundaries.', 'Move one edge at a time.', 'Shrink the boundary after consuming an edge.', 'Check boundaries before reading reverse edges.'],
    traps: ['Mixing row and column.', 'Duplicating middle row or column.', 'Assuming every matrix is square.'],
    practice: 'Spiral trace a 3 x 3 matrix and write how top, bottom, left, right change.',
  },
  'arrays-search-in-sorted-matrix': {
    visual: 'sorted-matrix-search',
    headline: 'A sorted matrix can be searched like a staircase.',
    coreIdea: 'If rows and columns are sorted, start at the top-right. Moving left makes values smaller; moving down makes values larger. Each step discards one row or column.',
    intuition: 'Top-right is a decision corner. If it is too big, the whole column below is also too big. If it is too small, the whole row to the left is also too small.',
    pattern: 'Use staircase search for row-and-column sorted matrices. Use flattened binary search when the whole matrix is globally sorted row by row.',
    dryRun: ['target = 14, start top-right.', 'If current = 20, move left.', 'If current = 9, move down.', 'Every move deletes one full row or column from consideration.'],
    template: 'let row = 0;\nlet col = matrix[0].length - 1;\nwhile (row < matrix.length && col >= 0) {\n  const value = matrix[row][col];\n  if (value === target) return true;\n  if (value > target) col--;\n  else row++;\n}\nreturn false;',
    complexity: { time: 'O(rows + cols)', space: 'O(1)' },
    reasoningSteps: ['Start from a corner with two useful directions.', 'Compare current with target.', 'Discard a column if current is too large.', 'Discard a row if current is too small.'],
    traps: ['Starting in a corner that gives no clear elimination.', 'Using staircase search when only rows are sorted.', 'Forgetting empty matrix checks.'],
    practice: 'Draw a 4 x 4 sorted matrix and search for one value that exists and one that does not.',
  },
};

const lessonCopy = {
  array: {
    mentalModel: 'Arrays are ordered indexed slots. Most array patterns are about controlling which indexes are active and what summary you maintain while moving through them.',
    reasoningSteps: ['Name the indexes.', 'State what is known before and after each index.', 'Move pointers with a reason.', 'Track the answer without repeating work.'],
    traps: ['Off-by-one boundaries.', 'Confusing index and value.', 'Forgetting sortedness is required for several optimizations.'],
    practice: 'Dry-run the index movement by hand before writing code.',
  },
  complexity: {
    mentalModel: 'Treat the input size as a volume knob. The formula tells you how quickly work or memory grows when that knob turns up.',
    reasoningSteps: ['Choose the input variable n.', 'Count the dominant repeated operation.', 'Drop constants and smaller terms.', 'Check best, average, and worst cases separately.'],
    traps: ['Counting lines instead of repeated work.', 'Forgetting nested loops multiply.', 'Ignoring memory created by recursion or helper arrays.'],
    practice: 'Take a loop, a nested loop, and a recursive call. Write the time and space for each before running code.',
  },
  search: {
    mentalModel: 'A search algorithm is a shrinking territory. Every comparison should prove which part can be ignored.',
    reasoningSteps: ['Name the candidates still alive.', 'Choose the probe position.', 'Use the comparison to remove impossible answers.', 'Stop only when the invariant says the answer is found or impossible.'],
    traps: ['Moving the wrong boundary.', 'Using a loop condition that skips the last candidate.', 'Not deciding how duplicates should behave.'],
    practice: 'Dry-run the search on a 7-item input and write left, mid, and right after every step.',
  },
  matrix: {
    mentalModel: 'A matrix is an array with two coordinates. Good solutions convert movement rules into row and column boundaries.',
    reasoningSteps: ['Define row and column meaning.', 'Mark the valid boundary.', 'Move one direction at a time.', 'Update boundaries after a full pass.'],
    traps: ['Mixing row and column indexes.', 'Reading outside the boundary.', 'Forgetting rectangular matrices can differ from square matrices.'],
    practice: 'Trace a 3 x 4 matrix and write the order in which cells are visited.',
  },
  string: {
    mentalModel: 'String problems are array problems with characters, order, and repeated patterns. Most wins come from tracking a window, prefix, or frequency map.',
    reasoningSteps: ['Decide whether order matters.', 'Track characters with indexes or counts.', 'Shrink repeated work using a table or prefix idea.', 'Test empty, one-character, and duplicate-heavy strings.'],
    traps: ['Comparing substrings repeatedly.', 'Forgetting case, spaces, or duplicate characters.', 'Confusing subsequence with substring.'],
    practice: 'Pick a word and mark every prefix, suffix, and repeating character position.',
  },
  recursion: {
    mentalModel: 'Recursion is a chain of smaller promises. Backtracking is recursion plus undoing a choice before trying the next branch.',
    reasoningSteps: ['Write the smallest base case.', 'Make one decision.', 'Call the smaller problem.', 'Undo temporary state when exploring alternatives.'],
    traps: ['Missing the base case.', 'Changing shared state without restoring it.', 'Returning too early from one branch.'],
    practice: 'Draw the first three levels of the recursion tree before writing the function.',
  },
  'linked-list': {
    mentalModel: 'A linked list is not a row of values. It is a chain of references, so every operation is about preserving access to the next node.',
    reasoningSteps: ['Name prev, curr, and next.', 'Save the next pointer before rewiring.', 'Change one pointer at a time.', 'Check head and tail cases.'],
    traps: ['Losing the rest of the list.', 'Forgetting null checks.', 'Treating node values as if they were node references.'],
    practice: 'Draw three nodes and rewrite the arrows for insert, delete, and reverse.',
  },
  stack: {
    mentalModel: 'A stack remembers unfinished work. The newest item must be handled first.',
    reasoningSteps: ['Define what each stack entry means.', 'Push when work opens.', 'Pop when work closes.', 'Use the top as the only visible active item.'],
    traps: ['Popping from an empty stack.', 'Storing too much data.', 'Forgetting monotonic stacks store useful candidates, not every value forever.'],
    practice: 'Run a bracket string or next-greater-element input and write the stack after every character.',
  },
  queue: {
    mentalModel: 'A queue preserves arrival order. A deque adds control over both ends for window and monotonic problems.',
    reasoningSteps: ['Decide what enters the back.', 'Decide what leaves the front.', 'Keep indexes when expiry matters.', 'For priority queues, define what has highest priority.'],
    traps: ['Confusing queue with stack order.', 'Leaving expired window items inside.', 'Using a priority queue when FIFO order is required.'],
    practice: 'Trace five arrivals and three removals, then explain the front and back pointers.',
  },
  hashing: {
    mentalModel: 'Hashing turns repeated scanning into direct lookup. The key you choose is the algorithm.',
    reasoningSteps: ['Choose the key.', 'Decide what value to store.', 'Update the table exactly once per item.', 'Check collision or duplicate behavior.'],
    traps: ['Using the wrong key.', 'Forgetting counts when duplicates matter.', 'Assuming worst-case hash lookup is impossible.'],
    practice: 'Build a frequency table for a small array and answer three queries from it.',
  },
  sorting: {
    mentalModel: 'Sorting creates order by repeatedly enforcing a local rule: swap, insert, merge, partition, heapify, or count.',
    reasoningSteps: ['Name the sorted and unsorted regions.', 'State the operation that grows order.', 'Track stability and in-place memory.', 'Compare best, average, and worst cases.'],
    traps: ['Mixing index boundaries.', 'Assuming every sort is stable.', 'Forgetting recursion or auxiliary arrays in space complexity.'],
    practice: 'Sort six numbers by hand and label each comparison or swap.',
  },
  tree: {
    mentalModel: 'Tree algorithms are about parent-child relationships. Traversal order decides what information is available when.',
    reasoningSteps: ['Define what each node returns.', 'Choose preorder, inorder, postorder, or level order.', 'Preserve the tree invariant after updates.', 'Handle null children cleanly.'],
    traps: ['Using parent-child checks when full subtree bounds are needed.', 'Forgetting height updates in balanced trees.', 'Mixing traversal orders.'],
    practice: 'Draw a five-node tree and compute the answer bottom-up and top-down.',
  },
  graph: {
    mentalModel: 'Graphs are relationships. The first decision is the model: directed or undirected, weighted or unweighted, cyclic or acyclic.',
    reasoningSteps: ['Choose adjacency list or matrix.', 'Track visited state.', 'Pick traversal, ordering, relaxation, or union strategy.', 'Prove each edge or node is processed the right number of times.'],
    traps: ['Forgetting disconnected components.', 'Revisiting nodes forever.', 'Using Dijkstra with negative edges.'],
    practice: 'Draw six nodes, list neighbors, then run BFS or DFS by writing the frontier after every step.',
  },
  greedy: {
    mentalModel: 'Greedy algorithms work only when the local best choice can be proven safe for the global answer.',
    reasoningSteps: ['Define the local choice.', 'Sort or prioritize the input if needed.', 'Prove the choice cannot hurt future decisions.', 'Look for a counterexample before trusting it.'],
    traps: ['Choosing locally without proof.', 'Using greedy for a DP problem.', 'Forgetting tie handling.'],
    practice: 'Write the greedy rule, then try to break it with a small counterexample.',
  },
  dp: {
    mentalModel: 'Dynamic programming stores answers to repeated subproblems. The hardest part is naming the state precisely.',
    reasoningSteps: ['Define dp state in one sentence.', 'Write the transition.', 'Set base cases.', 'Choose memoization or tabulation and iteration order.'],
    traps: ['Making the state too vague.', 'Using future states before they exist.', 'Forgetting impossible states.'],
    practice: 'Create a tiny dp table and fill it cell by cell while saying what each cell means.',
  },
  bits: {
    mentalModel: 'Bits let you store many yes/no decisions inside one number. Operators expose patterns that arithmetic hides.',
    reasoningSteps: ['Write the binary form.', 'Choose a mask.', 'Apply AND, OR, XOR, shift, or complement.', 'Convert back only after the pattern is clear.'],
    traps: ['Confusing bit index with value.', 'Forgetting signed integer behavior.', 'Using + where XOR is the intended no-carry operation.'],
    practice: 'Write 13 and 10 in binary, then compute AND, OR, XOR, and left shift.',
  },
  divide: {
    mentalModel: 'Divide and conquer wins by splitting a problem into independent pieces, solving them, then combining results.',
    reasoningSteps: ['Define the split.', 'Solve the smaller pieces.', 'Write the combine step.', 'Use recurrence thinking for complexity.'],
    traps: ['Overlapping work that should be DP.', 'Bad base cases.', 'Expensive combine steps that erase the benefit.'],
    practice: 'Split eight values into halves until singletons, then merge the answers upward.',
  },
  foundation: {
    mentalModel: 'This concept is a building block. The goal is to make the vocabulary precise enough that later algorithms feel predictable.',
    reasoningSteps: ['Define the term in plain English.', 'Write one tiny example.', 'Connect it to time, memory, or correctness.', 'Use it in a code-level sentence.'],
    traps: ['Memorizing definitions without examples.', 'Skipping edge cases.', 'Not connecting the idea to implementation.'],
    practice: 'Explain the concept to a beginner in three sentences, then add one code example.',
  },
};

export function getConceptLesson(concept) {
  const kind = getConceptKind(concept);
  const override = arrayLessons[concept.id] || {};
  const copy = { ...(lessonCopy[kind] || lessonCopy.foundation), ...override };
  const title = concept.title;

  return {
    kind,
    visual: copy.visual || kind,
    headline: copy.headline || `${title} turns into skill when you can predict every step before the code runs.`,
    coreIdea: copy.coreIdea || `${title} belongs to ${concept.sectionTitle}. Learn it by connecting the definition, the moving state, and the reason the algorithm stays correct.`,
    intuition: copy.intuition || copy.mentalModel,
    pattern: copy.pattern || `Use this pattern when a ${concept.sectionTitle} problem asks you to control state, order, or repeated work.`,
    dryRun: copy.dryRun || ['Pick the smallest useful input.', 'Name the moving state.', 'Advance one step at a time.', 'Explain why the final answer follows.'],
    template: copy.template || '',
    complexity: copy.complexity || { time: 'Depends on the chosen implementation.', space: 'Depends on the extra state used.' },
    mentalModel: copy.mentalModel,
    reasoningSteps: copy.reasoningSteps,
    traps: copy.traps,
    practice: copy.practice,
    checkpoints: [
      `I can explain ${title} without reading notes.`,
      'I can dry-run the smallest useful example.',
      'I can name the main invariant or state.',
      'I can state time and space complexity.',
    ],
  };
}
