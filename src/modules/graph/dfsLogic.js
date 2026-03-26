export function generateDFSSteps(adjList, startId) {
  const steps = [];
  const visited   = [];
  const stack     = [startId];
  const treeEdges = [];

  steps.push({ visited: [...visited], frontier: [...stack], current: null, treeEdges: [...treeEdges],
    message: `DFS from ${startId}. Push onto stack — DFS dives as deep as possible before backtracking.` });

  while (stack.length > 0) {
    const curr = stack.pop();

    if (visited.includes(curr)) {
      steps.push({ visited: [...visited], frontier: [...stack], current: curr, treeEdges: [...treeEdges],
        message: `Pop ${curr} — already visited, skip it. This happens with undirected graphs.` });
      continue;
    }

    visited.push(curr);
    const neighbors = adjList[curr] || [];

    steps.push({ visited: [...visited], frontier: [...stack], current: curr, treeEdges: [...treeEdges],
      message: `Pop ${curr}. Mark visited. Neighbors: [${neighbors.join(', ')}] — push unvisited onto stack.` });

    const toVisit = [...neighbors].reverse();
    for (const nb of toVisit) {
      if (!visited.includes(nb)) {
        stack.push(nb);
        treeEdges.push({ from: curr, to: nb });

        steps.push({ visited: [...visited], frontier: [...stack], current: curr, treeEdges: [...treeEdges],
          message: `Push unvisited neighbor ${nb} onto stack. DFS will explore it next.` });
      }
    }
  }

  steps.push({ visited: [...visited], frontier: [], current: null, treeEdges: [...treeEdges],
    message: `DFS complete ✓  Visited ${visited.length} node(s): ${visited.join(' → ')}` });

  return steps;
}
