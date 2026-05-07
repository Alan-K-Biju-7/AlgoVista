export default {
  id: 'jump-game-ii',
  title: 'Jump Game II',
  difficulty: 'Medium',
  pattern: 'Greedy',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array',
  concept: 'greedy',
  description:
    'Return the minimum number of jumps needed to reach the last index.',
  examples: [
    { input: 'nums = [2,3,1,1,4]', output: '2' },
    { input: 'nums = [2,3,0,1,4]', output: '2' },
  ],
  testCases: [
    { input: [[2,3,1,1,4]], expected: 2 },
    { input: [[2,3,0,1,4]], expected: 2 },
    { input: [[1,2,1,1,1]], expected: 3 },
  ],
  hints: [
    'All positions reachable with the current jump count form a window.',
    'Within that window, compute the farthest index reachable in one more jump.',
    'When you finish scanning the window, commit one jump and move to the next window.',
  ],
  pattern_explanation:
    'This greedy BFS-like layering finds the minimum jumps by processing all positions reachable in the current number of jumps before taking the next jump.',
  solution: `function solve(nums) {
  let jumps = 0;
  let l = 0;
  let r = 0;

  while (r < nums.length - 1) {
    let farthest = 0;

    for (let i = l; i <= r; i++) {
      farthest = Math.max(farthest, i + nums[i]);
    }

    l = r + 1;
    r = farthest;
    jumps++;
  }

  return jumps;
}`,
};
