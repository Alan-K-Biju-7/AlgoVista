/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'reconstruct-itinerary',
  title: 'Reconstruct Itinerary',
  difficulty: 'Hard',
  pattern: 'Graphs',
  timeO: 'O(E log E)',
  spaceO: 'O(E)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Reconstruct the itinerary starting from JFK using all tickets exactly once and choosing the lexicographically smallest valid route.',
  examples: [
    { input: 'tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]', output: '["JFK","MUC","LHR","SFO","SJC"]' },
    { input: 'tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]', output: '["JFK","ATL","JFK","SFO","ATL","SFO"]' },
  ],
  testCases: [
    {
      input: [[['MUC','LHR'],['JFK','MUC'],['SFO','SJC'],['LHR','SFO']]],
      expected: ['JFK','MUC','LHR','SFO','SJC']
    },
    {
      input: [[['JFK','SFO'],['JFK','ATL'],['SFO','ATL'],['ATL','JFK'],['ATL','SFO']]],
      expected: ['JFK','ATL','JFK','SFO','ATL','SFO']
    }
  ],
  hints: [
    'You must use every edge exactly once.',
    'That suggests an Eulerian-path style traversal.',
    'Sort destinations so the DFS uses lexicographically smallest choices first.',
  ],
  pattern_explanation:
    'Hierholzer-style DFS builds the route in reverse while consuming edges exactly once, and sorted neighbors enforce lexical order.',
  solution: `function solve(tickets) {
  const graph = new Map();

  tickets.sort().reverse();
  for (const [src, dst] of tickets) {
    if (!graph.has(src)) graph.set(src, []);
    graph.get(src).push(dst);
  }

  const route = [];

  function dfs(src) {
    const dests = graph.get(src) || [];
    while (dests.length) {
      dfs(dests.pop());
    }
    route.push(src);
  }

  dfs('JFK');
  return route.reverse();
}`,
};
