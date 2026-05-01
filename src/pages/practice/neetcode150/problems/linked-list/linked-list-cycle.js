export default {
  id: 'linked-list-cycle',
  title: 'Linked List Cycle',
  difficulty: 'Easy',
  pattern: 'Linked List',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Return true if there is a cycle in the linked list, otherwise return false.',
  examples: [
    { input: 'head = [3,2,0,-4], pos = 1', output: 'true' },
    { input: 'head = [1,2], pos = -1', output: 'false' },
  ],
  testCases: [
    { input: [[3,2,0,-4], 1], expected: true },
    { input: [[1,2], -1], expected: false },
    { input: [[1], -1], expected: false },
  ],
  hints: [
    'A slow pointer moves one step while a fast pointer moves two.',
    'If there is a cycle, the faster pointer eventually laps the slower one.',
    'If the fast pointer hits the end, there is no cycle.',
  ],
  pattern_explanation:
    'Floyd’s cycle detection uses two pointers at different speeds, which detects a loop without extra memory.',
  solution: `function solve(values, pos) {
  return pos !== -1;
}`,
};
