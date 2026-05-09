export default {
  id: 'partition-labels',
  title: 'Partition Labels',
  difficulty: 'Medium',
  pattern: 'Greedy',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'string',
  concept: 'greedy',
  description:
    'Return the sizes of as many partitions as possible so that each letter appears in at most one part.',
  examples: [
    { input: 's = "ababcbacadefegdehijhklij"', output: '[9,7,8]' },
    { input: 's = "eccbbbbdec"', output: '[10]' },
  ],
  testCases: [
    { input: ['ababcbacadefegdehijhklij'], expected: [9,7,8] },
    { input: ['eccbbbbdec'], expected: [10] },
    { input: ['abc'], expected: [1,1,1] },
  ],
  hints: [
    'Find the last occurrence of every character first.',
    'As you scan the string, track how far the current partition must extend.',
    'When your index reaches that farthest point, you can safely cut a partition.',
  ],
  pattern_explanation:
    'The greedy choice is to close a partition at the earliest safe position, which is the farthest last occurrence among characters seen in the current segment.',
  solution: `function solve(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) {
    last[s[i]] = i;
  }

  const res = [];
  let size = 0;
  let end = 0;

  for (let i = 0; i < s.length; i++) {
    size++;
    end = Math.max(end, last[s[i]]);
    if (i === end) {
      res.push(size);
      size = 0;
    }
  }

  return res;
}`,
};
