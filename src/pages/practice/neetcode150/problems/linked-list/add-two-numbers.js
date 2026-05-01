export default {
  id: 'add-two-numbers',
  title: 'Add Two Numbers',
  difficulty: 'Medium',
  pattern: 'Linked List',
  timeO: 'O(max(n,m))',
  spaceO: 'O(max(n,m))',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Add two numbers represented by linked lists in reverse digit order and return the sum as a linked list.',
  examples: [
    { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]' },
    { input: 'l1 = [0], l2 = [0]', output: '[0]' },
  ],
  testCases: [
    { input: [[2,4,3], [5,6,4]], expected: [7,0,8] },
    { input: [[0], [0]], expected: [0] },
    { input: [[9,9,9,9,9,9,9], [9,9,9,9]], expected: [8,9,9,9,0,0,0,1] },
  ],
  hints: [
    'Add digit by digit while tracking carry.',
    'Continue while either list has digits left or carry is nonzero.',
    'The result is also built in reverse order.',
  ],
  pattern_explanation:
    'Because the digits are stored in reverse order, you can add from head to tail exactly like elementary addition with carry.',
  solution: `function solve(l1, l2) {
  const out = [];
  let i = 0;
  let j = 0;
  let carry = 0;

  while (i < l1.length || j < l2.length || carry) {
    const a = i < l1.length ? l1[i++] : 0;
    const b = j < l2.length ? l2[j++] : 0;
    const sum = a + b + carry;

    out.push(sum % 10);
    carry = Math.floor(sum / 10);
  }

  return out;
}`,
};
