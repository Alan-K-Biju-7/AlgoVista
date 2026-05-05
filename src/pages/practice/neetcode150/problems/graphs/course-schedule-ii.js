export default {
  id: 'course-schedule-ii',
  title: 'Course Schedule II',
  difficulty: 'Medium',
  pattern: 'Graphs',
  timeO: 'O(V + E)',
  spaceO: 'O(V + E)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return any valid ordering of courses that satisfies the prerequisite constraints, or an empty array if impossible.',
  examples: [
    { input: 'numCourses = 2, prerequisites = [[1,0]]', output: '[0,1]' },
    { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,1,2,3]' },
  ],
  testCases: [
    { input: [2, [[1,0]]], expected: [0,1] },
    { input: [4, [[1,0],[2,0],[3,1],[3,2]]], expected: [0,1,2,3] },
    { input: [1, []], expected: [0] },
  ],
  hints: [
    'This is topological sorting on the prerequisite graph.',
    'Courses with no remaining prerequisites can be taken first.',
    'If you cannot process all courses, a cycle exists.',
  ],
  pattern_explanation:
    'Topological sort produces a valid dependency order in a directed acyclic graph and fails when a cycle blocks completion.',
  solution: `function solve(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);

  for (const [a, b] of prerequisites) {
    graph[b].push(a);
    indegree[a]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length) {
    const course = queue.shift();
    order.push(course);

    for (const next of graph[course]) {
      indegree[next]--;
      if (indegree[next] === 0) queue.push(next);
    }
  }

  return order.length === numCourses ? order : [];
}`,
};
