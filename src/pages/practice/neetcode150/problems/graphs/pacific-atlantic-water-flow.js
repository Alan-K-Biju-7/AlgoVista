/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'pacific-atlantic-water-flow',
  title: 'Pacific Atlantic Water Flow',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(rows * cols)',
  spaceO: 'O(rows * cols)',
  viz: 'grid-search',
  concept: 'graphs',
  description:
    'Return all coordinates where water can flow to both the Pacific and Atlantic oceans.',
  examples: [
    { input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
    { input: 'heights = [[1]]', output: '[[0,0]]' },
  ],
  testCases: [
    {
      input: [[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]],
      expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
    },
    { input: [[[1]]], expected: [[0,0]] },
  ],
  hints: [
    'A direct DFS from every cell repeats too much work.',
    'Instead, start from the Pacific border and Atlantic border separately.',
    'A cell is valid if both traversals can reach it.',
  ],
  pattern_explanation:
    'Reverse-reachability turns ocean flow into two graph traversals from the borders, and the intersection gives cells that can reach both oceans.',
  solution: `function solve(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
  const pac = new Set();
  const atl = new Set();

  function dfs(r, c, seen, prev) {
    const key = r + ',' + c;
    if (
      r < 0 || c < 0 || r >= rows || c >= cols ||
      seen.has(key) ||
      heights[r][c] < prev
    ) return;

    seen.add(key);
    const h = heights[r][c];
    dfs(r + 1, c, seen, h);
    dfs(r - 1, c, seen, h);
    dfs(r, c + 1, seen, h);
    dfs(r, c - 1, seen, h);
  }

  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pac, -Infinity);
    dfs(r, cols - 1, atl, -Infinity);
  }

  for (let c = 0; c < cols; c++) {
    dfs(0, c, pac, -Infinity);
    dfs(rows - 1, c, atl, -Infinity);
  }

  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = r + ',' + c;
      if (pac.has(key) && atl.has(key)) out.push([r, c]);
    }
  }

  return out;
}`,
};
