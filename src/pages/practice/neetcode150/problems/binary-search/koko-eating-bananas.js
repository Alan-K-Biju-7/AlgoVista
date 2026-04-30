export default {
  id: 'koko-eating-bananas',
  title: 'Koko Eating Bananas',
  difficulty: 'Medium',
  pattern: 'Binary Search',
  timeO: 'O(n log m)',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'binary-search',
  description:
    'Return the minimum integer eating speed k such that Koko can finish all banana piles within h hours.',
  examples: [
    { input: 'piles = [3,6,7,11], h = 8', output: '4' },
    { input: 'piles = [30,11,23,4,20], h = 5', output: '30' },
  ],
  testCases: [
    { input: [[3,6,7,11], 8], expected: 4 },
    { input: [[30,11,23,4,20], 5], expected: 30 },
    { input: [[30,11,23,4,20], 6], expected: 23 },
  ],
  hints: [
    'A higher speed never makes the schedule worse.',
    'That means the answer space is monotonic.',
    'Binary search the smallest speed that works.',
  ],
  pattern_explanation:
    'This is binary search on a monotonic predicate: if a speed works, any larger speed also works.',
  solution: `function solve(piles, h) {
  let l = 1;
  let r = Math.max(...piles);
  let ans = r;

  const canFinish = (k) => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / k);
    }
    return hours <= h;
  };

  while (l <= r) {
    const m = Math.floor((l + r) / 2);

    if (canFinish(m)) {
      ans = m;
      r = m - 1;
    } else {
      l = m + 1;
    }
  }

  return ans;
}`,
};
