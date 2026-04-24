export default {
  id: 'valid-palindrome',
  title: 'Valid Palindrome',
  difficulty: 'Easy',
  pattern: 'Two Pointers',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'two-pointers',
  description:
    'Return true if the string is a palindrome after converting uppercase letters to lowercase and removing non-alphanumeric characters.',
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
    { input: 's = "race a car"', output: 'false' },
  ],
  testCases: [
    { input: ['A man, a plan, a canal: Panama'], expected: true },
    { input: ['race a car'], expected: false },
    { input: [' '], expected: true },
  ],
  hints: [
    'Use one pointer at the start and one at the end.',
    'Skip characters that are not letters or digits.',
    'Compare lowercase versions before moving inward.',
  ],
  pattern_explanation:
    'This problem fits two pointers because you compare mirrored positions while shrinking the search space from both ends.',
  solution: `function solve(s) {
  let l = 0;
  let r = s.length - 1;

  const isAlphaNum = (ch) => /[a-z0-9]/i.test(ch);

  while (l < r) {
    while (l < r && !isAlphaNum(s[l])) l++;
    while (l < r && !isAlphaNum(s[r])) r--;

    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++;
    r--;
  }

  return true;
}`,
};
