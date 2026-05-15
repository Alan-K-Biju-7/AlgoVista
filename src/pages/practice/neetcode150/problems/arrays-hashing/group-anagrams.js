/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'group-anagrams',
  title: 'Group Anagrams',
  difficulty: 'Medium',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n * k log k)',
  spaceO: 'O(n * k)',
  viz: 'hashmap',
  concept: 'arrays-hashing',
  description:
    'Group the anagrams together. You may return the answer in any order.',
  examples: [
    { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
  ],
  testCases: [
    { input: [["eat","tea","tan","ate","nat","bat"]], expected: [["eat","tea","ate"],["tan","nat"],["bat"]] },
    { input: [[""]], expected: [[""]] },
  ],
  hints: [
    'Anagrams share the same sorted-letter signature.',
  ],
  pattern_explanation:
    'Use a hash map from a canonical key to the list of strings belonging to that group.',
  solution: `function solve(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return Array.from(groups.values());
}`,
};
