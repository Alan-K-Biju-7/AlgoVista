export class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd    = false;
    this.word     = null;
  }
}

export function createTrie() { return new TrieNode(); }

export function trieInsert(root, word) {
  let node = root;
  for (const ch of word.toLowerCase()) {
    if (!node.children[ch]) node.children[ch] = new TrieNode();
    node = node.children[ch];
  }
  node.isEnd = true;
  node.word  = word.toLowerCase();
  return root;
}

export function trieSearch(root, word) {
  let node = root;
  const path = [];
  for (const ch of word.toLowerCase()) {
    if (!node.children[ch]) return { found: false, path, endedAt: ch };
    node = node.children[ch];
    path.push(ch);
  }
  return { found: node.isEnd, path, endedAt: null };
}

export function trieStartsWith(root, prefix) {
  let node = root;
  for (const ch of prefix.toLowerCase()) {
    if (!node.children[ch]) return false;
    node = node.children[ch];
  }
  return true;
}

export function trieDelete(root, word) {
  function _del(node, w, depth) {
    if (!node) return null;
    if (depth === w.length) {
      node.isEnd = false;
      node.word  = null;
      return Object.keys(node.children).length === 0 ? null : node;
    }
    const ch = w[depth];
    node.children[ch] = _del(node.children[ch], w, depth + 1);
    if (!node.children[ch]) delete node.children[ch];
    if (!node.isEnd && Object.keys(node.children).length === 0) return null;
    return node;
  }
  _del(root, word.toLowerCase(), 0);
  return root;
}

export function trieAutocomplete(root, prefix) {
  let node = root;
  for (const ch of prefix.toLowerCase()) {
    if (!node.children[ch]) return [];
    node = node.children[ch];
  }
  const results = [];
  function dfs(n, path) {
    if (n.isEnd) results.push(path);
    if (results.length >= 8) return;
    for (const ch of Object.keys(n.children).sort()) dfs(n.children[ch], path + ch);
  }
  dfs(node, prefix.toLowerCase());
  return results;
}

export function getAllWords(root) {
  const words = [];
  function dfs(node, path) {
    if (node.isEnd) words.push(path);
    for (const ch of Object.keys(node.children).sort()) dfs(node.children[ch], path + ch);
  }
  dfs(root, '');
  return words;
}

export function buildDefaultTrie() {
  let root = createTrie();
  ['apple','app','apply','apt','bat','ball','band','cat','car','card','code','core'].forEach((w) => {
    root = trieInsert(root, w);
  });
  return root;
}
