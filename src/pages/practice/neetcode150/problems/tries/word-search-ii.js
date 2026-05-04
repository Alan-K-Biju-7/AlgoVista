export default {
  id: 'word-search-ii',
  title: 'Word Search II',
  difficulty: 'Hard',
  pattern: 'Tries',
  timeO: 'Exponential with trie pruning',
  spaceO: 'O(total letters in trie)',
  viz: 'grid-search',
  concept: 'tries',
  description:
    'Return all words from the given list that can be formed in the board using adjacent cells.',
  examples: [
    { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' },
    { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]' },
  ],
  testCases: [
    {
      input: [[['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']], ['oath','pea','eat','rain']],
      expected: ['eat','oath']
    },
    {
      input: [[['a','b'],['c','d']], ['abcb']],
      expected: []
    }
  ],
  hints: [
    'Searching each word independently is too repetitive.',
    'Store all words in a trie so shared prefixes reuse the same search work.',
    'During DFS, stop immediately if the current board path is not a trie prefix.',
  ],
  pattern_explanation:
    'The trie shares prefix checks across all words, and DFS on the board only continues along paths that still match some word prefix.',
  solution: `function solve(board, words) {
  const rows = board.length;
  const cols = board[0].length;

  const root = {};
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node.word = word;
  }

  const res = new Set();

  function dfs(r, c, node) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const ch = board[r][c];
    if (ch === '#' || !node[ch]) return;

    const next = node[ch];
    if (next.word) res.add(next.word);

    board[r][c] = '#';
    dfs(r + 1, c, next);
    dfs(r - 1, c, next);
    dfs(r, c + 1, next);
    dfs(r, c - 1, next);
    board[r][c] = ch;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, root);
    }
  }

  return [...res].sort();
}`,
};
