export default {
  id: 'valid-anagram',
  title: 'Valid Anagram',
  difficulty: 'Easy',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(1) for lowercase letters',
  viz: 'hashmap',
  concept: 'arrays-hashing',
  description:
    'Given two strings s and t, return true if t is an anagram of s. An anagram uses exactly the same letters the same number of times.',
  examples: [
    { input: 's = "anagram", t = "nagaram"', output: 'true' },
    { input: 's = "rat", t = "car"',         output: 'false' },
  ],
  testCases: [
    { input: ['anagram', 'nagaram'], expected: true  },
    { input: ['rat', 'car'],         expected: false },
    { input: ['', ''],               expected: true  },
    { input: ['aabb', 'abab'],       expected: true  },
  ],
  hints: [
    'Two strings of different length can never be anagrams.',
    'Count letter frequencies in one string, then subtract while reading the other.',
    'Any non-zero count at the end means it is not an anagram.',
  ],
  pattern_explanation:
    'Frequency counting. Walk s incrementing counts, walk t decrementing, then assert all zeros.',
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
