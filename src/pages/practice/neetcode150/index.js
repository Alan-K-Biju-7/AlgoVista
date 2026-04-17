import NEETCODE150_JSON from './neetcode150.json';

export const NEETCODE150 = NEETCODE150_JSON;

const ID_SET = new Set(NEETCODE150.map((p) => p.id));

export function isNeetcode150(problemId) { return ID_SET.has(problemId); }
export function byPattern(pattern) { return NEETCODE150.filter((p) => p.pattern === pattern); }
export function allPatterns() { return Array.from(new Set(NEETCODE150.map((p) => p.pattern))); }
