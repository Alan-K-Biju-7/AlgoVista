/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'copy-list-with-random-pointer',
  title: 'Copy List With Random Pointer',
  difficulty: 'Medium',
  pattern: 'Linked List',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Create a deep copy of a linked list where each node has next and random pointers.',
  examples: [
    { input: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', output: 'deep-copied list with same structure' },
    { input: 'head = [[1,1],[2,1]]', output: 'deep-copied list with same structure' },
  ],
  testCases: [
    {
      input: [[[7,null],[13,0],[11,4],[10,2],[1,0]]],
      expected: [[7,null],[13,0],[11,4],[10,2],[1,0]]
    },
    {
      input: [[[1,1],[2,1]]],
      expected: [[1,1],[2,1]]
    }
  ],
  hints: [
    'Each original node needs its own new clone node.',
    'A map from old node index to new node index helps wire random pointers.',
    'Make sure the copied random pointers never reference original nodes.',
  ],
  pattern_explanation:
    'The challenge is preserving two pointer relationships at once, which is why copying structure first and reconnecting references second works cleanly.',
  solution: `function solve(nodes) {
  return nodes.map(([val, random]) => [val, random]);
}`,
};
