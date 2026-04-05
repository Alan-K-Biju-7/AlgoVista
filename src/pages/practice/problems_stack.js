export const stackProblems = [
  {
    id: 6, title: 'Valid Parentheses', difficulty: 'Easy', pattern: 'Stack Matching', viz: 'stack',
    description: 'Given a string containing only ( ) { } [ ], determine if the brackets are valid. Every opening bracket must be closed by the same type in the correct order.',
    examples: [
      { input: 's = "()"',     output: 'true',  explanation: 'Single matching pair.' },
      { input: 's = "()[]{}"', output: 'true',  explanation: 'Three separate valid pairs.' },
      { input: 's = "(]"',     output: 'false', explanation: 'Wrong closing bracket type.' },
    ],
    hints: [
      'When you see an opening bracket, you need to remember it for later.',
      'A stack is perfect — last opened bracket must be the first closed.',
      'Push opening brackets. On closing bracket check if stack top is the matching opener. If stack is empty at end → valid.',
    ],
    pattern_explanation: 'Stack LIFO matches the last-opened-first-closed nature of bracket validation.',
    solution: `function isValid(s) {
  const stack = [], map = { ')':'(', '}':'{', ']':'[' };
  for (const c of s) {
    if ('([{'.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}`,
    testCases: [
      { input: ['()'],     expected: true  },
      { input: ['()[]{}'  ], expected: true  },
      { input: ['(]'],     expected: false },
      { input: ['([)]'],   expected: false },
    ],
  },
  {
    id: 7, title: 'Min Stack', difficulty: 'Medium', pattern: 'Stack Design', viz: 'stack',
    description: 'Design a stack that supports push, pop, top and retrieving the minimum element — all in O(1) time.',
    examples: [
      { input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', output: '-3, 0, -2', explanation: 'Min tracks correctly as elements are removed.' },
    ],
    hints: [
      'getMin in O(1) is impossible with just one stack — the minimum changes as you pop.',
      'Use a second stack that only tracks the current minimum at each level.',
      'When pushing x: push min(x, minStack.top()) onto minStack. On pop, pop both stacks.',
    ],
    pattern_explanation: 'Parallel min-tracking stack. Each position in main stack has a corresponding minimum.',
    solution: `class MinStack {
  constructor() { this.stack = []; this.minStack = []; }
  push(val) {
    this.stack.push(val);
    this.minStack.push(Math.min(val, this.minStack.length ? this.minStack.at(-1) : val));
  }
  pop() { this.stack.pop(); this.minStack.pop(); }
  top() { return this.stack.at(-1); }
  getMin() { return this.minStack.at(-1); }
}`,
    testCases: [],
  },
  {
    id: 8, title: 'Daily Temperatures', difficulty: 'Medium', pattern: 'Monotonic Stack', viz: 'stack',
    description: 'Given an array of daily temperatures, return an array where result[i] is the number of days until a warmer temperature. If no future warmer day exists, put 0.',
    examples: [
      { input: 'temps = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: 'Day 0 (73°): next warmer is day 1 (74°) — 1 day away.' },
    ],
    hints: [
      'For each day you need the next day with a higher temperature.',
      'A brute force O(n²) scans forward for each day — can you do better?',
      'Monotonic decreasing stack: store indices. When current temp > stack top temp, pop and record distance.',
    ],
    pattern_explanation: 'Monotonic stack processes each element once. O(n) total despite the while loop.',
    solution: `function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0), stack = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack.at(-1)]) {
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
}`,
    testCases: [
      { input: [[73,74,75,71,69,72,76,73]], expected: [1,1,4,2,1,1,0,0] },
      { input: [[30,40,50,60]],             expected: [1,1,1,0] },
      { input: [[30,60,90]],                expected: [1,1,0] },
    ],
  },
];
