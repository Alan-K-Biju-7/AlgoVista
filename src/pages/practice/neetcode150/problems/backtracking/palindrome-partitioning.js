export default {
  id: 'palindrome-partitioning',
  title: 'Palindrome Partitioning',
  difficulty: 'Medium',
  pattern: 'Backtracking',
  timeO: 'O(n * 2^n)',
  spaceO: 'O(n)',
  viz: 'recursion-tree',
  concept: 'backtracking',
  description:
    'Return all possible palindrome partitionings of a string.',
  examples: [
    { input: 's = "aab"', output: '[["a","a","b"],["aa","b"]]' },
    { input: 's = "a"', output: '[["a"]]' },
  ],
  testCases: [
    { input: ['aab'], expected: [['a','a','b'],['aa','b']] },
    { input: ['a'], expected: [['a']] },
  ],
  hints: [
    'Try every possible end position for the next substring.',
    'Only recurse when the chosen substring is a palindrome.',
    'When you reach the end of the string, save the current partition.',
  ],
  pattern_explanation:
    'Backtracking explores every possible cut of the string, while palindrome checks prune invalid partitions early.',
  solution: `function solve(s) {
  const res = [];
  const path = [];

  function isPal(l, r) {
    while (l < r) {
      if (s[l++] !== s[r--]) return false;
    }
    return true;
  }

  function dfs(start) {
    if (start === s.length) {
      res.push(path.slice());
      return;
    }

    for (let end = start; end < s.length; end++) {
      if (!isPal(start, end)) continue;
      path.push(s.slice(start, end + 1));
      dfs(end + 1);
      path.pop();
    }
  }

  dfs(0);
  return res;
}`,
};
