/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  difficulty: 'Easy',
  pattern: 'Stack',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'stack',
  concept: 'stack',
  description:
    'Return true if the input string has valid opening and closing brackets in the correct order.',
  examples: [
    { input: 's = "()"', output: 'true' },
    { input: 's = "()[]{}"', output: 'true' },
    { input: 's = "(]"', output: 'false' },
  ],
  testCases: [
    { input: ['()'], expected: true },
    { input: ['()[]{}'], expected: true },
    { input: ['(]'], expected: false },
    { input: ['([)]'], expected: false },
  ],
  hints: [
    'Opening brackets should be pushed onto a stack.',
    'A closing bracket must match the most recent unmatched opening bracket.',
    'The stack must be empty at the end for the string to be valid.',
  ],
  pattern_explanation:
    'A stack naturally models nested structure because the latest opening bracket must be closed first.',
  solution: `function solve(s) {
  const stack = [];
  const closeToOpen = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  for (const ch of s) {
    if (ch in closeToOpen) {
      if (!stack.length || stack.pop() !== closeToOpen[ch]) return false;
    } else {
      stack.push(ch);
    }
  }

  return stack.length === 0;
}`,
};
