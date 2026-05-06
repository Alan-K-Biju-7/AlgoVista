export default {
  id: 'word-break',
  title: 'Word Break',
  difficulty: 'Medium',
  pattern: '1-D Dynamic Programming',
  timeO: 'O(n * m * k)',
  spaceO: 'O(n)',
  viz: 'dp',
  concept: 'dynamic-programming',
  description:
    'Return true if the string can be segmented into one or more dictionary words.',
  examples: [
    { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' },
    { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true' },
  ],
  testCases: [
    { input: ['leetcode', ['leet', 'code']], expected: true },
    { input: ['applepenapple', ['apple', 'pen']], expected: true },
    { input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
  ],
  hints: [
    'Let dp[i] mean whether s[i:] can be segmented.',
    'For each position, try matching each dictionary word there.',
    'If a word matches and the remainder is valid, then dp[i] is true.',
  ],
  pattern_explanation:
    'This 1-D DP works backward through the string and marks positions that can reach a valid full segmentation.',
  solution: `function solve(s, wordDict) {
  const dp = new Array(s.length + 1).fill(false);
  dp[s.length] = true;

  for (let i = s.length - 1; i >= 0; i--) {
    for (const word of wordDict) {
      if (
        i + word.length <= s.length &&
        s.slice(i, i + word.length) === word
      ) {
        dp[i] = dp[i + word.length];
      }
      if (dp[i]) break;
    }
  }

  return dp[0];
}`,
};
