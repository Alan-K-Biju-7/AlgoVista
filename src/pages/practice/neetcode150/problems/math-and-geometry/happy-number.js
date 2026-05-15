/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'happy-number',
  title: 'Happy Number',
  difficulty: 'Easy',
  pattern: 'Math & Geometry',
  timeO: 'O(log n)',
  spaceO: 'O(log n)',
  viz: 'math',
  concept: 'math-and-geometry',
  description:
    'Return true if repeatedly replacing the number with the sum of the squares of its digits eventually reaches 1.',
  examples: [
    { input: 'n = 19', output: 'true' },
    { input: 'n = 2', output: 'false' },
  ],
  testCases: [
    { input: [19], expected: true },
    { input: [2], expected: false },
    { input: [1], expected: true },
  ],
  hints: [
    'Define a helper that computes the sum of squared digits.',
    'If the process does not reach 1, it must enter a cycle.',
    'A set of seen values can detect that cycle.',
  ],
  pattern_explanation:
    'The process defines a sequence of numbers, and the answer depends on whether that sequence reaches 1 before repeating.',
  solution: `function solve(n) {
  const seen = new Set();

  function nextNum(num) {
    let total = 0;
    while (num > 0) {
      const digit = num % 10;
      total += digit * digit;
      num = Math.floor(num / 10);
    }
    return total;
  }

  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = nextNum(n);
  }

  return n === 1;
}`,
};
