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
    'Given an array of strings, group the anagrams together. You may return the answer in any order.',
  examples: [
    { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
    { input: 'strs = [""]',    output: '[[""]]' },
    { input: 'strs = ["a"]',   output: '[["a"]]' },
  ],
  testCases: [
    { input: [["eat","tea","tan","ate","nat","bat"]],
      expected: [["eat","tea","ate"],["tan","nat"],["bat"]] },
    { input: [[""]],  expected: [[""]] },
    { input: [["a"]], expected: [["a"]] },
  ],
  hints: [
    'All anagrams share the same sorted string.',
    'A 26-length count string is a faster signature than sorting.',
  ],
  pattern_explanation:
    'Bucket by a canonical key (sorted string or count tuple). Map key to list of members.',
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
