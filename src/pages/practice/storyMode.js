const ARCHETYPES = {
  'arrays-hashing': {
    name: 'Index Relay',
    place: 'a signal board where every value needs a fast lookup',
    lens: 'turn repeated scanning into instant memory',
    invariant: 'every stored key answers one future question in constant time',
  },
  'two-pointers': {
    name: 'Dual Sweep',
    place: 'a corridor with two markers moving from useful edges',
    lens: 'make progress from both sides without revisiting work',
    invariant: 'each pointer move discards a region that cannot improve the answer',
  },
  'sliding-window': {
    name: 'Moving Lens',
    place: 'a scanner that expands and shrinks over a live stream',
    lens: 'maintain exactly the window that matters right now',
    invariant: 'the current window always satisfies the rule you are tracking',
  },
  stack: {
    name: 'Last-In Control Tower',
    place: 'a control tower where the newest unresolved item is handled first',
    lens: 'store unfinished decisions until a closing event resolves them',
    invariant: 'the stack top is always the next thing that must match or resolve',
  },
  'binary-search': {
    name: 'Signal Split',
    place: 'a sorted search field where half the map can be dismissed each move',
    lens: 'ask one comparison that removes a full half of the search space',
    invariant: 'the answer, if it exists, stays inside the active boundary',
  },
  'linked-list': {
    name: 'Pointer Chain',
    place: 'a chain of stations where the only road forward is through links',
    lens: 'move references carefully so no node is lost',
    invariant: 'every pointer update preserves the remaining reachable chain',
  },
  trees: {
    name: 'Decision Tree',
    place: 'a branching command map where each node owns a smaller subproblem',
    lens: 'let each subtree solve the same question locally',
    invariant: 'the value returned by a node correctly summarizes its whole subtree',
  },
  tries: {
    name: 'Prefix Vault',
    place: 'a word vault where each letter opens the next chamber',
    lens: 'share common prefixes instead of storing whole words repeatedly',
    invariant: 'the path from root to node spells the prefix currently matched',
  },
  'heap-priority-queue': {
    name: 'Priority Lift',
    place: 'a priority platform where the most urgent item rises to the top',
    lens: 'only the next best candidate must be instantly available',
    invariant: 'the root always holds the highest-priority item for the operation',
  },
  backtracking: {
    name: 'Choice Labyrinth',
    place: 'a decision lab where every path is tried and then cleanly undone',
    lens: 'build one candidate, explore it, then restore state before the next branch',
    invariant: 'the current path represents exactly the choices made so far',
  },
  graphs: {
    name: 'Route Network',
    place: 'a map of connected stations where reachability is the core question',
    lens: 'move through neighbors while remembering what has already been visited',
    invariant: 'visited nodes are never processed as new work again',
  },
  'dynamic-programming': {
    name: 'Memory Ledger',
    place: 'a planning desk where solved subproblems are saved as reusable facts',
    lens: 'replace repeated thinking with remembered answers',
    invariant: 'each DP state stores the best answer for its exact subproblem',
  },
  '2d-dynamic-programming': {
    name: 'State Grid',
    place: 'a grid of decisions where each cell depends on smaller neighbors',
    lens: 'fill the table so every future cell can trust previous answers',
    invariant: 'each cell is final before another state depends on it',
  },
  greedy: {
    name: 'Local Choice Engine',
    place: 'a decision line where each move must preserve future possibility',
    lens: 'choose the best immediate move only when it cannot hurt the final goal',
    invariant: 'after each choice, an optimal answer is still reachable',
  },
  intervals: {
    name: 'Timeline Control',
    place: 'a timeline where overlapping ranges must be merged, compared, or placed',
    lens: 'sort boundaries so conflicts become visible',
    invariant: 'processed intervals are already in their final relationship',
  },
  'math-and-geometry': {
    name: 'Geometry Console',
    place: 'a precision console where formulas become executable rules',
    lens: 'turn the shape of the problem into arithmetic state changes',
    invariant: 'each calculation preserves the mathematical definition',
  },
  'bit-manipulation': {
    name: 'Switchboard',
    place: 'a binary switchboard where every bit carries a compact signal',
    lens: 'use bit operations to store or reveal information directly',
    invariant: 'each bit position keeps its independent meaning',
  },
};

const DEFAULT_ARCHETYPE = {
  name: 'Algorithm Studio',
  place: 'a focused workspace where state changes reveal the solution',
  lens: 'turn the problem into a repeatable sequence of decisions',
  invariant: 'each step keeps the solution state truthful',
};

const DIFFICULTY_PACE = {
  Easy: 'Warm-up mission',
  Medium: 'Core interview mission',
  Hard: 'Boss-level mission',
};

function firstSentence(text = '') {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : trimmed).trim();
}

function exampleLine(problem) {
  const example = problem.examples?.[0];
  if (!example) return 'Start from the smallest input you can explain by hand.';
  return `${example.input} -> ${example.output}`;
}

function createCheckpoints(problem, archetype) {
  const hints = problem.hints || [];
  return [
    `What state must be remembered so ${archetype.lens}?`,
    hints[0] || `Which input feature tells you the next move?`,
    hints[1] || `When can you safely skip work without changing the answer?`,
  ];
}

function createPitfalls(problem) {
  const concept = problem.concept || '';
  const common = [
    'Do not start coding until you can describe the state after one example step.',
    'Watch edge cases: empty input, one item, duplicates, and boundary indexes.',
  ];

  if (concept.includes('dynamic-programming')) {
    return ['Define the DP state before the recurrence.', 'Verify base cases before filling transitions.', ...common.slice(1)];
  }
  if (concept === 'graphs') {
    return ['Mark visited at the right time to avoid repeated work.', 'Confirm whether edges are directed, weighted, or grid-adjacent.', ...common.slice(1)];
  }
  if (concept === 'backtracking') {
    return ['Undo every choice before trying the next branch.', 'Stop recursion exactly when a complete candidate is built.', ...common.slice(1)];
  }
  if (concept === 'linked-list') {
    return ['Save next pointers before rewiring links.', 'Use a dummy node when head changes are possible.', ...common.slice(1)];
  }
  if (concept === 'binary-search') {
    return ['Keep the search boundary invariant clear.', 'Update left and right so the loop always shrinks.', ...common.slice(1)];
  }
  return common;
}

export function buildStoryMode(problem) {
  const archetype = ARCHETYPES[problem.concept] || DEFAULT_ARCHETYPE;
  const mission = firstSentence(problem.description) || `Solve ${problem.title}.`;
  const pace = DIFFICULTY_PACE[problem.difficulty] || 'Learning mission';

  return {
    title: `${archetype.name}: ${problem.title}`,
    pace,
    setting: archetype.place,
    invariant: archetype.invariant,
    checkpoints: createCheckpoints(problem, archetype),
    pitfalls: createPitfalls(problem),
    scenes: [
      {
        label: 'Scene 1',
        title: 'Mission Brief',
        body: mission,
        focus: `Translate the prompt into inputs, output, and one tiny example: ${exampleLine(problem)}`,
      },
      {
        label: 'Scene 2',
        title: 'Mental Model',
        body: `Imagine ${archetype.place}. Your job is to ${archetype.lens}.`,
        focus: `Core invariant: ${archetype.invariant}.`,
      },
      {
        label: 'Scene 3',
        title: 'Plan of Attack',
        body: problem.pattern_explanation || `Use the ${problem.pattern} pattern to move from brute force toward a cleaner solution.`,
        focus: `Time: ${problem.timeO || 'analyze from loops'} | Space: ${problem.spaceO || 'track stored state'}`,
      },
      {
        label: 'Scene 4',
        title: 'Trace the First Move',
        body: problem.hints?.[0] || 'Run the first example by hand and write down every state variable after each operation.',
        focus: problem.hints?.[1] || 'Name the exact moment when the algorithm makes progress.',
      },
      {
        label: 'Scene 5',
        title: 'Lock the Insight',
        body: problem.hints?.[2] || 'Now code the smallest correct version, then test edge cases before optimizing style.',
        focus: 'A solution is ready when every state update can be explained in one sentence.',
      },
    ],
  };
}
