export function generateSearchSteps(root, word) {
  const steps = [];
  const w = word.toLowerCase();
  const pathSoFar = [];

  steps.push({
    root, highlightPath: [], highlightChar: null, phase: 'start', suggestions: [],
    message: `Search "${w}". Follow each character from root. If any node is missing — not found.`,
  });

  let node = root;
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    pathSoFar.push(ch);
    if (!node.children[ch]) {
      steps.push({
        root, highlightPath: [...pathSoFar], highlightChar: ch, phase: 'notfound', suggestions: [],
        message: `'${ch}' node not found at depth ${i + 1}. "${w}" is not in the trie.`,
      });
      return steps;
    }
    node = node.children[ch];
    steps.push({
      root, highlightPath: [...pathSoFar], highlightChar: ch, phase: 'walk', suggestions: [],
      message: `Found '${ch}' at depth ${i + 1}. Continue.`,
    });
  }

  if (node.isEnd) {
    steps.push({
      root, highlightPath: [...pathSoFar], highlightChar: null, phase: 'found', suggestions: [],
      message: `Reached end of "${w}" and isEnd = true ✓  Word exists in the trie.`,
    });
  } else {
    steps.push({
      root, highlightPath: [...pathSoFar], highlightChar: null, phase: 'prefix', suggestions: [],
      message: `Reached end of "${w}" but isEnd = false. "${w}" is a prefix, not a complete word.`,
    });
  }

  return steps;
}
