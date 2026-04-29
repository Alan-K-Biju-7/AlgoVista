export default {
  id: 'generate-parentheses',
  title: 'Generate Parentheses',
  difficulty: 'Medium',
  pattern: 'Stack',
  timeO: 'O(4^n / sqrt(n))',
  spaceO: 'O(n)',
  viz: 'stack',
  concept: 'stack',
  description:
    'Generate all combinations of n pairs of well-formed parentheses.',
  examples: [
    { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
    { input: 'n = 1', output: '["()"]' },
  ],
  testCases: [
    { input: [3], expected: ['((()))','(()())','(())()','()(())','()()()'] },
    { input: [1], expected: ['()'] },
  ],
  hints: [
    'You can add an opening parenthesis if you still have some left.',
    'You can add a closing parenthesis only if it does not break validity.',
    'Build the string step by step and backtrack.',
  ],
  pattern_explanation:
    'The partial expression must stay balanced like stack state: closes can never exceed opens, and total opens is limited by n.',
  solution: `function solve(n) {
  const out = [];
  const path = [];

  function backtrack(open, close) {
    if (path.length === 2 * n) {
      out.push(path.join(''));
      return;
    }

    if (open < n) {
      path.push('(');
      backtrack(open + 1, close);
      path.pop();
    }

    if (close < open) {
      path.push(')');
      backtrack(open, close + 1);
      path.pop();
    }
  }

  backtrack(0, 0);
  return out;
}`,
};
