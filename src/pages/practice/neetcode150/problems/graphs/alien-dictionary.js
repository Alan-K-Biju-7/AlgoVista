/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'alien-dictionary',
  title: 'Alien Dictionary',
  difficulty: 'Hard',
  pattern: 'Graphs',
  timeO: 'O(N + V + E)',
  spaceO: 'O(V + E)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Derive a valid character order from a sorted alien dictionary, or return an empty string if the ordering is invalid.',
  examples: [
    { input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"' },
    { input: 'words = ["z","x","z"]', output: '""' },
  ],
  testCases: [
    { input: [['wrt','wrf','er','ett','rftt']], expected: 'wertf' },
    { input: [['z','x','z']], expected: '' },
    { input: [['abc','ab']], expected: '' },
  ],
  hints: [
    'Compare adjacent words to find the first differing character.',
    'That differing pair gives a precedence edge in the graph.',
    'Then perform topological sort and detect cycles.',
  ],
  pattern_explanation:
    'The sorted dictionary induces ordering constraints between characters, which form a directed graph solved by topological sorting.',
  solution: `function solve(words) {
  const graph = {};
  for (const word of words) {
    for (const ch of word) graph[ch] = new Set();
  }

  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i];
    const b = words[i + 1];
    if (a.length > b.length && a.startsWith(b)) return '';

    const len = Math.min(a.length, b.length);
    for (let j = 0; j < len; j++) {
      if (a[j] !== b[j]) {
        graph[a[j]].add(b[j]);
        break;
      }
    }
  }

  const state = {};
  const out = [];

  function dfs(ch) {
    if (state[ch] === 1) return false;
    if (state[ch] === 2) return true;

    state[ch] = 1;
    for (const nei of graph[ch]) {
      if (!dfs(nei)) return false;
    }
    state[ch] = 2;
    out.push(ch);
    return true;
  }

  for (const ch of Object.keys(graph)) {
    if (!dfs(ch)) return '';
  }

  return out.reverse().join('');
}`,
};
