/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'permutation-in-string',
  title: 'Permutation in String',
  difficulty: 'Medium',
  pattern: 'Sliding Window',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'hashmap',
  concept: 'sliding-window',
  description:
    'Return true if s2 contains a permutation of s1 as a substring.',
  examples: [
    { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true' },
    { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false' },
  ],
  testCases: [
    { input: ['ab', 'eidbaooo'], expected: true },
    { input: ['ab', 'eidboaoo'], expected: false },
    { input: ['adc', 'dcda'], expected: true },
  ],
  hints: [
    'A valid permutation window must have the same length as s1.',
    'Track frequency counts for the target and the current window.',
    'Slide one character out and one character in.',
  ],
  pattern_explanation:
    'Because permutations preserve character counts and length, a fixed-size sliding window with frequency comparison solves the problem efficiently.',
  solution: `function solve(s1, s2) {
  if (s1.length > s2.length) return false;

  const need = Array(26).fill(0);
  const have = Array(26).fill(0);
  const base = 'a'.charCodeAt(0);

  for (const ch of s1) need[ch.charCodeAt(0) - base]++;

  for (let i = 0; i < s2.length; i++) {
    have[s2.charCodeAt(i) - base]++;

    if (i >= s1.length) {
      have[s2.charCodeAt(i - s1.length) - base]--;
    }

    let same = true;
    for (let j = 0; j < 26; j++) {
      if (need[j] !== have[j]) {
        same = false;
        break;
      }
    }

    if (same) return true;
  }

  return false;
}`,
};
