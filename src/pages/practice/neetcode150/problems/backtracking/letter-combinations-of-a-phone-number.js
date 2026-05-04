export default {
  id: 'letter-combinations-of-a-phone-number',
  title: 'Letter Combinations of a Phone Number',
  difficulty: 'Medium',
  pattern: 'Backtracking',
  timeO: 'O(4^n * n)',
  spaceO: 'O(n)',
  viz: 'recursion-tree',
  concept: 'backtracking',
  description:
    'Return all possible letter combinations that the digit string could represent.',
  examples: [
    { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
    { input: 'digits = ""', output: '[]' },
  ],
  testCases: [
    { input: ['23'], expected: ['ad','ae','af','bd','be','bf','cd','ce','cf'] },
    { input: [''], expected: [] },
    { input: ['2'], expected: ['a','b','c'] },
  ],
  hints: [
    'Each digit contributes a small set of possible letters.',
    'Choose one letter for the current digit, then recurse to the next digit.',
    'When you place letters for all digits, record the built string.',
  ],
  pattern_explanation:
    'This is backtracking over a cartesian product: each recursion level chooses one character from the current digit’s mapping.',
  solution: `function solve(digits) {
  if (!digits.length) return [];

  const map = {
    '2': 'abc',
    '3': 'def',
    '4': 'ghi',
    '5': 'jkl',
    '6': 'mno',
    '7': 'pqrs',
    '8': 'tuv',
    '9': 'wxyz',
  };

  const res = [];
  const path = [];

  function dfs(i) {
    if (i === digits.length) {
      res.push(path.join(''));
      return;
    }

    for (const ch of map[digits[i]]) {
      path.push(ch);
      dfs(i + 1);
      path.pop();
    }
  }

  dfs(0);
  return res;
}`,
};
