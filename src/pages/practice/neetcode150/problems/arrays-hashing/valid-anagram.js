export default {
  id: 'valid-anagram',
  title: 'Valid Anagram',
  difficulty: 'Easy',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(1) for fixed alphabet',
  viz: 'hashmap',
  concept: 'arrays-hashing',
  description:
    'Return true if t is an anagram of s, otherwise return false.',
  examples: [
    { input: 's = "anagram", t = "nagaram"', output: 'true' },
    { input: 's = "rat", t = "car"', output: 'false' },
  ],
  testCases: [
    { input: ['anagram', 'nagaram'], expected: true },
    { input: ['rat', 'car'], expected: false },
    { input: ['', ''], expected: true },
  ],
  hints: [
    'If the lengths differ, the answer is immediately false.',
    'Count letters in one string and subtract with the other.',
  ],
  pattern_explanation:
    'Hashing works here as frequency counting: equal frequency maps mean the strings are anagrams.',
  solution: `function solve(s, t) {
  if (s.length !== t.length) return false;
  const count = new Map();
  for (const ch of s) count.set(ch, (count.get(ch) || 0) + 1);
  for (const ch of t) {
    if (!count.has(ch)) return false;
    count.set(ch, count.get(ch) - 1);
    if (count.get(ch) < 0) return false;
  }
  return true;
}`,
};
