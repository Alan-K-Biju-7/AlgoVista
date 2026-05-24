function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

export function getConceptKind(concept) {
  const title = concept.title.toLowerCase();
  const section = concept.sectionId;

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

const lessonCopy = {
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
  const copy = lessonCopy[kind] || lessonCopy.foundation;
  const title = concept.title;

  return {
    kind,
    headline: `${title} turns into skill when you can predict every step before the code runs.`,
    coreIdea: `${title} belongs to ${concept.sectionTitle}. Learn it by connecting the definition, the moving state, and the reason the algorithm stays correct.`,
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
