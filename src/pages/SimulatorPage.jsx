import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SimulatorPage.css';

import ArrayVisualizer from '../modules/array/ArrayVisualizer';
import StackVisualizer from '../modules/stack/StackVisualizer';
import QueueVisualizer from '../modules/queue/QueueVisualizer';
import LinkedListVisualizer from '../modules/linkedlist/LinkedListVisualizer';
import BinarySearchVisualizer from '../modules/searching/BinarySearchVisualizer';
import BubbleSortVisualizer from '../modules/sorting/BubbleSortVisualizer';
import InsertionSortVisualizer from '../modules/sorting/InsertionSortVisualizer';
import SelectionSortVisualizer from '../modules/sorting/SelectionSortVisualizer';
import BSTVisualizer from '../modules/bst/BSTVisualizer';
import AVLVisualizer from '../modules/avl/AVLVisualizer';
import GraphVisualizer from '../modules/graph/GraphVisualizer';
import HeapVisualizer from '../modules/heap/HeapVisualizer';
import HashVisualizer from '../modules/hashtable/HashVisualizer';
import TrieVisualizer from '../modules/trie/TrieVisualizer';
import DijkstraVisualizer from '../modules/dijkstra/DijkstraVisualizer';
import MergeSortVisualizer from '../modules/mergesort/MergeSortVisualizer';
import QuickSortVisualizer from '../modules/quicksort/QuickSortVisualizer';
import BellmanFordVisualizer from '../modules/bellmanford/BellmanFordVisualizer';

const sections = [
  {
    id: 'array',
    label: 'Array',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'Index-based storage, traversal, updates, and shifting operations.',
    difficulty: 'Beginner',
    outcome: 'Understand contiguous memory, indexing, and common mutations.',
    prerequisite: 'Comfort with loops, variables, and zero-based indexing.',
    pattern: 'Two pointers, sliding window, prefix processing.',
    examplePrompt: 'Find the maximum sum subarray of size k.',
    coachTip: 'Track exactly what each index means before you optimize anything.',
    starterPlan: ['Read the prompt slowly', 'Write brute force first', 'Identify repeated work', 'Map it to a known pattern'],
    editorTemplates: {
      javascript: `function maxSumSubarray(nums, k) {
  let windowSum = 0;
  let best = -Infinity;

  for (let i = 0; i < nums.length; i++) {
    windowSum += nums[i];

    if (i >= k) {
      windowSum -= nums[i - k];
    }

    if (i >= k - 1) {
      best = Math.max(best, windowSum);
    }
  }

  return best;
}`,
      python: `def max_sum_subarray(nums, k):
    window_sum = 0
    best = float("-inf")

    for i, value in enumerate(nums):
        window_sum += value

        if i >= k:
            window_sum -= nums[i - k]

        if i >= k - 1:
            best = max(best, window_sum)

    return best`,
      cpp: `int maxSumSubarray(vector<int>& nums, int k) {
    int windowSum = 0;
    int best = INT_MIN;

    for (int i = 0; i < nums.size(); i++) {
        windowSum += nums[i];

        if (i >= k) {
            windowSum -= nums[i - k];
        }

        if (i >= k - 1) {
            best = max(best, windowSum);
        }
    }

    return best;
}`,
    },
    problem: {
      title: 'Maximum Sum Subarray of Size K',
      statement:
        'Given an integer array and a positive integer k, return the maximum sum of any contiguous subarray of size k.',
      constraints: ['1 <= array length <= 10^5', 'Values may be negative', 'Need a contiguous window', 'Target time should be near O(n)'],
      examples: [
        'Input: nums = [2, 1, 5, 1, 3, 2], k = 3 → Output: 9',
        'Input: nums = [-1, -2, -3, -4], k = 2 → Output: -3',
      ],
      hints: ['What part of the sum changes when the window moves by one?', 'Can you reuse the previous window sum instead of recomputing it?'],
    },
    Component: ArrayVisualizer,
  },
  {
    id: 'linkedlist',
    label: 'Linked List',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'Node connections, pointer movement, insertion, and deletion flow.',
    difficulty: 'Beginner',
    outcome: 'Track references clearly and reason about node-by-node changes.',
    prerequisite: 'Pointers or references, null checks, iterative traversal.',
    pattern: 'Fast and slow pointers, dummy node, pointer rewiring.',
    examplePrompt: 'Reverse a linked list in-place.',
    coachTip: 'Draw next pointers before changing them so you never lose the chain.',
    starterPlan: ['Name current and next pointers', 'Sketch one small list', 'Simulate one mutation', 'Only then code the loop'],
    editorTemplates: {
      javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }

  return prev;
}`,
      python: `def reverse_list(head):
    prev = None
    curr = head

    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node

    return prev`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;

    while (curr) {
        ListNode* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }

    return prev;
}`,
    },
    problem: {
      title: 'Reverse a Linked List',
      statement:
        'Given the head of a singly linked list, reverse the list and return the new head.',
      constraints: ['Number of nodes is in the range [0, 5000]', 'Do not create a second full list', 'Rewire pointers safely', 'Aim for O(n) time'],
      examples: [
        'Input: 1 -> 2 -> 3 -> 4 -> 5 → Output: 5 -> 4 -> 3 -> 2 -> 1',
        'Input: 1 -> 2 → Output: 2 -> 1',
      ],
      hints: ['What pointer do you lose if you overwrite next too early?', 'Can you keep prev, curr, and next in each step?'],
    },
    Component: LinkedListVisualizer,
  },
  {
    id: 'stack',
    label: 'Stack',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'LIFO behavior with push, pop, peek, and execution-style thinking.',
    difficulty: 'Beginner',
    outcome: 'Build intuition for undo flows, recursion, and nested evaluation.',
    prerequisite: 'Arrays, loops, and conditional branching.',
    pattern: 'Monotonic stack, bracket matching, call stack simulation.',
    examplePrompt: 'Validate whether a parentheses string is balanced.',
    coachTip: 'Ask what the stack should contain after every character or step.',
    starterPlan: ['Define what goes on the stack', 'List push and pop cases', 'Simulate with a tiny input', 'Check the final stack state'],
    editorTemplates: {
      javascript: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (!pairs[ch]) {
      stack.push(ch);
      continue;
    }

    if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }

  return stack.length === 0;
}`,
      python: `def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for ch in s:
        if ch not in pairs:
            stack.append(ch)
            continue

        if not stack or stack.pop() != pairs[ch]:
            return False

    return len(stack) == 0`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pairs = {
        {')', '('}, {']', '['}, {'}', '{'}
    };

    for (char ch : s) {
        if (!pairs.count(ch)) {
            st.push(ch);
            continue;
        }

        if (st.empty() || st.top() != pairs[ch]) {
            return false;
        }

        st.pop();
    }

    return st.empty();
}`,
    },
    problem: {
      title: 'Valid Parentheses',
      statement:
        'Given a string containing only brackets (), {}, and [], determine whether the input string is valid.',
      constraints: ['1 <= string length <= 10^4', 'Every closing bracket must match type', 'Order matters', 'Use linear time if possible'],
      examples: [
        'Input: "()[]{}" → Output: true',
        'Input: "([)]" → Output: false',
      ],
      hints: ['What should the top of the stack represent?', 'When do you immediately know the string is invalid?'],
    },
    Component: StackVisualizer,
  },
  {
    id: 'queue',
    label: 'Queue',
    phase: 'P1',
    color: '#00d4aa',
    summary: 'FIFO processing with enqueue, dequeue, and ordering intuition.',
    difficulty: 'Beginner',
    outcome: 'Understand service order, buffering, and breadth-first processing.',
    prerequisite: 'Basic arrays and front/back update logic.',
    pattern: 'Level-order traversal, task scheduling, stream buffering.',
    examplePrompt: 'Simulate a queue of requests arriving over time.',
    coachTip: 'Be explicit about what enters first and what leaves first.',
    starterPlan: ['Mark front and back clearly', 'Trace two enqueue operations', 'Trace one dequeue', 'Confirm order is preserved'],
    editorTemplates: {
      javascript: `class RecentCounter {
  constructor() {
    this.queue = [];
  }

  ping(t) {
    this.queue.push(t);

    while (this.queue[0] < t - 3000) {
      this.queue.shift();
    }

    return this.queue.length;
  }
}`,
      python: `from collections import deque

class RecentCounter:
    def __init__(self):
        self.queue = deque()

    def ping(self, t):
        self.queue.append(t)

        while self.queue and self.queue[0] < t - 3000:
            self.queue.popleft()

        return len(self.queue)`,
      cpp: `class RecentCounter {
public:
    queue<int> q;

    int ping(int t) {
        q.push(t);

        while (!q.empty() && q.front() < t - 3000) {
            q.pop();
        }

        return q.size();
    }
};`,
    },
    problem: {
      title: 'Number of Recent Calls',
      statement:
        'Implement a class that counts requests made in the last 3000 milliseconds, where each new request arrives in increasing time order.',
      constraints: ['Times are strictly increasing', 'Need efficient eviction of old requests', 'Many queries may occur', 'A queue-based approach is expected'],
      examples: [
        'ping(1) → 1, ping(100) → 2, ping(3001) → 3, ping(3002) → 3',
        'Requests older than current time minus 3000 should be removed',
      ],
      hints: ['Which end should receive new timestamps?', 'Which end should remove expired timestamps?'],
    },
    Component: QueueVisualizer,
  },
  {
    id: 'bst',
    label: 'BST',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Binary search tree operations, ordering rules, and recursive paths.',
    difficulty: 'Intermediate',
    outcome: 'Reason about ordered insertion, lookup, and tree traversal paths.',
    prerequisite: 'Recursion, tree terminology, binary decisions.',
    pattern: 'Ordered recursion, subtree bounds, successor/predecessor logic.',
    examplePrompt: 'Validate whether a binary tree is a BST.',
    coachTip: 'Think in value ranges, not just parent-child comparisons.',
    starterPlan: ['State the BST rule', 'Decide recursive information', 'Test a broken edge case', 'Then implement bounds cleanly'],
    editorTemplates: {
      javascript: `function isValidBST(root, low = -Infinity, high = Infinity) {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;

  return (
    isValidBST(root.left, low, root.val) &&
    isValidBST(root.right, root.val, high)
  );
}`,
      python: `def is_valid_bst(root, low=float("-inf"), high=float("inf")):
    if not root:
        return True

    if root.val <= low or root.val >= high:
        return False

    return (
        is_valid_bst(root.left, low, root.val)
        and
        is_valid_bst(root.right, root.val, high)
    )`,
      cpp: `bool isValidBST(TreeNode* root, long low = LONG_MIN, long high = LONG_MAX) {
    if (!root) return true;
    if (root->val <= low || root->val >= high) return false;

    return isValidBST(root->left, low, root->val) &&
           isValidBST(root->right, root->val, high);
}`,
    },
    problem: {
      title: 'Validate Binary Search Tree',
      statement:
        'Given the root of a binary tree, determine whether it is a valid binary search tree.',
      constraints: ['Node values can be large positive or negative integers', 'Every node in left subtree must be smaller', 'Every node in right subtree must be larger', 'Need a full-tree check, not only parent-child checks'],
      examples: [
        'Input: [2,1,3] → Output: true',
        'Input: [5,1,4,null,null,3,6] → Output: false',
      ],
      hints: ['What range of values is valid for each subtree?', 'Why is comparing only with the parent insufficient?'],
    },
    Component: BSTVisualizer,
  },
  {
    id: 'avl',
    label: 'AVL Tree',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Self-balancing tree behavior with rotations and height updates.',
    difficulty: 'Intermediate',
    outcome: 'See how rotations preserve balance after insertions and deletions.',
    prerequisite: 'BST basics, tree height, recursion.',
    pattern: 'Rebalancing, LL/LR/RR/RL rotations, height propagation.',
    examplePrompt: 'Insert a sequence of keys and rebalance after each step.',
    coachTip: 'Memorize rotation triggers visually before coding the cases.',
    starterPlan: ['Compute balance factor', 'Identify imbalance type', 'Apply correct rotation', 'Update heights afterward'],
    editorTemplates: {
      javascript: `function getBalance(node) {
  return node ? height(node.left) - height(node.right) : 0;
}

function rebalance(node) {
  const balance = getBalance(node);

  if (balance > 1 && getBalance(node.left) >= 0) {
    return rotateRight(node);
  }

  if (balance > 1 && getBalance(node.left) < 0) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }

  if (balance < -1 && getBalance(node.right) <= 0) {
    return rotateLeft(node);
  }

  if (balance < -1 && getBalance(node.right) > 0) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }

  return node;
}`,
      python: `def rebalance(node):
    balance = get_balance(node)

    if balance > 1 and get_balance(node.left) >= 0:
        return rotate_right(node)

    if balance > 1 and get_balance(node.left) < 0:
        node.left = rotate_left(node.left)
        return rotate_right(node)

    if balance < -1 and get_balance(node.right) <= 0:
        return rotate_left(node)

    if balance < -1 and get_balance(node.right) > 0:
        node.right = rotate_right(node.right)
        return rotate_left(node)

    return node`,
      cpp: `Node* rebalance(Node* node) {
    int balance = getBalance(node);

    if (balance > 1 && getBalance(node->left) >= 0) {
        return rotateRight(node);
    }

    if (balance > 1 && getBalance(node->left) < 0) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }

    if (balance < -1 && getBalance(node->right) <= 0) {
        return rotateLeft(node);
    }

    if (balance < -1 && getBalance(node->right) > 0) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    return node;
}`,
    },
    problem: {
      title: 'AVL Insert and Rebalance',
      statement:
        'Insert keys into an AVL tree one by one and rebalance after each insertion so that the balance factor of every node stays within the allowed range.',
      constraints: ['Balance factor must remain between -1 and 1', 'Rotations must preserve BST order', 'Height updates are required after structural changes', 'Insertion should remain logarithmic on balanced trees'],
      examples: [
        'Insert [30, 20, 10] → right rotation needed',
        'Insert [30, 10, 20] → left-right rotation needed',
      ],
      hints: ['Which four imbalance cases can happen after insertion?', 'When should height be updated relative to rotation?'],
    },
    Component: AVLVisualizer,
  },
  {
    id: 'graph',
    label: 'Graph',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Vertices, edges, traversals, adjacency logic, and connectivity.',
    difficulty: 'Intermediate',
    outcome: 'Map problems to graph models and inspect traversal state clearly.',
    prerequisite: 'Sets, adjacency lists, and traversal fundamentals.',
    pattern: 'DFS, BFS, visited tracking, connected components.',
    examplePrompt: 'Count connected components in an undirected graph.',
    coachTip: 'Decide early whether the graph is directed, weighted, or cyclic.',
    starterPlan: ['Choose graph representation', 'Write visited logic', 'Simulate one traversal', 'Count what changes per node'],
    editorTemplates: {
      javascript: `function countComponents(n, edges) {
  const graph = Array.from({ length: n }, () => []);
  const seen = new Array(n).fill(false);
  let count = 0;

  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  function dfs(node) {
    seen[node] = true;
    for (const next of graph[node]) {
      if (!seen[next]) dfs(next);
    }
  }

  for (let node = 0; node < n; node++) {
    if (!seen[node]) {
      count++;
      dfs(node);
    }
  }

  return count;
}`,
      python: `def count_components(n, edges):
    graph = [[] for _ in range(n)]
    seen = [False] * n
    count = 0

    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    def dfs(node):
        seen[node] = True
        for nxt in graph[node]:
            if not seen[nxt]:
                dfs(nxt)

    for node in range(n):
        if not seen[node]:
            count += 1
            dfs(node)

    return count`,
      cpp: `int countComponents(int n, vector<vector<int>>& edges) {
    vector<vector<int>> graph(n);
    vector<bool> seen(n, false);
    int count = 0;

    for (auto& edge : edges) {
        graph[edge[0]].push_back(edge[1]);
        graph[edge[1]].push_back(edge[0]);
    }

    function<void(int)> dfs = [&](int node) {
        seen[node] = true;
        for (int next : graph[node]) {
            if (!seen[next]) dfs(next);
        }
    };

    for (int node = 0; node < n; node++) {
        if (!seen[node]) {
            count++;
            dfs(node);
        }
    }

    return count;
}`,
    },
    problem: {
      title: 'Count Connected Components',
      statement:
        'Given n nodes labeled from 0 to n - 1 and a list of undirected edges, return the number of connected components in the graph.',
      constraints: ['1 <= n <= 2000', 'Graph may be disconnected', 'Edges are undirected', 'Need to avoid recounting visited nodes'],
      examples: [
        'n = 5, edges = [[0,1],[1,2],[3,4]] → Output: 2',
        'n = 4, edges = [] → Output: 4',
      ],
      hints: ['What starts a new component count?', 'How do DFS or BFS prevent double counting?'],
    },
    Component: GraphVisualizer,
  },
  {
    id: 'heap',
    label: 'Heap',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Priority-based structure with heapify, insert, and delete behavior.',
    difficulty: 'Intermediate',
    outcome: 'Understand parent-child ordering and priority queue mechanics.',
    prerequisite: 'Tree indexing inside arrays and swap operations.',
    pattern: 'Top-k, greedy selection, priority-driven processing.',
    examplePrompt: 'Return the k largest elements from a stream.',
    coachTip: 'Focus on heap property, not full sorting of the array.',
    starterPlan: ['Define min-heap or max-heap', 'Trace parent-child indices', 'Simulate one sift operation', 'Check the root after updates'],
    editorTemplates: {
      javascript: `function topK(nums, k) {
  const minHeap = [];

  for (const num of nums) {
    pushHeap(minHeap, num);

    if (minHeap.length > k) {
      popHeap(minHeap);
    }
  }

  return minHeap;
}`,
      python: `import heapq

def top_k(nums, k):
    heap = []

    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)

    return heap`,
      cpp: `vector<int> topK(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;

    for (int num : nums) {
        pq.push(num);
        if (pq.size() > k) {
            pq.pop();
        }
    }

    vector<int> result;
    while (!pq.empty()) {
        result.push_back(pq.top());
        pq.pop();
    }

    return result;
}`,
    },
    problem: {
      title: 'K Largest Elements in a Stream',
      statement:
        'Process a stream of integers and return the k largest elements seen so far after all insertions.',
      constraints: ['Stream can be large', 'Need to keep only useful elements', 'Aim for O(n log k)', 'Heap size should stay bounded by k'],
      examples: [
        'stream = [5, 12, 3, 17, 10], k = 3 → Output: [10, 12, 17] in any order',
        'If current value is smaller than heap minimum, it may be ignored',
      ],
      hints: ['What heap type should track the current top k?', 'What happens when heap size becomes larger than k?'],
    },
    Component: HeapVisualizer,
  },
  {
    id: 'hashtable',
    label: 'Hash Table',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Hashing, collisions, bucket behavior, and lookup efficiency.',
    difficulty: 'Intermediate',
    outcome: 'Visualize hashing tradeoffs, collisions, and bucket placement.',
    prerequisite: 'Arrays, modulo intuition, key-value storage.',
    pattern: 'Frequency maps, caching, counting, quick membership checks.',
    examplePrompt: 'Find the first repeated value in an array.',
    coachTip: 'Use the map to remove repeated scanning, not just to store everything.',
    starterPlan: ['Decide key and value meaning', 'Process one element at a time', 'Update frequency or lookup', 'Stop when condition is met'],
    editorTemplates: {
      javascript: `function firstRepeated(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) return num;
    seen.add(num);
  }

  return null;
}`,
      python: `def first_repeated(nums):
    seen = set()

    for num in nums:
        if num in seen:
            return num
        seen.add(num)

    return None`,
      cpp: `int firstRepeated(vector<int>& nums) {
    unordered_set<int> seen;

    for (int num : nums) {
        if (seen.count(num)) return num;
        seen.insert(num);
    }

    return -1;
}`,
    },
    problem: {
      title: 'First Repeated Value',
      statement:
        'Given an integer array, return the first value that appears more than once when scanning from left to right.',
      constraints: ['Array length can be large', 'Need fast membership checking', 'Return the repeated value, not its count', 'Prefer O(n) time'],
      examples: [
        'Input: [2, 5, 1, 2, 3, 5, 1] → Output: 2',
        'Input: [1, 2, 3, 4] → Output: no repeated value',
      ],
      hints: ['What information should be stored after seeing each value?', 'When can you return immediately?'],
    },
    Component: HashVisualizer,
  },
  {
    id: 'trie',
    label: 'Trie',
    phase: 'P2',
    color: '#4a9eff',
    summary: 'Prefix-based lookup, branching paths, and string search structure.',
    difficulty: 'Intermediate',
    outcome: 'Think in prefixes and branching character paths for fast lookup.',
    prerequisite: 'Strings, character iteration, tree basics.',
    pattern: 'Prefix search, autocomplete, dictionary matching.',
    examplePrompt: 'Build autocomplete suggestions for a search box.',
    coachTip: 'Treat each character like a branching decision, not a full string compare.',
    starterPlan: ['Walk one character at a time', 'Create missing nodes', 'Mark word endings', 'Verify one prefix query'],
    editorTemplates: {
      javascript: `class TrieNode {
  constructor() {
    this.children = {};
    this.isWord = false;
  }
}

function insert(root, word) {
  let node = root;
  for (const ch of word) {
    if (!node.children[ch]) {
      node.children[ch] = new TrieNode();
    }
    node = node.children[ch];
  }
  node.isWord = true;
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def insert(root, word):
    node = root
    for ch in word:
        if ch not in node.children:
            node.children[ch] = TrieNode()
        node = node.children[ch]
    node.is_word = True`,
      cpp: `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isWord = false;
};

void insert(TrieNode* root, string word) {
    TrieNode* node = root;

    for (char ch : word) {
        if (!node->children.count(ch)) {
            node->children[ch] = new TrieNode();
        }
        node = node->children[ch];
    }

    node->isWord = true;
}`,
    },
    problem: {
      title: 'Autocomplete Prefix Search',
      statement:
        'Design a trie that stores words and returns all words that begin with a given prefix.',
      constraints: ['Words contain lowercase English letters', 'Prefix queries may be frequent', 'Insertion and prefix walk should be efficient', 'Need a word-end marker'],
      examples: [
        'Insert: apple, app, apt → Query: "ap" → Output includes apple, app, apt',
        'Query: "bat" with no branch → Output: empty list',
      ],
      hints: ['What should each node store besides child references?', 'What happens if a prefix path breaks early?'],
    },
    Component: TrieVisualizer,
  },
  {
    id: 'bsearch',
    label: 'Binary Search',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Midpoint reasoning, shrinking search space, and sorted-array logic.',
    difficulty: 'Beginner',
    outcome: 'Practice boundary updates and off-by-one safe reasoning.',
    prerequisite: 'Sorted arrays and loop invariants.',
    pattern: 'Lower bound, upper bound, answer-space search.',
    examplePrompt: 'Find the first index where value is at least target.',
    coachTip: 'Write down the meaning of left and right before entering the loop.',
    starterPlan: ['Define search interval', 'Choose loop condition', 'Update one boundary only', 'Return the invariant result'],
    editorTemplates: {
      javascript: `function lowerBound(nums, target) {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}`,
      python: `def lower_bound(nums, target):
    left, right = 0, len(nums)

    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left`,
      cpp: `int lowerBound(vector<int>& nums, int target) {
    int left = 0, right = nums.size();

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}`,
    },
    problem: {
      title: 'First Position Greater Than or Equal to Target',
      statement:
        'Given a sorted array and a target value, return the first index where the value is greater than or equal to the target.',
      constraints: ['Array is sorted in non-decreasing order', 'Duplicates may exist', 'Need boundary-safe logic', 'Prefer O(log n) time'],
      examples: [
        'Input: nums = [1,2,4,4,5], target = 4 → Output: 2',
        'Input: nums = [1,3,5], target = 2 → Output: 1',
      ],
      hints: ['Should you move right when nums[mid] equals target?', 'What invariant should remain true after each update?'],
    },
    Component: BinarySearchVisualizer,
  },
  {
    id: 'bubble',
    label: 'Bubble Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Adjacent swaps, repeated passes, and comparison-heavy sorting.',
    difficulty: 'Beginner',
    outcome: 'Observe how repeated local swaps gradually create global order.',
    prerequisite: 'Loops, swaps, and comparison operators.',
    pattern: 'Pass shrinking, adjacent inversion fixing.',
    examplePrompt: 'Sort a small list while counting swaps.',
    coachTip: 'Notice what becomes guaranteed after each full pass.',
    starterPlan: ['Compare adjacent values', 'Swap when needed', 'Finish one full pass', 'Shrink the unsorted region'],
    editorTemplates: {
      javascript: `function bubbleSort(nums) {
  let swaps = 0;

  for (let end = nums.length - 1; end > 0; end--) {
    let changed = false;

    for (let i = 0; i < end; i++) {
      if (nums[i] > nums[i + 1]) {
        [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
        swaps++;
        changed = true;
      }
    }

    if (!changed) break;
  }

  return { nums, swaps };
}`,
      python: `def bubble_sort(nums):
    swaps = 0

    for end in range(len(nums) - 1, 0, -1):
        changed = False
        for i in range(end):
            if nums[i] > nums[i + 1]:
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
                swaps += 1
                changed = True

        if not changed:
            break

    return nums, swaps`,
      cpp: `pair<vector<int>, int> bubbleSort(vector<int> nums) {
    int swaps = 0;

    for (int end = nums.size() - 1; end > 0; end--) {
        bool changed = false;

        for (int i = 0; i < end; i++) {
            if (nums[i] > nums[i + 1]) {
                swap(nums[i], nums[i + 1]);
                swaps++;
                changed = true;
            }
        }

        if (!changed) break;
    }

    return {nums, swaps};
}`,
    },
    problem: {
      title: 'Bubble Sort With Swap Count',
      statement:
        'Sort an array in ascending order using bubble sort and report how many swaps were performed.',
      constraints: ['Need adjacent swaps only', 'Repeated passes are required', 'Can stop early if no swaps happen', 'Time complexity is quadratic in worst case'],
      examples: [
        'Input: [5, 1, 4, 2] → Sorted: [1, 2, 4, 5]',
        'A pass with zero swaps means the array is already sorted',
      ],
      hints: ['What element is guaranteed after each pass?', 'How can a boolean flag help stop early?'],
    },
    Component: BubbleSortVisualizer,
  },
  {
    id: 'insertion',
    label: 'Insertion Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Build a sorted region step by step through insertion and shifting.',
    difficulty: 'Beginner',
    outcome: 'See how partial order grows as each value finds its position.',
    prerequisite: 'Array traversal and shifting values.',
    pattern: 'Growing sorted prefix, local insertion.',
    examplePrompt: 'Insert each number into the right place of a sorted prefix.',
    coachTip: 'Keep the sorted prefix mentally separate from the rest of the array.',
    starterPlan: ['Pick current value', 'Shift larger items right', 'Insert into gap', 'Expand sorted prefix'],
    editorTemplates: {
      javascript: `function insertionSort(nums) {
  for (let i = 1; i < nums.length; i++) {
    const value = nums[i];
    let j = i - 1;

    while (j >= 0 && nums[j] > value) {
      nums[j + 1] = nums[j];
      j--;
    }

    nums[j + 1] = value;
  }

  return nums;
}`,
      python: `def insertion_sort(nums):
    for i in range(1, len(nums)):
        value = nums[i]
        j = i - 1

        while j >= 0 and nums[j] > value:
            nums[j + 1] = nums[j]
            j -= 1

        nums[j + 1] = value

    return nums`,
      cpp: `vector<int> insertionSort(vector<int> nums) {
    for (int i = 1; i < nums.size(); i++) {
        int value = nums[i];
        int j = i - 1;

        while (j >= 0 && nums[j] > value) {
            nums[j + 1] = nums[j];
            j--;
        }

        nums[j + 1] = value;
    }

    return nums;
}`,
    },
    problem: {
      title: 'Insertion Sort Walkthrough',
      statement:
        'Sort an array using insertion sort by growing a sorted prefix one element at a time.',
      constraints: ['Shift larger values right before inserting', 'Sorted region grows from left to right', 'In-place updates are expected', 'Worst-case time is O(n^2)'],
      examples: [
        'Input: [4, 3, 2, 10] → Output: [2, 3, 4, 10]',
        'After each step, the left prefix should stay sorted',
      ],
      hints: ['What part of the array is guaranteed sorted before each insertion?', 'When should shifting stop?'],
    },
    Component: InsertionSortVisualizer,
  },
  {
    id: 'selection',
    label: 'Selection Sort',
    phase: 'P3',
    color: '#8b7cf8',
    summary: 'Repeated minimum selection and controlled swap placement.',
    difficulty: 'Beginner',
    outcome: 'Develop a clean mental model for selection and fixed progress.',
    prerequisite: 'Nested loops and min tracking.',
    pattern: 'Find-min then place, deterministic progress.',
    examplePrompt: 'Select the minimum value for each array position.',
    coachTip: 'Separate the search phase from the swap phase in your head.',
    starterPlan: ['Mark current index', 'Scan for minimum', 'Swap once per pass', 'Move boundary forward'],
    editorTemplates: {
      javascript: `function selectionSort(nums) {
  for (let i = 0; i < nums.length; i++) {
    let minIdx = i;

    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] < nums[minIdx]) {
        minIdx = j;
      }
    }

    [nums[i], nums[minIdx]] = [nums[minIdx], nums[i]];
  }

  return nums;
}`,
      python: `def selection_sort(nums):
    for i in range(len(nums)):
        min_idx = i

        for j in range(i + 1, len(nums)):
            if nums[j] < nums[min_idx]:
                min_idx = j

        nums[i], nums[min_idx] = nums[min_idx], nums[i]

    return nums`,
      cpp: `vector<int> selectionSort(vector<int> nums) {
    for (int i = 0; i < nums.size(); i++) {
        int minIdx = i;

        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[j] < nums[minIdx]) {
                minIdx = j;
            }
        }

        swap(nums[i], nums[minIdx]);
    }

    return nums;
}`,
    },
    problem: {
      title: 'Selection Sort Passes',
      statement:
        'Sort an array by repeatedly selecting the minimum element from the unsorted part and placing it at the current index.',
      constraints: ['One selected minimum per pass', 'The left side becomes fixed gradually', 'In-place swapping is expected', 'Worst-case time is O(n^2)'],
      examples: [
        'Input: [64, 25, 12, 22, 11] → Output: [11, 12, 22, 25, 64]',
        'After each pass, one more position is finalized',
      ],
      hints: ['What index should track the current minimum?', 'Why is only one swap needed per pass?'],
    },
    Component: SelectionSortVisualizer,
  },
  {
    id: 'mergesort',
    label: 'Merge Sort',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Divide-and-conquer splitting, merging, and recursive composition.',
    difficulty: 'Advanced',
    outcome: 'Understand recursive splitting and stable merging mechanics.',
    prerequisite: 'Recursion, temporary arrays, merge logic.',
    pattern: 'Divide and conquer, stable sorting, recursion tree.',
    examplePrompt: 'Sort an unsorted array using merge steps.',
    coachTip: 'Track split boundaries and merge order separately.',
    starterPlan: ['Find midpoint', 'Sort both halves', 'Merge in order', 'Copy leftovers carefully'],
    editorTemplates: {
      javascript: `function mergeSort(nums) {
  if (nums.length <= 1) return nums;

  const mid = Math.floor(nums.length / 2);
  const left = mergeSort(nums.slice(0, mid));
  const right = mergeSort(nums.slice(mid));

  return merge(left, right);
}`,
      python: `def merge_sort(nums):
    if len(nums) <= 1:
        return nums

    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])

    return merge(left, right)`,
      cpp: `vector<int> mergeSort(vector<int> nums) {
    if (nums.size() <= 1) return nums;

    int mid = nums.size() / 2;
    vector<int> left(nums.begin(), nums.begin() + mid);
    vector<int> right(nums.begin() + mid, nums.end());

    left = mergeSort(left);
    right = mergeSort(right);

    return merge(left, right);
}`,
    },
    problem: {
      title: 'Merge Sort an Array',
      statement:
        'Sort an unsorted array using merge sort by recursively splitting the array and merging sorted halves.',
      constraints: ['Use divide and conquer', 'Need a correct merge routine', 'Stable ordering should be preserved', 'Target time is O(n log n)'],
      examples: [
        'Input: [5, 2, 3, 1] → Output: [1, 2, 3, 5]',
        'Split until single elements, then merge upward',
      ],
      hints: ['What is the base case of the recursion?', 'During merge, which pointer should move next?'],
    },
    Component: MergeSortVisualizer,
  },
  {
    id: 'quicksort',
    label: 'Quick Sort',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Pivot partitioning, recursive sorting, and in-place strategy.',
    difficulty: 'Advanced',
    outcome: 'Track pivots, partitions, and recursive boundaries with confidence.',
    prerequisite: 'Pointers, swapping, and recursion basics.',
    pattern: 'Partition around pivot, in-place divide and conquer.',
    examplePrompt: 'Place each pivot so smaller values go left and larger go right.',
    coachTip: 'Make the partition invariant explicit before coding swaps.',
    starterPlan: ['Choose pivot', 'Move pointers inward', 'Partition correctly', 'Recurse on both sides'],
    editorTemplates: {
      javascript: `function quickSort(nums, left = 0, right = nums.length - 1) {
  if (left >= right) return nums;

  const pivot = partition(nums, left, right);
  quickSort(nums, left, pivot - 1);
  quickSort(nums, pivot + 1, right);

  return nums;
}`,
      python: `def quick_sort(nums, left=0, right=None):
    if right is None:
        right = len(nums) - 1

    if left >= right:
        return nums

    pivot = partition(nums, left, right)
    quick_sort(nums, left, pivot - 1)
    quick_sort(nums, pivot + 1, right)
    return nums`,
      cpp: `vector<int>& quickSort(vector<int>& nums, int left, int right) {
    if (left >= right) return nums;

    int pivot = partition(nums, left, right);
    quickSort(nums, left, pivot - 1);
    quickSort(nums, pivot + 1, right);

    return nums;
}`,
    },
    problem: {
      title: 'Quick Sort Partition and Recurse',
      statement:
        'Sort an array using quick sort by choosing a pivot, partitioning the array, and recursively sorting both sides.',
      constraints: ['Partitioning must maintain a correct invariant', 'Recursion uses subarray boundaries', 'In-place approach is preferred', 'Average time target is O(n log n)'],
      examples: [
        'Input: [8, 3, 1, 7, 0, 10, 2] → Output: sorted array',
        'All values smaller than pivot should end up on one side after partition',
      ],
      hints: ['What condition must be true before and after partition?', 'Which indices define the next recursive calls?'],
    },
    Component: QuickSortVisualizer,
  },
  {
    id: 'dijkstra',
    label: "Dijkstra's",
    phase: 'P4',
    color: '#f5a623',
    summary: 'Shortest paths with greedy relaxation and frontier updates.',
    difficulty: 'Advanced',
    outcome: 'Learn why the closest unsettled node drives the algorithm forward.',
    prerequisite: 'Graphs, weights, priority queue intuition.',
    pattern: 'Greedy shortest path, relax edges, update frontier.',
    examplePrompt: 'Find the shortest path from source to all nodes.',
    coachTip: 'Every pop from the priority queue should answer one clear question.',
    starterPlan: ['Initialize distances', 'Pop smallest frontier node', 'Relax outgoing edges', 'Skip stale queue entries'],
    editorTemplates: {
      javascript: `function dijkstra(graph, source) {
  const dist = new Map();
  const pq = [[0, source]];

  dist.set(source, 0);

  while (pq.length) {
    const [cost, node] = pq.shift();

    for (const [next, weight] of graph[node]) {
      const newCost = cost + weight;

      if (!dist.has(next) || newCost < dist.get(next)) {
        dist.set(next, newCost);
        pq.push([newCost, next]);
        pq.sort((a, b) => a[0] - b[0]);
      }
    }
  }

  return dist;
}`,
      python: `import heapq

def dijkstra(graph, source):
    dist = {source: 0}
    pq = [(0, source)]

    while pq:
        cost, node = heapq.heappop(pq)

        if cost > dist[node]:
            continue

        for nxt, weight in graph[node]:
            new_cost = cost + weight
            if nxt not in dist or new_cost < dist[nxt]:
                dist[nxt] = new_cost
                heapq.heappush(pq, (new_cost, nxt))

    return dist`,
      cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& graph, int source) {
    vector<int> dist(graph.size(), INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;

    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        auto [cost, node] = pq.top();
        pq.pop();

        if (cost > dist[node]) continue;

        for (auto [next, weight] : graph[node]) {
            if (cost + weight < dist[next]) {
                dist[next] = cost + weight;
                pq.push({dist[next], next});
            }
        }
    }

    return dist;
}`,
    },
    problem: {
      title: "Shortest Paths with Dijkstra's Algorithm",
      statement:
        'Given a weighted graph with non-negative edge weights and a source node, compute the shortest distance from the source to every other node.',
      constraints: ['All edge weights are non-negative', 'Need efficient frontier selection', 'Relax edges correctly', 'Priority queue usage is recommended'],
      examples: [
        'Source distance starts at 0 and all others begin at infinity',
        'When a shorter path is found, update distance and push to the queue',
      ],
      hints: ['Why does non-negative weight matter here?', 'When can a popped node be considered settled?'],
    },
    Component: DijkstraVisualizer,
  },
  {
    id: 'bellmanford',
    label: 'Bellman-Ford',
    phase: 'P4',
    color: '#f5a623',
    summary: 'Edge relaxation across rounds with negative-cycle awareness.',
    difficulty: 'Advanced',
    outcome: 'Inspect repeated relaxation passes and detect impossible states.',
    prerequisite: 'Weighted graphs and edge relaxation basics.',
    pattern: 'Repeated relaxation, negative cycle detection, distance updates.',
    examplePrompt: 'Compute shortest paths even when negative edges exist.',
    coachTip: 'Think in rounds over edges, not in expanding frontiers like Dijkstra.',
    starterPlan: ['Initialize all distances', 'Relax every edge for V-1 rounds', 'Run one extra detection pass', 'Trace parent updates carefully'],
    editorTemplates: {
      javascript: `function bellmanFord(n, edges, source) {
  const dist = Array(n).fill(Infinity);
  dist[source] = 0;

  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  return dist;
}`,
      python: `def bellman_ford(n, edges, source):
    dist = [float("inf")] * n
    dist[source] = 0

    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w

    return dist`,
      cpp: `vector<int> bellmanFord(int n, vector<tuple<int,int,int>>& edges, int source) {
    vector<int> dist(n, INT_MAX);
    dist[source] = 0;

    for (int i = 0; i < n - 1; i++) {
        for (auto [u, v, w] : edges) {
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    return dist;
}`,
    },
    problem: {
      title: 'Shortest Paths with Bellman-Ford',
      statement:
        'Given a weighted directed graph that may contain negative edges, compute shortest paths from a source and detect whether a negative cycle is reachable.',
      constraints: ['Negative edges are allowed', 'Need V - 1 full relaxation rounds', 'One extra pass detects a negative cycle', 'Time complexity is O(VE)'],
      examples: [
        'If any distance still decreases after V - 1 rounds, a negative cycle is reachable',
        'Distances should be updated only when a shorter path is found',
      ],
      hints: ['Why are exactly V - 1 passes enough without negative cycles?', 'What does one more successful relaxation prove?'],
    },
    Component: BellmanFordVisualizer,
  },
];

const phaseGroups = [
  { phase: 'P1', label: 'Linear DS', color: '#00d4aa' },
  { phase: 'P2', label: 'Trees & ADT', color: '#4a9eff' },
  { phase: 'P3', label: 'Sorting & Search', color: '#8b7cf8' },
  { phase: 'P4', label: 'Graphs & Sorting', color: '#f5a623' },
];

const workspaceTabs = ['overview', 'problem', 'editor', 'visualize'];
const languages = ['javascript', 'python', 'cpp'];

export default function SimulatorPage() {
  const { hash } = useLocation();
  const [activeId, setActiveId] = useState('array');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [editorNotice, setEditorNotice] = useState(null);
  const [splitRatio, setSplitRatio] = useState(34);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [sessionState, setSessionState] = useState({
    visitedProblem: false,
    openedEditor: false,
    viewedVisualizer: false,
    sourceAction: 'Started from overview',
  });

  const splitContainerRef = useRef(null);

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) || sections[0],
    [activeId]
  );

  const ActiveComponent = activeSection.Component;
  const editorCode =
    activeSection.editorTemplates?.[editorLanguage] ||
    '// Code template unavailable for this topic yet.';

  const clampSplit = (value) => Math.max(24, Math.min(52, value));

  useEffect(() => {
    const hashId = decodeURIComponent((hash || '').replace(/^#/, ''));
    if (!hashId || hashId === activeId) return;
    if (!sections.some((section) => section.id === hashId)) return;

    setActiveId(hashId);
    setActiveTab('overview');
    setSidebarOpen(false);
    setSplitRatio(34);
    setEditorNotice(null);
    setSessionState({
      visitedProblem: false,
      openedEditor: false,
      viewedVisualizer: false,
      sourceAction: 'Opened from deep link',
    });
  }, [activeId, hash]);

  const updateSplitFromClientX = (clientX) => {
    const el = splitContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setSplitRatio(clampSplit(percent));
  };

  const startSplitDrag = () => {
    setIsDraggingSplit(true);
  };

  const stopSplitDrag = () => {
    setIsDraggingSplit(false);
  };

  const handleSplitKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setSplitRatio((prev) => clampSplit(prev - 2));
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setSplitRatio((prev) => clampSplit(prev + 2));
    }
    if (event.key === 'Home') {
      event.preventDefault();
      setSplitRatio(24);
    }
    if (event.key === 'End') {
      event.preventDefault();
      setSplitRatio(52);
    }
  };

  const openTab = (tab, reason) => {
    setActiveTab(tab);
    if (tab !== 'editor') setEditorNotice(null);
    setSessionState((prev) => ({
      ...prev,
      visitedProblem: prev.visitedProblem || tab === 'problem',
      openedEditor: prev.openedEditor || tab === 'editor',
      viewedVisualizer: prev.viewedVisualizer || tab === 'visualize',
      sourceAction: reason || prev.sourceAction,
    }));
  };

  const resetFlowForTopic = (id) => {
    setActiveId(id);
    setActiveTab('overview');
    setSidebarOpen(false);
    setEditorNotice(null);
    setSplitRatio(34);
    setSessionState({
      visitedProblem: false,
      openedEditor: false,
      viewedVisualizer: false,
      sourceAction: 'Started from overview',
    });
  };

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="simulator-overview-stack">
          <div className="simulator-panel-grid">
            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Learning outcome</p>
              <h3 className="simulator-info-card__title">{activeSection.label}</h3>
              <p className="simulator-info-card__body">{activeSection.outcome}</p>
            </article>

            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Difficulty</p>
              <h3 className="simulator-info-card__title">{activeSection.difficulty}</h3>
              <p className="simulator-info-card__body">
                Start here to build intuition before moving into timed problem solving.
              </p>
            </article>
          </div>

          <div className="simulator-panel-grid simulator-panel-grid--meta">
            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Prerequisite</p>
              <p className="simulator-info-card__body">{activeSection.prerequisite}</p>
            </article>

            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Common pattern</p>
              <p className="simulator-info-card__body">{activeSection.pattern}</p>
            </article>

            <article className="simulator-info-card simulator-info-card--wide">
              <p className="simulator-info-card__label">Example prompt</p>
              <p className="simulator-info-card__body">{activeSection.examplePrompt}</p>
            </article>
          </div>

          <article className="simulator-info-card">
            <p className="simulator-info-card__label">How to use this module</p>
            <p className="simulator-info-card__body">
              First inspect the state changes, then step through operations slowly, and only after that
              move into code-writing mode. This keeps the visual model and the implementation model aligned.
            </p>

            <div className="simulator-inline-actions">
              <button
                type="button"
                className="simulator-journey-btn simulator-journey-btn--ghost"
                onClick={() => openTab('problem', 'Jumped from overview to problem')}
              >
                Read problem
              </button>
              <button
                type="button"
                className="simulator-journey-btn simulator-journey-btn--primary"
                style={{ background: activeSection.color, borderColor: activeSection.color }}
                onClick={() => openTab('editor', 'Started coding from overview')}
              >
                Start coding
              </button>
            </div>
          </article>
        </div>
      );
    }

    if (activeTab === 'problem') {
      return (
        <div className="simulator-problem-layout">
          <article className="simulator-problem-hero">
            <p className="simulator-info-card__label">Practice problem</p>
            <h3 className="simulator-problem-hero__title">{activeSection.problem.title}</h3>
            <p className="simulator-problem-hero__body">{activeSection.problem.statement}</p>

            <div className="simulator-inline-actions">
              <button
                type="button"
                className="simulator-journey-btn simulator-journey-btn--ghost"
                onClick={() => openTab('overview', 'Returned from problem to overview')}
              >
                Back to concept
              </button>
              <button
                type="button"
                className="simulator-journey-btn simulator-journey-btn--primary"
                style={{ background: activeSection.color, borderColor: activeSection.color }}
                onClick={() => openTab('editor', 'Moved from problem to editor')}
              >
                Solve in editor
              </button>
            </div>
          </article>

          <div className="simulator-panel-grid simulator-panel-grid--problem">
            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Constraints</p>
              <ul className="simulator-bullet-list">
                {activeSection.problem.constraints.map((item) => (
                  <li key={item} className="simulator-bullet-list__item">
                    <span className="simulator-bullet-list__dot" style={{ background: activeSection.color }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Hints</p>
              <ul className="simulator-bullet-list">
                {activeSection.problem.hints.map((item) => (
                  <li key={item} className="simulator-bullet-list__item">
                    <span className="simulator-bullet-list__dot" style={{ background: activeSection.color }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="simulator-info-card simulator-info-card--wide">
              <p className="simulator-info-card__label">Examples</p>
              <div className="simulator-example-stack">
                {activeSection.problem.examples.map((example) => (
                  <div key={example} className="simulator-example-card">
                    {example}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      );
    }

    if (activeTab === 'editor') {
      return (
        <div className="simulator-editor-layout">
          <div className="simulator-editor-shell">
            <div className="simulator-editor-toolbar">
              <div className="simulator-editor-toolbar__left">
                <p className="simulator-info-card__label">Editor</p>
                <div className="simulator-language-switcher">
                  {languages.map((lang) => {
                    const isActive = lang === editorLanguage;
                    const label =
                      lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'C++';

                    return (
                      <button
                        key={lang}
                        type="button"
                        className={`simulator-language-pill ${isActive ? 'is-active' : ''}`}
                        onClick={() => setEditorLanguage(lang)}
                        style={{
                          borderColor: isActive ? `${activeSection.color}33` : 'var(--border-subtle)',
                          background: isActive ? `${activeSection.color}14` : 'transparent',
                          color: isActive ? activeSection.color : 'var(--text-muted)',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="simulator-editor-actions">
                <button
                  type="button"
                  className="simulator-action-btn simulator-action-btn--ghost"
                  onClick={() => {
                    setEditorLanguage('javascript');
                    setEditorNotice({
                      title: 'Template reset',
                      body: `Restored the JavaScript starter for ${activeSection.label}.`,
                    });
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="simulator-action-btn simulator-action-btn--ghost"
                  onClick={() => {
                    setEditorNotice({
                      title: 'Why this works',
                      body: `${activeSection.coachTip} Start with: ${activeSection.starterPlan.join(' -> ')}.`,
                    });
                  }}
                >
                  Explain
                </button>
                <button
                  type="button"
                  className="simulator-action-btn simulator-action-btn--primary"
                  style={{
                    background: activeSection.color,
                    borderColor: activeSection.color,
                  }}
                  onClick={() => openTab('visualize', 'Opened visualizer from editor')}
                >
                  Open in visualize
                </button>
              </div>
            </div>

            {editorNotice && (
              <div
                className="simulator-editor-notice"
                aria-live="polite"
                style={{ borderColor: `${activeSection.color}35` }}
              >
                <b style={{ color: activeSection.color }}>{editorNotice.title}</b>
                <span>{editorNotice.body}</span>
              </div>
            )}

            <div className="simulator-editor-window">
              <div className="simulator-editor-window__gutter">
                {editorCode.split('\n').map((_, idx) => (
                  <span key={idx + 1}>{idx + 1}</span>
                ))}
              </div>
              <pre className="simulator-editor-window__code">{editorCode}</pre>
            </div>

            <div className="simulator-editor-footer">
              <div className="simulator-editor-footer__meta">
                <span className="simulator-editor-footer__pill">{editorLanguage}</span>
                <span className="simulator-editor-footer__text">
                  Topic: {activeSection.label}
                </span>
                <span className="simulator-editor-footer__text">
                  Goal: {activeSection.problem.title}
                </span>
              </div>

              <button
                type="button"
                className="simulator-journey-btn simulator-journey-btn--ghost"
                onClick={() => openTab('problem', 'Returned from editor to problem')}
              >
                Re-read problem
              </button>
            </div>
          </div>

          <aside className="simulator-editor-sidepanel">
            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Current goal</p>
              <h3 className="simulator-info-card__title">{activeSection.problem.title}</h3>
              <p className="simulator-info-card__body">{activeSection.coachTip}</p>
            </article>

            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Expected approach</p>
              <ul className="simulator-bullet-list">
                {activeSection.starterPlan.map((item) => (
                  <li key={item} className="simulator-bullet-list__item">
                    <span className="simulator-bullet-list__dot" style={{ background: activeSection.color }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="simulator-info-card">
              <p className="simulator-info-card__label">Mock output</p>
              <div className="simulator-console">
                <div className="simulator-console__line">
                  <span className="simulator-console__prompt">&gt;</span>
                  <span>Prepared {activeSection.label} starter in {editorLanguage}</span>
                </div>
                <div className="simulator-console__line">
                  <span className="simulator-console__prompt">&gt;</span>
                  <span>Use Open in visualize to inspect the same topic interactively</span>
                </div>
                <div className="simulator-console__line simulator-console__line--muted">
                  <span className="simulator-console__prompt">&gt;</span>
                  <span>Shared session keeps your current topic and language in view</span>
                </div>
              </div>
            </article>
          </aside>
        </div>
      );
    }

    return (
      <div
        ref={splitContainerRef}
        className={`simulator-split-workspace ${isDraggingSplit ? 'is-dragging' : ''}`}
        onMouseMove={(event) => {
          if (isDraggingSplit) {
            updateSplitFromClientX(event.clientX);
          }
        }}
        onMouseUp={stopSplitDrag}
        onMouseLeave={stopSplitDrag}
      >
        <aside className="simulator-practice-panel" style={{ width: `${splitRatio}%` }}>
          <div className="simulator-practice-panel__block">
            <p className="simulator-info-card__label">Practice focus</p>
            <h3 className="simulator-practice-panel__title">{activeSection.examplePrompt}</h3>
            <p className="simulator-practice-panel__body">
              Use the visualizer on the right while thinking through the prompt on the left. This is the bridge
              between concept learning and actual interview-style problem solving.
            </p>
          </div>

          <div className="simulator-practice-panel__block">
            <p className="simulator-info-card__label">Coach tip</p>
            <p className="simulator-practice-panel__body">{activeSection.coachTip}</p>
          </div>

          <div className="simulator-practice-panel__block">
            <p className="simulator-info-card__label">Starter plan</p>
            <ul className="simulator-checklist">
              {activeSection.starterPlan.map((step) => (
                <li key={step} className="simulator-checklist__item">
                  <span className="simulator-checklist__dot" style={{ background: activeSection.color }} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="simulator-practice-panel__block">
            <p className="simulator-info-card__label">Session context</p>
            <div className="simulator-session-mini">
              <span className="simulator-session-mini__pill">{editorLanguage}</span>
              <span className="simulator-session-mini__text">{activeSection.problem.title}</span>
            </div>
            <button
              type="button"
              className="simulator-journey-btn simulator-journey-btn--ghost"
              onClick={() => openTab('editor', 'Returned from visualizer to editor')}
            >
              Back to editor
            </button>
          </div>
        </aside>

        <div
          className="simulator-splitter"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize practice and visualizer panels"
          aria-valuemin={24}
          aria-valuemax={52}
          aria-valuenow={Math.round(splitRatio)}
          tabIndex={0}
          onMouseDown={startSplitDrag}
          onKeyDown={handleSplitKeyDown}
        >
          <span className="simulator-splitter__grip" />
        </div>

        <div className="simulator-visual-card simulator-visual-card--split">
          <div className="simulator-visual-card__head">
            <div>
              <p className="simulator-info-card__label">Visualizer</p>
              <h3 className="simulator-visual-card__title">{activeSection.label} state view</h3>
            </div>
            <span
              className="simulator-visual-card__badge"
              style={{
                background: `${activeSection.color}14`,
                borderColor: `${activeSection.color}33`,
                color: activeSection.color,
              }}
            >
              Live module
            </span>
          </div>

          <div className="simulator-visual-context">
            <div className="simulator-visual-context__block">
              <span className="simulator-visual-context__label">Tracking</span>
              <span className="simulator-visual-context__value">{activeSection.problem.title}</span>
            </div>
            <div className="simulator-visual-context__block">
              <span className="simulator-visual-context__label">Language</span>
              <span className="simulator-visual-context__value">{editorLanguage}</span>
            </div>
            <div className="simulator-visual-context__block">
              <span className="simulator-visual-context__label">Flow</span>
              <span className="simulator-visual-context__value">{sessionState.sourceAction}</span>
            </div>
          </div>

          <div className="simulator-visualize-pane">
            <ActiveComponent />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="simulator-shell">
      <button
        type="button"
        className="simulator-mobile-toggle"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? 'Close simulator navigation' : 'Open simulator navigation'}
      >
        <span className="simulator-mobile-toggle__line" />
        <span className="simulator-mobile-toggle__line" />
        <span className="simulator-mobile-toggle__line" />
        <span className="simulator-mobile-toggle__text">
          {sidebarOpen ? 'Close topics' : 'Browse topics'}
        </span>
      </button>

      <aside className={`simulator-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="simulator-sidebar__intro">
          <p className="simulator-sidebar__eyebrow">AlgoVista</p>
          <h2 className="simulator-sidebar__title">Simulator Workspace</h2>
          <p className="simulator-sidebar__copy">
            Pick one topic and focus on a single interactive module at a time.
          </p>
        </div>

        {phaseGroups.map((group) => {
          const items = sections.filter((section) => section.phase === group.phase);

          return (
            <div key={group.phase} className="simulator-sidebar__group">
              <div className="simulator-sidebar__group-head">
                <span
                  className="simulator-sidebar__group-dot"
                  style={{ background: group.color, boxShadow: `0 0 12px ${group.color}55` }}
                />
                <p className="simulator-sidebar__group-label" style={{ color: group.color }}>
                  {group.label}
                </p>
              </div>

              <div className="simulator-sidebar__items">
                {items.map((item) => {
                  const isActive = item.id === activeId;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => resetFlowForTopic(item.id)}
                      className={`simulator-nav-item ${isActive ? 'is-active' : ''}`}
                      style={{
                        borderColor: isActive ? `${item.color}55` : 'transparent',
                        background: isActive ? `${item.color}14` : 'transparent',
                      }}
                    >
                      <div className="simulator-nav-item__row">
                        <div className="simulator-nav-item__left">
                          <span
                            className="simulator-nav-item__accent"
                            style={{ background: item.color }}
                          />
                          <span
                            className="simulator-nav-item__label"
                            style={{
                              fontWeight: isActive ? 800 : 600,
                              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                            }}
                          >
                            {item.label}
                          </span>
                        </div>

                        {isActive && (
                          <span
                            className="simulator-nav-item__active-dot"
                            style={{ background: item.color }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </aside>

      <main className="simulator-main">
        <section className="simulator-hero">
          <div className="simulator-hero__chips">
            <span
              className="simulator-chip"
              style={{
                background: `${activeSection.color}14`,
                borderColor: `${activeSection.color}33`,
                color: activeSection.color,
              }}
            >
              {activeSection.phase}
            </span>

            <span
              className="simulator-hero__pulse"
              style={{
                background: activeSection.color,
                boxShadow: `0 0 12px ${activeSection.color}88`,
              }}
            />
            <span className="simulator-hero__meta">Interactive DSA workspace</span>
          </div>

          <div className="simulator-hero__content">
            <div className="simulator-hero__text">
              <h1 className="simulator-hero__title">{activeSection.label}</h1>
              <p className="simulator-hero__summary">{activeSection.summary}</p>
            </div>

            <div className="simulator-hero__stats">
              <div className="simulator-stat-card">
                <p className="simulator-stat-card__label">Mode</p>
                <p className="simulator-stat-card__value">
                  {activeTab === 'visualize'
                    ? 'Practice + Visualize'
                    : activeTab === 'problem'
                    ? 'Problem Solving'
                    : activeTab === 'editor'
                    ? 'Code Workspace'
                    : 'Learn'}
                </p>
              </div>
              <div className="simulator-stat-card">
                <p className="simulator-stat-card__label">Difficulty</p>
                <p className="simulator-stat-card__value">{activeSection.difficulty}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="simulator-session-bar">
          <div className="simulator-session-bar__left">
            <p className="simulator-session-bar__eyebrow">Current practice session</p>
            <div className="simulator-session-bar__row">
              <span className="simulator-session-bar__pill" style={{ color: activeSection.color, borderColor: `${activeSection.color}44` }}>
                {activeSection.label}
              </span>
              <span className="simulator-session-bar__meta">{activeSection.problem.title}</span>
              <span className="simulator-session-bar__meta">Language: {editorLanguage}</span>
            </div>
          </div>

          <div className="simulator-session-bar__progress">
            <span className={`simulator-flow-dot ${sessionState.visitedProblem ? 'is-done' : ''}`}>Problem</span>
            <span className={`simulator-flow-dot ${sessionState.openedEditor ? 'is-done' : ''}`}>Editor</span>
            <span className={`simulator-flow-dot ${sessionState.viewedVisualizer ? 'is-done' : ''}`}>Visualize</span>
          </div>
        </section>

        <section className="simulator-stage">
          <div className="simulator-stage__toolbar">
            <div>
              <p className="simulator-stage__eyebrow">Active workspace</p>
              <h2 className="simulator-stage__title">{activeSection.label}</h2>
            </div>

            <div className="simulator-stage__tabs" role="tablist" aria-label="Simulator workspace tabs">
              {workspaceTabs.map((tab) => {
                const isActive = tab === activeTab;
                const label = tab.charAt(0).toUpperCase() + tab.slice(1);

                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`simulator-tab ${isActive ? 'is-active' : ''}`}
                    onClick={() => openTab(tab, `Switched tab to ${label}`)}
                    style={{
                      borderColor: isActive ? `${activeSection.color}33` : 'var(--border-subtle)',
                      background: isActive ? `${activeSection.color}14` : 'var(--bg-panel)',
                      color: isActive ? activeSection.color : 'var(--text-muted)',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="simulator-stage__body">{renderTabContent()}</div>
        </section>
      </main>
    </div>
  );
}
