export default {
  id: 'merge-triplets-to-form-target-triplet',
  title: 'Merge Triplets to Form Target Triplet',
  difficulty: 'Medium',
  pattern: 'Greedy',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array',
  concept: 'greedy',
  description:
    'Return true if the target triplet can be formed by merging valid triplets.',
  examples: [
    { input: 'triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]', output: 'true' },
    { input: 'triplets = [[3,4,5],[4,5,6]], target = [3,2,5]', output: 'false' },
  ],
  testCases: [
    { input: [[[2,5,3],[1,8,4],[1,7,5]], [2,7,5]], expected: true },
    { input: [[[3,4,5],[4,5,6]], [3,2,5]], expected: false },
    { input: [[[2,5,3],[2,3,4],[1,7,5]], [2,7,5]], expected: true },
  ],
  hints: [
    'Ignore any triplet that exceeds the target in any coordinate.',
    'Among valid triplets, track whether each target coordinate can be matched exactly.',
    'If all three coordinates can be matched, the target is achievable.',
  ],
  pattern_explanation:
    'The greedy filter removes unusable triplets first, then feasibility reduces to covering each target coordinate with some valid triplet.',
  solution: `function solve(triplets, target) {
  let x = false;
  let y = false;
  let z = false;

  for (const [a, b, c] of triplets) {
    if (a > target[0] || b > target[1] || c > target[2]) continue;
    if (a === target[0]) x = true;
    if (b === target[1]) y = true;
    if (c === target[2]) z = true;
  }

  return x && y && z;
}`,
};
