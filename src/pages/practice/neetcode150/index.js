import ARRAYS_HASHING_PROBLEMS from './problems/arrays-hashing';
import TWO_POINTERS_PROBLEMS from './problems/two-pointers';
import SLIDING_WINDOW_PROBLEMS from './problems/sliding-window';
import STACK_PROBLEMS from './problems/stack';
import BINARY_SEARCH_PROBLEMS from './problems/binary-search';
import LINKED_LIST_PROBLEMS from './problems/linked-list';
import TREES_PROBLEMS from './problems/trees';
import TRIES_PROBLEMS from './problems/tries';
import HEAP_PRIORITY_QUEUE_PROBLEMS from './problems/heap-priority-queue';
import BACKTRACKING_PROBLEMS from './problems/backtracking';
import GRAPHS_PROBLEMS from './problems/graphs';
import DYNAMIC_PROGRAMMING_PROBLEMS from './problems/dynamic-programming';
import TWO_D_DYNAMIC_PROGRAMMING_PROBLEMS from './problems/2d-dynamic-programming';
import GREEDY_PROBLEMS from './problems/greedy';
import INTERVALS_PROBLEMS from './problems/intervals';
import MATH_AND_GEOMETRY_PROBLEMS from './problems/math-and-geometry';
import BIT_MANIPULATION_PROBLEMS from './problems/bit-manipulation';

export const NEETCODE_TOPIC_ORDER = [
  'arrays-hashing',
  'two-pointers',
  'sliding-window',
  'stack',
  'binary-search',
  'linked-list',
  'trees',
  'tries',
  'heap-priority-queue',
  'backtracking',
  'graphs',
  'dynamic-programming',
  '2d-dynamic-programming',
  'greedy',
  'intervals',
  'math-and-geometry',
  'bit-manipulation',
];

export const NEETCODE_TOPIC_META = {
  'arrays-hashing': {
    id: 'arrays-hashing',
    label: 'Arrays & Hashing',
    color: '#00d4aa',
    icon: '▦',
    phase: 'P1',
  },
  'two-pointers': {
    id: 'two-pointers',
    label: 'Two Pointers',
    color: '#00d4aa',
    icon: '↔',
    phase: 'P1',
  },
  'sliding-window': {
    id: 'sliding-window',
    label: 'Sliding Window',
    color: '#00d4aa',
    icon: '▤',
    phase: 'P1',
  },
  stack: {
    id: 'stack',
    label: 'Stack',
    color: '#00d4aa',
    icon: '▥',
    phase: 'P1',
  },
  'binary-search': {
    id: 'binary-search',
    label: 'Binary Search',
    color: '#8b7cf8',
    icon: '⌖',
    phase: 'P2',
  },
  'linked-list': {
    id: 'linked-list',
    label: 'Linked List',
    color: '#8b7cf8',
    icon: '→',
    phase: 'P2',
  },
  trees: {
    id: 'trees',
    label: 'Trees',
    color: '#4a9eff',
    icon: '△',
    phase: 'P2',
  },
  tries: {
    id: 'tries',
    label: 'Tries',
    color: '#4a9eff',
    icon: 'T',
    phase: 'P2',
  },
  'heap-priority-queue': {
    id: 'heap-priority-queue',
    label: 'Heap / Priority Queue',
    color: '#4a9eff',
    icon: '◎',
    phase: 'P2',
  },
  backtracking: {
    id: 'backtracking',
    label: 'Backtracking',
    color: '#ff6b6b',
    icon: '◇',
    phase: 'P3',
  },
  graphs: {
    id: 'graphs',
    label: 'Graphs',
    color: '#ff6b6b',
    icon: '⬡',
    phase: 'P3',
  },
  'dynamic-programming': {
    id: 'dynamic-programming',
    label: '1-D Dynamic Programming',
    color: '#f5a623',
    icon: '▣',
    phase: 'P4',
  },
  '2d-dynamic-programming': {
    id: '2d-dynamic-programming',
    label: '2-D Dynamic Programming',
    color: '#f5a623',
    icon: '▦',
    phase: 'P4',
  },
  greedy: {
    id: 'greedy',
    label: 'Greedy',
    color: '#f5a623',
    icon: '◆',
    phase: 'P4',
  },
  intervals: {
    id: 'intervals',
    label: 'Intervals',
    color: '#00d4aa',
    icon: '═',
    phase: 'P5',
  },
  'math-and-geometry': {
    id: 'math-and-geometry',
    label: 'Math & Geometry',
    color: '#8b7cf8',
    icon: 'π',
    phase: 'P5',
  },
  'bit-manipulation': {
    id: 'bit-manipulation',
    label: 'Bit Manipulation',
    color: '#4a9eff',
    icon: '01',
    phase: 'P5',
  },
};

export const NEETCODE_TOPIC_PROBLEMS = {
  'arrays-hashing': ARRAYS_HASHING_PROBLEMS,
  'two-pointers': TWO_POINTERS_PROBLEMS,
  'sliding-window': SLIDING_WINDOW_PROBLEMS,
  stack: STACK_PROBLEMS,
  'binary-search': BINARY_SEARCH_PROBLEMS,
  'linked-list': LINKED_LIST_PROBLEMS,
  trees: TREES_PROBLEMS,
  tries: TRIES_PROBLEMS,
  'heap-priority-queue': HEAP_PRIORITY_QUEUE_PROBLEMS,
  backtracking: BACKTRACKING_PROBLEMS,
  graphs: GRAPHS_PROBLEMS,
  'dynamic-programming': DYNAMIC_PROGRAMMING_PROBLEMS,
  '2d-dynamic-programming': TWO_D_DYNAMIC_PROGRAMMING_PROBLEMS,
  greedy: GREEDY_PROBLEMS,
  intervals: INTERVALS_PROBLEMS,
  'math-and-geometry': MATH_AND_GEOMETRY_PROBLEMS,
  'bit-manipulation': BIT_MANIPULATION_PROBLEMS,
};

export const NEETCODE_TOPICS = NEETCODE_TOPIC_ORDER.map((id) => ({
  ...NEETCODE_TOPIC_META[id],
  problems: NEETCODE_TOPIC_PROBLEMS[id] || [],
}));

export const NEETCODE150 = [
  ...NEETCODE_TOPICS.flatMap((topic) => topic.problems),
];

export function isNeetcode150(problemId) {
  return NEETCODE150.some((p) => p.id === problemId);
}

export function getNeetcode150Problems() {
  return NEETCODE150;
}
