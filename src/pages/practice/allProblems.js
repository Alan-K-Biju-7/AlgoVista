import { arrayProblems }    from './problems_array';
import { stackProblems }    from './problems_stack';
import { linkedlistProblems } from './problems_linkedlist';
import { bsearchProblems }  from './problems_bsearch';
import { bstProblems, heapProblems, graphProblems, sortingProblems } from './problems_trees';

export const ALL_PROBLEMS = {
  array:       { label: 'Arrays & Hashing',     color: '#00d4aa', icon: '▦', phase: 'P1', problems: arrayProblems },
  stack:       { label: 'Stack',                color: '#00d4aa', icon: '⬆', phase: 'P1', problems: stackProblems },
  linkedlist:  { label: 'Linked List',          color: '#00d4aa', icon: '⟶', phase: 'P1', problems: linkedlistProblems },
  bsearch:     { label: 'Binary Search',        color: '#8b7cf8', icon: '⌖', phase: 'P3', problems: bsearchProblems },
  bst:         { label: 'Binary Tree / BST',    color: '#4a9eff', icon: '△', phase: 'P2', problems: bstProblems },
  heap:        { label: 'Heap',                 color: '#4a9eff', icon: '◎', phase: 'P2', problems: heapProblems },
  graph:       { label: 'Graphs',               color: '#4a9eff', icon: '⬡', phase: 'P2', problems: graphProblems },
  bubble:      { label: 'Sorting',              color: '#8b7cf8', icon: '↕', phase: 'P3', problems: sortingProblems },
};
