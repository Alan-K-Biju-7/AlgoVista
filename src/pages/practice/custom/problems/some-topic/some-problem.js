export default {
  id: 'some-problem',
  title: 'Some Problem',
  difficulty: 'Medium',
  pattern: 'Custom',
  timeO: 'O(1)',
  spaceO: 'O(1)',
  viz: 'none',
  concept: 'custom',
  description:
    'Short description of what the problem asks you to do.',
  examples: [
    { input: 'your example input here', output: 'expected output here' },
  ],
  testCases: [
    { input: [/* arguments */], expected: /* value */ },
  ],
  hints: [
    'First hint here.',
    'Second hint here.',
  ],
  pattern_explanation:
    'Explain in one or two sentences why this solution approach works.',
  solution: `function solve(/* args */) {
  // your implementation here
}`,
};
