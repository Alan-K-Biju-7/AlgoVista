/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'hand-of-straights',
  title: 'Hand of Straights',
  difficulty: 'Medium',
  pattern: 'Greedy',
  timeO: 'O(n log n)',
  spaceO: 'O(n)',
  viz: 'array',
  concept: 'greedy',
  description:
    'Return true if the hand can be rearranged into groups of size groupSize made of consecutive cards.',
  examples: [
    { input: 'hand = [1,2,3,6,2,3,4,7,8], groupSize = 3', output: 'true' },
    { input: 'hand = [1,2,3,4,5], groupSize = 4', output: 'false' },
  ],
  testCases: [
    { input: [[1,2,3,6,2,3,4,7,8], 3], expected: true },
    { input: [[1,2,3,4,5], 4], expected: false },
    { input: [[1,1,2,2,3,3], 3], expected: true },
  ],
  hints: [
    'If the total number of cards is not divisible by groupSize, return false immediately.',
    'Use a frequency map to track available cards.',
    'Always try to build groups starting from the smallest unused card.',
  ],
  pattern_explanation:
    'The greedy rule is forced: the smallest remaining card must begin a consecutive group, so sorting plus counting determines feasibility.',
  solution: `function solve(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;

  hand.sort((a, b) => a - b);
  const count = new Map();

  for (const card of hand) {
    count.set(card, (count.get(card) || 0) + 1);
  }

  for (const card of hand) {
    if ((count.get(card) || 0) === 0) continue;

    for (let i = 0; i < groupSize; i++) {
      const want = card + i;
      if ((count.get(want) || 0) === 0) return false;
      count.set(want, count.get(want) - 1);
    }
  }

  return true;
}`,
};
