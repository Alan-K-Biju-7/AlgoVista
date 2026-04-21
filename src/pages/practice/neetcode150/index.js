import ARRAYS_HASHING_PROBLEMS from './problems/arrays-hashing';

export const NEETCODE150 = [
  ...ARRAYS_HASHING_PROBLEMS,
];

export function isNeetcode150(problemId) {
  return NEETCODE150.some((p) => p.id === problemId);
}

export function getNeetcode150Problems() {
  return NEETCODE150;
}
