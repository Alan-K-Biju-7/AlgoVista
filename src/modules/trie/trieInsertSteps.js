import { trieInsert } from './trieLogic';

export function generateInsertSteps(root, word) {
  const steps = [];
  const w = word.toLowerCase();
  const pathSoFar = [];

  steps.push({
    root, highlightPath: [], highlightChar: null, phase: 'start', suggestions: [],
    message: `Insert "${w}". Walk character by character from root — create nodes for any missing letters.`,
  });

  let node = root;
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    pathSoFar.push(ch);
    const exists = !!node.children[ch];
    steps.push({
      root, highlightPath: [...pathSoFar], highlightChar: ch, phase: 'walk', suggestions: [],
      message: exists
        ? `'${ch}' node already exists — traverse into it.`
        : `'${ch}' node missing — create new TrieNode for '${ch}'.`,
    });
    if (!exists) node.children[ch] = { children: {}, isEnd: false, word: null };
    node = node.children[ch];
  }

  const newRoot = trieInsert(root, w);
  steps.push({
    root: newRoot, highlightPath: [...pathSoFar], highlightChar: null, phase: 'done', suggestions: [],
    message: `Mark last node as end-of-word ✓  "${w}" inserted. isEnd = true.`,
  });

  return steps;
}
