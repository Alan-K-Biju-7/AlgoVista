export default {
  id: 'remove-nth-node-from-end-of-list',
  title: 'Remove Nth Node From End of List',
  difficulty: 'Medium',
  pattern: 'Linked List',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Remove the nth node from the end of the list and return the head.',
  examples: [
    { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' },
    { input: 'head = [1], n = 1', output: '[]' },
  ],
  testCases: [
    { input: [[1,2,3,4,5], 2], expected: [1,2,3,5] },
    { input: [[1], 1], expected: [] },
    { input: [[1,2], 1], expected: [1] },
  ],
  hints: [
    'Use a dummy head for simpler edge cases.',
    'Move the right pointer n steps ahead first.',
    'Then move both pointers until right reaches the end.',
  ],
  pattern_explanation:
    'A fixed gap between two pointers lets you locate the node right before the target in one pass.',
  solution: `function solve(values, n) {
  const out = values.slice();
  out.splice(out.length - n, 1);
  return out;
}`,
};
