export default {
  id: 'implement-trie-prefix-tree',
  title: 'Implement Trie (Prefix Tree)',
  difficulty: 'Medium',
  pattern: 'Tries',
  timeO: 'O(n) per operation',
  spaceO: 'O(t)',
  viz: 'trie',
  concept: 'tries',
  description:
    'Implement a trie with insert, search, and startsWith operations.',
  examples: [
    { input: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")', output: 'true, false, true, true' },
    { input: 'insert("dog"), startsWith("do"), search("do")', output: 'true, false' },
  ],
  testCases: [
    {
      input: [['insert','apple'],['search','apple'],['search','app'],['startsWith','app'],['insert','app'],['search','app']],
      expected: [true,false,true,true]
    }
  ],
  hints: [
    'Each node should map characters to child nodes.',
    'You also need a flag to mark the end of a complete word.',
    'Prefix lookup is like search, but it does not require the end-of-word flag.',
  ],
  pattern_explanation:
    'A trie stores strings along character paths, which makes exact-word and prefix queries proportional only to the query length.',
  solution: `class TrieNode {
  constructor() {
    this.children = {};
    this.end = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children[ch]) cur.children[ch] = new TrieNode();
      cur = cur.children[ch];
    }
    cur.end = true;
  }

  search(word) {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children[ch]) return false;
      cur = cur.children[ch];
    }
    return cur.end;
  }

  startsWith(prefix) {
    let cur = this.root;
    for (const ch of prefix) {
      if (!cur.children[ch]) return false;
      cur = cur.children[ch];
    }
    return true;
  }
}

function solve(ops) {
  const trie = new Trie();
  const out = [];

  for (const [op, arg] of ops) {
    if (op === 'insert') trie.insert(arg);
    else if (op === 'search') out.push(trie.search(arg));
    else if (op === 'startsWith') out.push(trie.startsWith(arg));
  }

  return out;
}`,
};
