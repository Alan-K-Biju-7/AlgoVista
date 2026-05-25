// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'reverse-nodes-in-k-group',
  title: 'Reverse Nodes in K-Group',
  difficulty: 'Hard',
  pattern: 'Linked List',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Reverse nodes of a linked list k at a time and leave the final incomplete group unchanged.',
  examples: [
    { input: 'head = [1,2,3,4,5], k = 2', output: '[2,1,4,3,5]' },
    { input: 'head = [1,2,3,4,5], k = 3', output: '[3,2,1,4,5]' },
  ],
  testCases: [
    { input: [[1,2,3,4,5], 2], expected: [2,1,4,3,5] },
    { input: [[1,2,3,4,5], 3], expected: [3,2,1,4,5] },
    { input: [[1,2,3], 4], expected: [1,2,3] },
  ],
  hints: [
    'Before reversing, make sure a full group of k nodes exists.',
    'Reverse only that block, then connect it to the previous and next blocks.',
    'A dummy node simplifies reconnecting the new group head.',
  ],
  pattern_explanation:
    'This is pointer reversal in fixed-size windows: isolate a complete k-block, reverse the pointers inside it, then stitch the list back together.',
  solution: `function solve(values, k) {
  const out = values.slice();

  for (let start = 0; start + k <= out.length; start += k) {
    let left = start;
    let right = start + k - 1;

    while (left < right) {
      [out[left], out[right]] = [out[right], out[left]];
      left++;
      right--;
    }
  }

  return out;
}`,
};
