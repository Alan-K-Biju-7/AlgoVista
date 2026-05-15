/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'longest-substring-without-repeating-characters',
  title: 'Longest Substring Without Repeating Characters',
  difficulty: 'Medium',
  pattern: 'Sliding Window',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'hashset',
  concept: 'sliding-window',
  description:
    'Return the length of the longest substring without duplicate characters.',
  examples: [
    { input: 's = "abcabcbb"', output: '3' },
    { input: 's = "bbbbb"', output: '1' },
  ],
  testCases: [
    { input: ['abcabcbb'], expected: 3 },
    { input: ['bbbbb'], expected: 1 },
    { input: ['pwwkew'], expected: 3 },
  ],
  hints: [
    'Keep a window with all unique characters.',
    'If a duplicate appears, shrink from the left until the window is valid again.',
    'Track the best valid window length.',
  ],
  pattern_explanation:
    'Sliding window works because the substring must stay contiguous, and the left pointer can remove duplicates incrementally instead of restarting the scan.',
  solution: `function solve(s) {
  const seen = new Set();
  let l = 0;
  let best = 0;

  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) {
      seen.delete(s[l]);
      l++;
    }
    seen.add(s[r]);
    best = Math.max(best, r - l + 1);
  }

  return best;
}`,
};
