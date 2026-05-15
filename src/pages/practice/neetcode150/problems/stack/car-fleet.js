/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'car-fleet',
  title: 'Car Fleet',
  difficulty: 'Medium',
  pattern: 'Stack',
  timeO: 'O(n log n)',
  spaceO: 'O(n)',
  viz: 'stack',
  concept: 'stack',
  description:
    'Return the number of car fleets that will arrive at the destination.',
  examples: [
    { input: 'target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]', output: '3' },
    { input: 'target = 10, position = [3], speed = [3]', output: '1' },
  ],
  testCases: [
    { input: [12, [10,8,0,5,3], [2,4,1,1,3]], expected: 3 },
    { input: [10, [3], [3]], expected: 1 },
    { input: [100, [0,2,4], [4,2,1]], expected: 1 },
  ],
  hints: [
    'Sort cars by position from closest to target to farthest.',
    'Convert each car into the time it needs to reach the target.',
    'A car that reaches no later than the fleet ahead merges into it.',
  ],
  pattern_explanation:
    'A stack of arrival times models fleets: only cars with strictly larger time form a new fleet, while smaller or equal times merge with the fleet ahead.',
  solution: `function solve(target, position, speed) {
  const cars = position.map((p, i) => [p, speed[i]]);
  cars.sort((a, b) => b[0] - a[0]);

  const stack = [];

  for (const [p, s] of cars) {
    const time = (target - p) / s;
    stack.push(time);

    if (stack.length >= 2 && stack[stack.length - 1] <= stack[stack.length - 2]) {
      stack.pop();
    }
  }

  return stack.length;
}`,
};
