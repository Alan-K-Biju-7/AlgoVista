import { trieDelete } from './trieLogic';

export function generateDeleteSteps(root, word) {
  const steps = [];
  const w = word.toLowerCase();
  const pathSoFar = [];

  steps.push({
    root, highlightPath: [], highlightChar: null, phase: 'start', suggestions: [],
    message: `Delete "${w}". First verify it exists, then unmark isEnd. Prune orphan nodes bottom-up.`,
  });

  let node = root;
  let exists = true;
  for (const ch of w) {
    pathSoFar.push(ch);
    if (!node.children[ch]) { exists = false; break; }
    node = node.children[ch];
    steps.push({
      root, highlightPath: [...pathSoFar], highlightChar: ch, phase: 'walk', suggestions: [],
      message: `Traverse '${ch}'.`,
    });
  }

  if (!exists || !node.isEnd) {
    steps.push({
      root, highlightPath: [...pathSoFar], highlightChar: null, phase: 'notfound', suggestions: [],
      message: `"${w}" not found in trie — nothing to delete.`,
    });
    return steps;
  }

  steps.push({
    root, highlightPath: [...pathSoFar], highlightChar: null, phase: 'mark', suggestions: [],
    message: `Found "${w}". Unmark isEnd = false. If this node has no children — prune it and its ancestors.`,
  });

  const newRoot = trieDelete(root, w);
  steps.push({
    root: newRoot, highlightPath: [], highlightChar: null, phase: 'done', suggestions: [],
    message: `Deleted "${w}" ✓  Orphan nodes pruned. Tree updated.`,
  });

  return steps;
}
