import ARRAYS_HASHING_PROBLEMS from './problems/arrays-hashing';
import TWO_POINTERS_PROBLEMS from './problems/two-pointers';
import SLIDING_WINDOW_PROBLEMS from './problems/sliding-window';

export const NEETCODE150 = [
  ...ARRAYS_HASHING_PROBLEMS,
  ...TWO_POINTERS_PROBLEMS,
  ...SLIDING_WINDOW_PROBLEMS,
];

export function isNeetcode150(problemId) {
  return NEETCODE150.some((p) => p.id === problemId);
}

export function getNeetcode150Problems() {
  return NEETCODE150;
}
