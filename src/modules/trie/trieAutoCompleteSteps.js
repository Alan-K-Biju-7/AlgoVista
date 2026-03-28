import { trieAutocomplete } from './trieLogic';

export function generateAutoCompleteSteps(root, prefix) {
  const steps = [];
  const p = prefix.toLowerCase();
  const pathSoFar = [];

  steps.push({
    root, highlightPath: [], highlightChar: null, phase: 'start', suggestions: [],
    message: `Autocomplete prefix "${p}". Walk to prefix endpoint, then DFS all subtree words.`,
  });

  let node = root;
  for (const ch of p) {
    pathSoFar.push(ch);
    if (!node.children[ch]) {
      steps.push({
        root, highlightPath: [...pathSoFar], highlightChar: ch, phase: 'notfound', suggestions: [],
        message: `'${ch}' not found — no words start with "${p}".`,
      });
      return steps;
    }
    node = node.children[ch];
    steps.push({
      root, highlightPath: [...pathSoFar], highlightChar: ch, phase: 'walk', suggestions: [],
      message: `Traverse '${ch}' — following prefix path.`,
    });
  }

  const suggestions = trieAutocomplete(root, p);
  steps.push({
    root, highlightPath: [...pathSoFar], highlightChar: null, phase: 'dfs', suggestions,
    message: `Reached prefix endpoint. DFS all children to collect completions.`,
  });

  steps.push({
    root, highlightPath: [...pathSoFar], highlightChar: null, phase: 'done', suggestions,
    message: `Found ${suggestions.length} suggestion(s) for "${p}": ${suggestions.join(', ')}`,
  });

  return steps;
}
