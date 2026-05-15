/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'evaluate-reverse-polish-notation',
  title: 'Evaluate Reverse Polish Notation',
  difficulty: 'Medium',
  pattern: 'Stack',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'stack',
  concept: 'stack',
  description:
    'Evaluate the value of an arithmetic expression in Reverse Polish Notation.',
  examples: [
    { input: 'tokens = ["2","1","+","3","*"]', output: '9' },
    { input: 'tokens = ["4","13","5","/","+"]', output: '6' },
  ],
  testCases: [
    { input: [['2','1','+','3','*']], expected: 9 },
    { input: [['4','13','5','/','+']], expected: 6 },
    { input: [['10','6','9','3','+','-11','*','/','*','17','+','5','+']], expected: 22 },
  ],
  hints: [
    'Push numbers onto the stack.',
    'When you see an operator, pop the top two numbers in the correct order.',
    'Push the computed result back onto the stack.',
  ],
  pattern_explanation:
    'RPN is evaluated naturally with a stack because each operator uses the most recently seen unresolved operands.',
  solution: `function solve(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (token === '+') {
      stack.push(stack.pop() + stack.pop());
    } else if (token === '-') {
      const a = stack.pop();
      const b = stack.pop();
      stack.push(b - a);
    } else if (token === '*') {
      stack.push(stack.pop() * stack.pop());
    } else if (token === '/') {
      const a = stack.pop();
      const b = stack.pop();
      stack.push(Math.trunc(b / a));
    } else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}`,
};
