const rawSections = [
  {
    id: 'foundations',
    title: 'Foundations',
    track: 'Core Thinking',
    level: 'Start here',
    color: '#00d4aa',
    description: 'The mental model layer: complexity, recursion, notation, and math basics.',
    topics: [
      'What is DSA?',
      'Time Complexity and Big-O Notation',
      'Space Complexity',
      'Big O, Omega, Theta Notations',
      'Recursion (Basic)',
      'Iterative vs Recursive Approach',
      'Tail Recursion',
      'Mathematical Functions (GCD, LCM, Prime Numbers, Factorials, Fibonacci)',
    ],
  },
  {
    id: 'arrays',
    title: 'Arrays',
    track: 'Linear Structures',
    level: 'Beginner',
    color: '#4a9eff',
    description: 'Index-based thinking, movement of pointers, search, windows, and matrices.',
    topics: [
      'Introduction and Basic Operations',
      'Array Traversal',
      'Insertion and Deletion',
      'Linear Search',
      'Binary Search',
      'Ternary Search',
      'Two Pointers Technique',
      'Prefix Sum / Suffix Sum',
      'Sliding Window Technique',
      "Kadane's Algorithm (Maximum Subarray)",
      'Matrix Problems (Spiral Traversal, Rotate Matrix, Transpose)',
      'Search in Sorted Matrix',
    ],
  },
  {
    id: 'strings',
    title: 'Strings',
    track: 'Text Algorithms',
    level: 'Beginner',
    color: '#f59e0b',
    description: 'Character sequences, matching, hashing, and subsequence reasoning.',
    topics: [
      'Basics of Strings and Operations',
      'Palindrome Check',
      'String Reversal',
      'Anagrams',
      'Substrings and Subsequences',
      'String Hashing (Rolling Hash)',
      'Pattern Matching (Naive, KMP, Rabin-Karp, Z Algorithm)',
    ],
  },
  {
    id: 'recursion-backtracking',
    title: 'Recursion and Backtracking',
    track: 'Search Space',
    level: 'Core',
    color: '#8b7cf8',
    description: 'Decision trees, undo steps, pruning, and exhaustive generation.',
    topics: [
      'Factorial and Fibonacci using Recursion',
      'Tower of Hanoi',
      'N-Queens Problem',
      'Rat in a Maze',
      'Sudoku Solver',
      'Word Search Problem',
      'Generating Permutations and Combinations',
      'Subset Generation',
    ],
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    track: 'Pointer Structures',
    level: 'Core',
    color: '#06d6a0',
    description: 'Node references, chain rewiring, fast-slow pointers, and list merging.',
    topics: [
      'Singly Linked List',
      'Doubly Linked List',
      'Circular Linked List',
      'Reverse Linked List (Iterative and Recursive)',
      "Floyd's Cycle Detection",
      'Intersection of Linked Lists',
      'Merge Two Sorted Lists',
      'Copy List with Random Pointer',
    ],
  },
  {
    id: 'stack',
    title: 'Stack',
    track: 'Linear Structures',
    level: 'Core',
    color: '#ef476f',
    description: 'LIFO state, expression parsing, monotonic stacks, and range boundaries.',
    topics: [
      'Implementation (Array and Linked List)',
      'Infix, Prefix, Postfix Expressions',
      'Balanced Parentheses',
      'Next Greater Element',
      'Min/Max Stack',
      'Stock Span Problem',
      'Histogram Maximum Area',
      'Celebrity Problem',
    ],
  },
  {
    id: 'queue',
    title: 'Queue',
    track: 'Linear Structures',
    level: 'Core',
    color: '#22c55e',
    description: 'FIFO flow, circular buffers, deques, priority queues, and window maximums.',
    topics: [
      'Simple Queue',
      'Circular Queue',
      'Deque (Double Ended Queue)',
      'Priority Queue (Heap-based)',
      'Queue using Stacks',
      'Sliding Window Maximum (Deque-based)',
    ],
  },
  {
    id: 'hashing',
    title: 'Hashing',
    track: 'Lookup Systems',
    level: 'Core',
    color: '#14b8a6',
    description: 'Fast lookup, collision handling, frequency maps, and subarray counting.',
    topics: [
      'Hash Table Implementation',
      'Collision Handling',
      'Hash Maps and Hash Sets',
      'Frequency Counting',
      'Subarray with Sum K',
      'Longest Consecutive Sequence',
    ],
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    track: 'Ordering',
    level: 'Core',
    color: '#f97316',
    description: 'Comparison sorting, non-comparison sorting, stability, and in-place tradeoffs.',
    topics: [
      'Bubble Sort',
      'Selection Sort',
      'Insertion Sort',
      'Merge Sort',
      'Quick Sort',
      'Heap Sort',
      'Counting Sort',
      'Radix Sort',
      'Bucket Sort',
    ],
  },
  {
    id: 'trees',
    title: 'Trees',
    track: 'Hierarchies',
    level: 'Intermediate',
    color: '#a78bfa',
    description: 'Hierarchical traversal, balanced search, range queries, and prefix trees.',
    topics: [
      'Binary Tree Traversals (Inorder, Preorder, Postorder, Level Order)',
      'Binary Search Tree (BST)',
      'AVL Tree',
      'Heap (Min-Heap, Max-Heap)',
      'Trie (Prefix Tree) - Insert, Search, Autocomplete',
      'Segment Tree (Range Queries, Lazy Propagation)',
      'Fenwick Tree / Binary Indexed Tree',
      'LCA (Lowest Common Ancestor)',
      'Height and Diameter of Tree',
      'Tree Views (Top, Bottom, Left, Right)',
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    track: 'Networks',
    level: 'Intermediate',
    color: '#38bdf8',
    description: 'Reachability, ordering, shortest paths, spanning trees, and components.',
    topics: [
      'Representation (Adjacency Matrix and List)',
      'BFS (Breadth-First Search)',
      'DFS (Depth-First Search)',
      'Topological Sort',
      'Cycle Detection',
      'Bipartite Graph Check',
      "Dijkstra's Algorithm",
      'Bellman-Ford Algorithm',
      'Floyd-Warshall Algorithm',
      "Prim's Algorithm (MST)",
      "Kruskal's Algorithm (MST)",
      'Union-Find / DSU (Disjoint Set Union)',
      "Tarjan's Algorithm (Bridges and Articulation Points)",
      "Kosaraju's Algorithm (SCC)",
    ],
  },
  {
    id: 'greedy',
    title: 'Greedy Algorithms',
    track: 'Local Choices',
    level: 'Intermediate',
    color: '#eab308',
    description: 'Proof-driven local decisions, scheduling, encoding, and exchange arguments.',
    topics: [
      'Activity Selection',
      'Fractional Knapsack',
      'Huffman Coding',
      'Job Scheduling',
      'Greedy Coin Change',
    ],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    track: 'State Design',
    level: 'Intermediate',
    color: '#ec4899',
    description: 'Overlapping subproblems, state transitions, tabulation, and optimization.',
    topics: [
      'Memoization and Tabulation',
      'Fibonacci (DP)',
      'Longest Common Subsequence (LCS)',
      'Longest Increasing Subsequence (LIS)',
      'Matrix Chain Multiplication',
      '0/1 Knapsack',
      'Unbounded Knapsack',
      'Coin Change',
      'Subset Sum',
      'Minimum Edit Distance',
      'Rod Cutting',
      'DP on Trees and Grids',
      '1D DP and 2D DP',
    ],
  },
  {
    id: 'divide-conquer',
    title: 'Divide and Conquer',
    track: 'Problem Splitting',
    level: 'Intermediate',
    color: '#6366f1',
    description: 'Split, solve, combine, and reason about recursive halves.',
    topics: [
      'Merge Sort',
      'Quick Sort',
      'Binary Search variants',
    ],
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    track: 'Binary Thinking',
    level: 'Core',
    color: '#84cc16',
    description: 'Low-level operations, masks, powers of two, and bitset generation.',
    topics: [
      'AND, OR, XOR, Shift Operations',
      'Checking Power of 2',
      'Subset Generation using Bits',
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced / Optional',
    track: 'After Basics',
    level: 'Advanced',
    color: '#fb7185',
    description: 'High-leverage structures and algorithms for serious contest and interview depth.',
    topics: [
      'LRU Cache',
      'Suffix Array and Suffix Tree',
      'Heavy-Light Decomposition',
      "MO's Algorithm",
      'Segment Tree with Lazy Propagation',
      'KMP and Z Algorithm (String Matching)',
    ],
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getFocus(title, sectionTitle) {
  const lower = title.toLowerCase();

  if (lower.includes('complexity') || lower.includes('big-o') || lower.includes('omega')) {
    return 'Estimate how runtime and memory grow before writing code.';
  }
  if (lower.includes('search')) {
    return 'Track the search space, the invariant, and why each step removes candidates.';
  }
  if (lower.includes('sort')) {
    return 'Watch how order is created through comparisons, swaps, splits, or buckets.';
  }
  if (lower.includes('dp') || lower.includes('knapsack') || lower.includes('subsequence')) {
    return 'Name the state clearly, define the transition, then choose memoization or tabulation.';
  }
  if (lower.includes('graph') || lower.includes('bfs') || lower.includes('dfs') || lower.includes('dijkstra')) {
    return 'Model nodes and edges first, then choose the traversal or relaxation strategy.';
  }
  if (lower.includes('tree') || lower.includes('trie') || lower.includes('heap')) {
    return 'Understand structure shape, traversal order, and how updates preserve invariants.';
  }
  if (lower.includes('recursion') || lower.includes('backtracking') || lower.includes('permutation')) {
    return 'Think in decisions, base cases, and what state must be restored after a branch.';
  }
  if (lower.includes('hash') || lower.includes('frequency')) {
    return 'Use keys to avoid repeated scanning and turn repeated work into fast lookup.';
  }

  return `Build the core mental model for ${title} inside ${sectionTitle}.`;
}

function getMilestone(order) {
  if (order <= 20) return 'Foundation';
  if (order <= 55) return 'Fluency';
  if (order <= 90) return 'Interview Ready';
  return 'Expert Track';
}

let globalOrder = 0;

export const DSA_BEGINNERS_CURRICULUM = rawSections.map((section) => ({
  ...section,
  concepts: section.topics.map((title, index) => {
    globalOrder += 1;
    return {
      id: `${section.id}-${slugify(title)}`,
      title,
      sectionId: section.id,
      sectionTitle: section.title,
      track: section.track,
      level: section.level,
      color: section.color,
      order: globalOrder,
      localOrder: index + 1,
      milestone: getMilestone(globalOrder),
      focus: getFocus(title, section.title),
    };
  }),
}));

export const DSA_BEGINNER_CONCEPTS = DSA_BEGINNERS_CURRICULUM.flatMap(
  (section) => section.concepts
);

export const DSA_BEGINNER_TOTAL = DSA_BEGINNER_CONCEPTS.length;

export function getBeginnerConceptById(conceptId) {
  return DSA_BEGINNER_CONCEPTS.find((concept) => concept.id === conceptId) || null;
}

export function getBeginnerSectionById(sectionId) {
  return DSA_BEGINNERS_CURRICULUM.find((section) => section.id === sectionId) || null;
}
