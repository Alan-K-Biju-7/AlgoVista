/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'reorder-list',
  title: 'Reorder List',
  difficulty: 'Medium',
  pattern: 'Linked List',
  timeO: 'O(n)',
  spaceO: 'O(1) extra',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Reorder the list from L0→L1→…→Ln into L0→Ln→L1→Ln-1→L2→Ln-2→…',
  examples: [
    { input: 'head = [1,2,3,4]', output: '[1,4,2,3]' },
    { input: 'head = [1,2,3,4,5]', output: '[1,5,2,4,3]' },
  ],
  testCases: [
    { input: [[1,2,3,4]], expected: [1,4,2,3] },
    { input: [[1,2,3,4,5]], expected: [1,5,2,4,3] },
    { input: [[1,2]], expected: [1,2] },
  ],
  hints: [
    'Find the middle of the list first.',
    'Reverse the second half.',
    'Merge the two halves by alternating nodes.',
  ],
  pattern_explanation:
    'This problem combines three linked-list skills: split with slow/fast pointers, reverse a chain, then weave two lists together.',
  solution: `function solve(values) {
  if (values.length <= 2) return values.slice();

  const mid = Math.floor((values.length + 1) / 2);
  const first = values.slice(0, mid);
  const second = values.slice(mid).reverse();

  const out = [];
  let i = 0;
  let j = 0;

  while (i < first.length || j < second.length) {
    if (i < first.length) out.push(first[i++]);
    if (j < second.length) out.push(second[j++]);
  }

  return out;
}`,
};
