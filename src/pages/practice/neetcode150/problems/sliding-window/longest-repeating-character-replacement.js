/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'longest-repeating-character-replacement',
  title: 'Longest Repeating Character Replacement',
  difficulty: 'Medium',
  pattern: 'Sliding Window',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'hashmap',
  concept: 'sliding-window',
  description:
    'Return the length of the longest substring that can be made of one repeating character using at most k replacements.',
  examples: [
    { input: 's = "ABAB", k = 2', output: '4' },
    { input: 's = "AABABBA", k = 1', output: '4' },
  ],
  testCases: [
    { input: ['ABAB', 2], expected: 4 },
    { input: ['AABABBA', 1], expected: 4 },
    { input: ['AAAA', 2], expected: 4 },
  ],
  hints: [
    'Track character frequencies inside the current window.',
    'The number of replacements needed is window size minus the count of the most frequent character.',
    'Shrink when replacements needed exceed k.',
  ],
  pattern_explanation:
    'The window is valid exactly when the non-dominant characters can be replaced within k moves.',
  solution: `function solve(s, k) {
  const count = new Map();
  let l = 0;
  let maxFreq = 0;
  let best = 0;

  for (let r = 0; r < s.length; r++) {
    count.set(s[r], (count.get(s[r]) || 0) + 1);
    maxFreq = Math.max(maxFreq, count.get(s[r]));

    while (r - l + 1 - maxFreq > k) {
      count.set(s[l], count.get(s[l]) - 1);
      l++;
    }

    best = Math.max(best, r - l + 1);
  }

  return best;
}`,
};
