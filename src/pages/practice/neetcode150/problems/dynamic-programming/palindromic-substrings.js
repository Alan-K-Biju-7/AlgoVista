export default {
  id: 'palindromic-substrings',
  title: 'Palindromic Substrings',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n^2)',
  spaceO: 'O(1)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return the number of palindromic substrings in the given string.',
  examples: [
    { input: 's = "abc"', output: '3' },
    { input: 's = "aaa"', output: '6' },
  ],
  testCases: [
    { input: ['abc'], expected: 3 },
    { input: ['aaa'], expected: 6 },
    { input: ['abba'], expected: 6 },
  ],
  hints: [
    'Each character can be the center of an odd-length palindrome.',
    'Each gap between characters can be the center of an even-length palindrome.',
    'Expand from every center and count every successful match.',
  ],
  pattern_explanation:
    'Counting palindromes by center expansion visits every valid palindromic substring without building a DP table.',
  solution: `function solve(s) {
  let count = 0;

  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--;
      r++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }

  return count;
}`,
};
