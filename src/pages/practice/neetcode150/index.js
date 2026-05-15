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

export const NEETCODE_TOPICS = [
  {
    id: 'nc-arrays-hashing',
    label: 'Arrays & Hashing',
    icon: '#',
    color: '#00d4aa',
    phase: 'NC1',
    problems: ARRAYS_HASHING_PROBLEMS,
  },
  {
    id: 'nc-two-pointers',
    label: 'Two Pointers',
    icon: '<>',
    color: '#00d4aa',
    phase: 'NC1',
    problems: TWO_POINTERS_PROBLEMS,
  },
  {
    id: 'nc-sliding-window',
    label: 'Sliding Window',
    icon: '[]',
    color: '#00d4aa',
    phase: 'NC1',
    problems: SLIDING_WINDOW_PROBLEMS,
  },
  {
    id: 'nc-stack',
    label: 'Stack',
    icon: '^',
    color: '#00d4aa',
    phase: 'NC1',
    problems: STACK_PROBLEMS,
  },
  {
    id: 'nc-binary-search',
    label: 'Binary Search',
    icon: 'BS',
    color: '#8b7cf8',
    phase: 'NC2',
    problems: BINARY_SEARCH_PROBLEMS,
  },
  {
    id: 'nc-linked-list',
    label: 'Linked List',
    icon: '->',
    color: '#00d4aa',
    phase: 'NC2',
    problems: LINKED_LIST_PROBLEMS,
  },
  {
    id: 'nc-trees',
    label: 'Trees',
    icon: 'T',
    color: '#4a9eff',
    phase: 'NC2',
    problems: TREES_PROBLEMS,
  },
  {
    id: 'nc-tries',
    label: 'Tries',
    icon: 'Tr',
    color: '#4a9eff',
    phase: 'NC2',
    problems: TRIES_PROBLEMS,
  },
  {
    id: 'nc-heap',
    label: 'Heap / Priority Queue',
    icon: 'PQ',
    color: '#4a9eff',
    phase: 'NC2',
    problems: HEAP_PRIORITY_QUEUE_PROBLEMS,
  },
  {
    id: 'nc-backtracking',
    label: 'Backtracking',
    icon: 'BT',
    color: '#f5a623',
    phase: 'NC3',
    problems: BACKTRACKING_PROBLEMS,
  },
  {
    id: 'nc-graphs',
    label: 'Graphs',
    icon: 'G',
    color: '#4a9eff',
    phase: 'NC3',
    problems: GRAPHS_PROBLEMS,
  },
  {
    id: 'nc-dp',
    label: '1-D Dynamic Programming',
    icon: 'DP',
    color: '#8b7cf8',
    phase: 'NC3',
    problems: DYNAMIC_PROGRAMMING_PROBLEMS,
  },
  {
    id: 'nc-2d-dp',
    label: '2-D Dynamic Programming',
    icon: '2D',
    color: '#8b7cf8',
    phase: 'NC3',
    problems: TWO_D_DYNAMIC_PROGRAMMING_PROBLEMS,
  },
  {
    id: 'nc-greedy',
    label: 'Greedy',
    icon: '$',
    color: '#f5a623',
    phase: 'NC4',
    problems: GREEDY_PROBLEMS,
  },
  {
    id: 'nc-intervals',
    label: 'Intervals',
    icon: '--',
    color: '#f5a623',
    phase: 'NC4',
    problems: INTERVALS_PROBLEMS,
  },
  {
    id: 'nc-math',
    label: 'Math & Geometry',
    icon: '+',
    color: '#f5a623',
    phase: 'NC4',
    problems: MATH_AND_GEOMETRY_PROBLEMS,
  },
  {
    id: 'nc-bit-manipulation',
    label: 'Bit Manipulation',
    icon: '01',
    color: '#f5a623',
    phase: 'NC4',
    problems: BIT_MANIPULATION_PROBLEMS,
  },
];

export const NEETCODE150 = NEETCODE_TOPICS.flatMap((topic) => topic.problems);

export function isNeetcode150(problemId) {
  return NEETCODE150.some((p) => p.id === problemId);
}

export function getNeetcode150Problems() {
  return NEETCODE150;
}
