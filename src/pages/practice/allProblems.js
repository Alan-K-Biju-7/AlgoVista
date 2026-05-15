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
import { NEETCODE_TOPICS } from './neetcode150';

export const TOPIC_ORDER = [
  ...NEETCODE_TOPICS.map((topic) => topic.id),
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
  NC1: { id: 'NC1', label: 'NeetCode Core', color: '#00d4aa' },
  NC2: { id: 'NC2', label: 'NeetCode Structures', color: '#4a9eff' },
  NC3: { id: 'NC3', label: 'NeetCode Graphs & DP', color: '#8b7cf8' },
  NC4: { id: 'NC4', label: 'NeetCode Advanced', color: '#f5a623' },
  P1: { id: 'P1', label: 'Linear DS', color: '#00d4aa' },
  P2: { id: 'P2', label: 'Trees & Graphs', color: '#4a9eff' },
  P3: { id: 'P3', label: 'Search & Sort', color: '#8b7cf8' },
  P4: { id: 'P4', label: 'Graph Algorithms', color: '#f5a623' },
};

export const ALL_PROBLEMS = {
  ...Object.fromEntries(NEETCODE_TOPICS.map((topic) => [topic.id, topic])),
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


export const getTopicProblemCount = (topicId) =>
  ALL_PROBLEMS[topicId]?.problems?.length || 0;

export const getSolvedCountForTopic = (topicId, getStatus) =>
  (ALL_PROBLEMS[topicId]?.problems || []).filter(
    (problem) => getStatus(problem.id) === 'solved'
  ).length;
