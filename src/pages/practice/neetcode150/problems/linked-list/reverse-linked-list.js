export default {
  id: 'reverse-linked-list',
  title: 'Reverse Linked List',
  difficulty: 'Easy',
  pattern: 'Linked List',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Reverse a singly linked list and return the new head.',
  examples: [
    { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
    { input: 'head = [1,2]', output: '[2,1]' },
  ],
  testCases: [
    { input: [[1,2,3,4,5]], expected: [5,4,3,2,1] },
    { input: [[1,2]], expected: [2,1] },
    { input: [[]], expected: [] },
  ],
  hints: [
    'Track the previous node while walking forward.',
    'Save the next node before changing pointers.',
    'After rewiring, move both pointers forward.',
  ],
  pattern_explanation:
    'Linked-list reversal is pure pointer manipulation: each node turns its next pointer backward to the previous node.',
  solution: `function solve(values) {
  const nodes = values.map((v) => ({ val: v, next: null }));
  for (let i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];

  let prev = null;
  let curr = nodes[0] || null;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  const out = [];
  while (prev) {
    out.push(prev.val);
    prev = prev.next;
  }

  return out;
}`,
};
