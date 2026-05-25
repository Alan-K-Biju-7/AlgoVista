export default {
  id: 'design-add-and-search-words-data-structure',
  title: 'Design Add and Search Words Data Structure',
  difficulty: 'Medium',
  pattern: 'Tries',
  timeO: 'O(n) add, O(26^n) worst-case search',
  spaceO: 'O(t)',
  viz: 'trie',
  concept: 'tries',
  description:
    'Design a data structure that supports adding words and searching with . wildcard matches.',
  examples: [
    { input: 'addWord("bad"), addWord("dad"), addWord("mad"), search("pad"), search("bad"), search(".ad"), search("b..")', output: 'false, true, true, true' },
    { input: 'addWord("a"), addWord("ab"), search("a."), search(".")', output: 'true, true' },
  ],
  testCases: [
    {
      input: [[['addWord','bad'],['addWord','dad'],['addWord','mad'],['search','pad'],['search','bad'],['search','.ad'],['search','b..']]],
      expected: [false,true,true,true]
    }
  ],
  hints: [
    'A normal trie insert still works for addWord.',
    'The wildcard . means you may need to try every child at that position.',
    'That branching is easiest to write with DFS.',
  ],
  pattern_explanation:
    'The trie handles fixed characters directly, while DFS handles wildcard positions by exploring all valid child branches.',
  solution: `class Node {
  constructor() {
    this.children = {};
    this.end = false;
  }
}

class WordDictionary {
  constructor() {
    this.root = new Node();
  }

  addWord(word) {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children[ch]) cur.children[ch] = new Node();
      cur = cur.children[ch];
    }
    cur.end = true;
  }

  search(word) {
    const dfs = (i, node) => {
      if (i === word.length) return node.end;

      const ch = word[i];
      if (ch === '.') {
        for (const child of Object.values(node.children)) {
          if (dfs(i + 1, child)) return true;
        }
        return false;
      }

      if (!node.children[ch]) return false;
      return dfs(i + 1, node.children[ch]);
    };

    return dfs(0, this.root);
  }
}

function solve(ops) {
  const wd = new WordDictionary();
  const out = [];

  for (const [op, arg] of ops) {
    if (op === 'addWord') wd.addWord(arg);
    else if (op === 'search') out.push(wd.search(arg));
  }

  return out;
}`,
};
