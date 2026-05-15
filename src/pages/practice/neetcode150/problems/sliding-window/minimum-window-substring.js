/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'minimum-window-substring',
  title: 'Minimum Window Substring',
  difficulty: 'Hard',
  pattern: 'Sliding Window',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'hashmap',
  concept: 'sliding-window',
  description:
    'Return the minimum window in s that contains all the characters of t, including duplicates.',
  examples: [
    { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
    { input: 's = "a", t = "a"', output: '"a"' },
  ],
  testCases: [
    { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
    { input: ['a', 'a'], expected: 'a' },
    { input: ['a', 'aa'], expected: '' },
  ],
  hints: [
    'Track required counts from t.',
    'Expand right until the window is valid.',
    'Then shrink left while keeping the window valid to minimize length.',
  ],
  pattern_explanation:
    'Sliding window is ideal because the answer is a contiguous range with a validity condition based on character coverage.',
  solution: `function solve(s, t) {
  if (!t || !s) return '';

  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);

  let have = 0;
  const needKinds = need.size;
  const window = new Map();
  let res = [-1, -1];
  let resLen = Infinity;
  let l = 0;

  for (let r = 0; r < s.length; r++) {
    const ch = s[r];
    window.set(ch, (window.get(ch) || 0) + 1);

    if (need.has(ch) && window.get(ch) === need.get(ch)) {
      have++;
    }

    while (have === needKinds) {
      if (r - l + 1 < resLen) {
        res = [l, r];
        resLen = r - l + 1;
      }

      const leftChar = s[l];
      window.set(leftChar, window.get(leftChar) - 1);

      if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
        have--;
      }

      l++;
    }
  }

  const [start, end] = res;
  return resLen === Infinity ? '' : s.slice(start, end + 1);
}`,
};
