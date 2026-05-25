export default {
  id: 'min-stack',
  title: 'Min Stack',
  difficulty: 'Medium',
  pattern: 'Stack',
  timeO: 'O(1) per operation',
  spaceO: 'O(n)',
  viz: 'stack',
  concept: 'stack',
  description:
    'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
  examples: [
    { input: 'push(-2), push(0), push(-3), getMin()', output: '-3' },
    { input: 'pop(), top(), getMin()', output: '0, -2' },
  ],
  testCases: [
    {
      input: [[['push', -2], ['push', 0], ['push', -3], ['getMin'], ['pop'], ['top'], ['getMin']]],
      expected: [-3, 0, -2]
    }
  ],
  hints: [
    'Store more than just the pushed value.',
    'Each stack entry can remember the minimum up to that point.',
    'Then pop automatically restores the previous minimum.',
  ],
  pattern_explanation:
    'By storing each value together with the minimum seen so far, every operation stays O(1).',
  solution: `class MinStack {
  constructor() {
    this.stack = [];
  }

  push(val) {
    const min = this.stack.length
      ? Math.min(val, this.stack[this.stack.length - 1].min)
      : val;
    this.stack.push({ val, min });
  }

  pop() {
    if (this.stack.length) this.stack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1]?.val;
  }

  getMin() {
    return this.stack[this.stack.length - 1]?.min;
  }
}

function solve(ops) {
  const s = new MinStack();
  const out = [];

  for (const [op, value] of ops) {
    if (op === 'push') s.push(value);
    else if (op === 'pop') s.pop();
    else if (op === 'top') out.push(s.top());
    else if (op === 'getMin') out.push(s.getMin());
  }

  return out;
}`,
};
