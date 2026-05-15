/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'course-schedule',
  title: 'Course Schedule',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(V + E)',
  spaceO: 'O(V + E)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return true if it is possible to finish all courses given the prerequisite pairs.',
  examples: [
    { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
    { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' },
  ],
  testCases: [
    { input: [2, [[1,0]]], expected: true },
    { input: [2, [[1,0],[0,1]]], expected: false },
    { input: [5, [[1,4],[2,4],[3,1],[3,2]]], expected: true },
  ],
  hints: [
    'A cycle in prerequisites makes completion impossible.',
    'Use DFS state tracking or topological sorting to detect cycles.',
    'Visited and current-path states should be tracked separately.',
  ],
  pattern_explanation:
    'This is directed cycle detection in a prerequisite graph, where a cycle means no valid course ordering exists.',
  solution: `function solve(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) graph[a].push(b);

  const visit = new Set();
  const path = new Set();

  function dfs(course) {
    if (path.has(course)) return false;
    if (visit.has(course)) return true;

    path.add(course);
    for (const pre of graph[course]) {
      if (!dfs(pre)) return false;
    }
    path.delete(course);
    visit.add(course);
    return true;
  }

  for (let c = 0; c < numCourses; c++) {
    if (!dfs(c)) return false;
  }

  return true;
}`,
};
