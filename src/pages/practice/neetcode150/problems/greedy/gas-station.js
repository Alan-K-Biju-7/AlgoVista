export default {
  id: 'gas-station',
  title: 'Gas Station',
  difficulty: 'Medium',
  pattern: 'Greedy',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array',
  concept: 'greedy',
  description:
    'Return the starting gas station index if you can complete the circuit once, otherwise return -1.',
  examples: [
    { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3' },
    { input: 'gas = [2,3,4], cost = [3,4,3]', output: '-1' },
  ],
  testCases: [
    { input: [[1,2,3,4,5], [3,4,5,1,2]], expected: 3 },
    { input: [[2,3,4], [3,4,3]], expected: -1 },
    { input: [[5], [4]], expected: 0 },
  ],
  hints: [
    'If total gas is less than total cost, no solution exists.',
    'Track the running surplus while scanning stations from left to right.',
    'When surplus drops below zero, reset the candidate start to the next station.',
  ],
  pattern_explanation:
    'The greedy idea is that any segment that leaves you with negative fuel cannot contain a valid starting station, so you skip the whole segment at once.',
  solution: `function solve(gas, cost) {
  const totalGas = gas.reduce((a, b) => a + b, 0);
  const totalCost = cost.reduce((a, b) => a + b, 0);
  if (totalGas < totalCost) return -1;

  let start = 0;
  let tank = 0;

  for (let i = 0; i < gas.length; i++) {
    tank += gas[i] - cost[i];
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }

  return start;
}`,
};
