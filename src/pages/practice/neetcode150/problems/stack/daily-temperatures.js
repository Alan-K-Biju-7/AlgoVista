export default {
  id: 'daily-temperatures',
  title: 'Daily Temperatures',
  difficulty: 'Medium',
  pattern: 'Stack',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'stack',
  concept: 'stack',
  description:
    'For each day, return how many days you would have to wait until a warmer temperature.',
  examples: [
    { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
    { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' },
  ],
  testCases: [
    { input: [[73,74,75,71,69,72,76,73]], expected: [1,1,4,2,1,1,0,0] },
    { input: [[30,40,50,60]], expected: [1,1,1,0] },
    { input: [[30,60,90]], expected: [1,1,0] },
  ],
  hints: [
    'Keep indices of days that have not yet found a warmer future day.',
    'When the current temperature is warmer, resolve as many previous days as possible.',
    'A decreasing stack of temperatures makes this efficient.',
  ],
  pattern_explanation:
    'A monotonic stack stores unresolved days in decreasing temperature order, letting each index be pushed and popped at most once.',
  solution: `function solve(temperatures) {
  const out = new Array(temperatures.length).fill(0);
  const stack = [];

  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prev = stack.pop();
      out[prev] = i - prev;
    }
    stack.push(i);
  }

  return out;
}`,
};
