export function generateBFSSteps(adjList, startId) {
  const steps = [];
  const visited  = [];
  const queue    = [startId];
  const treeEdges = [];
  visited.push(startId);

  steps.push({ visited: [...visited], frontier: [...queue], current: null, treeEdges: [...treeEdges],
    message: `BFS from ${startId}. Enqueue it — BFS explores level by level using a queue.` });

  while (queue.length > 0) {
    const curr = queue.shift();
    const neighbors = adjList[curr] || [];

    steps.push({ visited: [...visited], frontier: [...queue], current: curr, treeEdges: [...treeEdges],
      message: `Dequeue ${curr}. Neighbors: [${neighbors.join(', ')}]. Check each one.` });

    for (const nb of neighbors) {
      if (!visited.includes(nb)) {
        visited.push(nb);
        queue.push(nb);
        treeEdges.push({ from: curr, to: nb });

        steps.push({ visited: [...visited], frontier: [...queue], current: curr, treeEdges: [...treeEdges],
          message: `${nb} is unvisited — enqueue it. BFS will visit it after all level-${visited.length - 2} nodes.` });
      } else {
        steps.push({ visited: [...visited], frontier: [...queue], current: curr, treeEdges: [...treeEdges],
          message: `${nb} already visited — skip.` });
      }
    }
  }

  steps.push({ visited: [...visited], frontier: [], current: null, treeEdges: [...treeEdges],
    message: `BFS complete ✓  Visited ${visited.length} node(s): ${visited.join(' → ')}` });

  return steps;
}
