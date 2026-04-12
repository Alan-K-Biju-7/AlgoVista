import { arrayProblems } from './problems_array';
import { stackProblems } from './problems_stack';
import { linkedlistProblems } from './problems_linkedlist';
import { bsearchProblems } from './problems_bsearch';
import {
  bstProblems,
  heapProblems,
  graphProblems,
  sortingProblems,
} from './problems_trees';

export const TOPIC_ORDER = [
  'array',
  'stack',
  'linkedlist',
  'bst',
  'heap',
  'graph',
  'bsearch',
  'bubble',
];

export const PHASE_META = {
  P1: { id: 'P1', label: 'Linear DS', color: '#00d4aa' },
  P2: { id: 'P2', label: 'Trees & Graphs', color: '#4a9eff' },
  P3: { id: 'P3', label: 'Search & Sort', color: '#8b7cf8' },
  P4: { id: 'P4', label: 'Graph Algorithms', color: '#f5a623' },
};

export const ALL_PROBLEMS = {
  array: {
    id: 'array',
    label: 'Arrays & Hashing',
    color: '#00d4aa',
    icon: '▦',
    phase: 'P1',
    problems: arrayProblems,
  },
  stack: {
    id: 'stack',
    label: 'Stack',
    color: '#00d4aa',
    icon: '⬆',
    phase: 'P1',
    problems: stackProblems,
  },
  linkedlist: {
    id: 'linkedlist',
    label: 'Linked List',
    color: '#00d4aa',
    icon: '⟶',
    phase: 'P1',
    problems: linkedlistProblems,
  },
  bst: {
    id: 'bst',
    label: 'Binary Tree / BST',
    color: '#4a9eff',
    icon: '△',
    phase: 'P2',
    problems: bstProblems,
  },
  heap: {
    id: 'heap',
    label: 'Heap',
    color: '#4a9eff',
    icon: '◎',
    phase: 'P2',
    problems: heapProblems,
  },
  graph: {
    id: 'graph',
    label: 'Graphs',
    color: '#4a9eff',
    icon: '⬡',
    phase: 'P2',
    problems: graphProblems,
  },
  bsearch: {
    id: 'bsearch',
    label: 'Binary Search',
    color: '#8b7cf8',
    icon: '⌖',
    phase: 'P3',
    problems: bsearchProblems,
  },
  bubble: {
    id: 'bubble',
    label: 'Sorting',
    color: '#8b7cf8',
    icon: '↕',
    phase: 'P3',
    problems: sortingProblems,
  },
};

export const getTopicList = () =>
  TOPIC_ORDER.map((id) => ALL_PROBLEMS[id]).filter(Boolean);

export const getAllProblemsFlat = () =>
  getTopicList().flatMap((topic) => topic.problems);
