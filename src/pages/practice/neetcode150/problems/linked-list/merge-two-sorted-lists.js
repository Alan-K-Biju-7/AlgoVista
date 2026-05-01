export default {
  id: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  difficulty: 'Easy',
  pattern: 'Linked List',
  timeO: 'O(n + m)',
  spaceO: 'O(1) extra',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Merge two sorted linked lists and return the head of the merged sorted list.',
  examples: [
    { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
    { input: 'list1 = [], list2 = []', output: '[]' },
  ],
  testCases: [
    { input: [[1,2,4], [1,3,4]], expected: [1,1,2,3,4,4] },
    { input: [[], []], expected: [] },
    { input: [[], [0]], expected: [0] },
  ],
  hints: [
    'Use a dummy head to simplify edge cases.',
    'Always attach the smaller current node.',
    'When one list ends, append the remaining part of the other list.',
  ],
  pattern_explanation:
    'Because both lists are already sorted, you can build the answer one node at a time by always taking the smaller front node.',
  solution: `function solve(list1, list2) {
  let i = 0;
  let j = 0;
  const out = [];

  while (i < list1.length && j < list2.length) {
    if (list1[i] <= list2[j]) out.push(list1[i++]);
    else out.push(list2[j++]);
  }

  while (i < list1.length) out.push(list1[i++]);
  while (j < list2.length) out.push(list2[j++]);

  return out;
}`,
};
