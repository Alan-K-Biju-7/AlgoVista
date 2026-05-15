/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'valid-parenthesis-string',
  title: 'Valid Parenthesis String',
  difficulty: 'Medium',
  pattern: 'Greedy',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'string',
  concept: 'greedy',
  description:
    'Return true if the string can be valid when each * may act as (, ), or an empty string.',
  examples: [
    { input: 's = "(*)"', output: 'true' },
    { input: 's = "(*))"', output: 'true' },
  ],
  testCases: [
    { input: ['(*)'], expected: true },
    { input: ['(*))'], expected: true },
    { input: ['(((*)'], expected: false },
  ],
  hints: [
    'Track a range of how many open parentheses are still possible.',
    'A left parenthesis increases both bounds.',
    'A star can increase, decrease, or leave the count unchanged.',
  ],
  pattern_explanation:
    'The greedy invariant keeps the lowest and highest possible open-count after each character, which is enough to determine feasibility.',
  solution: `function solve(s) {
  let leftMin = 0;
  let leftMax = 0;

  for (const ch of s) {
    if (ch === '(') {
      leftMin++;
      leftMax++;
    } else if (ch === ')') {
      leftMin--;
      leftMax--;
    } else {
      leftMin--;
      leftMax++;
    }

    if (leftMax < 0) return false;
    if (leftMin < 0) leftMin = 0;
  }

  return leftMin === 0;
}`,
};
