export default {
  id: 'longest-palindromic-substring',
  title: 'Longest Palindromic Substring',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n^2)',
  spaceO: 'O(1)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the longest palindromic substring in the given string.',
  examples: [
    { input: 's = "babad"', output: '"bab"' },
    { input: 's = "cbbd"', output: '"bb"' },
  ],
  testCases: [
    { input: ['babad'], expected: 'bab' },
    { input: ['cbbd'], expected: 'bb' },
    { input: ['a'], expected: 'a' },
  ],
  hints: [
    'Every palindrome has a center.',
    'Try expanding outward from each index for odd and even lengths.',
    'Track the longest window found during expansion.',
  ],
  pattern_explanation:
    'Expanding around centers checks all possible palindromes in quadratic time using constant extra space.',
  solution: `function solve(s) {
  let start = 0;
  let end = 0;

  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--;
      r++;
    }
    return [l + 1, r - 1];
  }

  for (let i = 0; i < s.length; i++) {
    let [l1, r1] = expand(i, i);
    let [l2, r2] = expand(i, i + 1);

    if (r1 - l1 > end - start) {
      start = l1;
      end = r1;
    }
    if (r2 - l2 > end - start) {
      start = l2;
      end = r2;
    }
  }

  return s.slice(start, end + 1);
}`,
};
