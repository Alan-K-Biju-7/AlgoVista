// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'word-ladder',
  title: 'Word Ladder',
  difficulty: 'Hard',
  pattern: 'Graphs',
  timeO: 'O(n * m * 26)',
  spaceO: 'O(n)',
  viz: 'graph',
  concept: 'graphs',
  description:
    'Return the length of the shortest transformation sequence from beginWord to endWord, changing one character at a time using only words from the list.',
  examples: [
    { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5' },
    { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0' },
  ],
  testCases: [
    { input: ['hit', 'cog', ['hot','dot','dog','lot','log','cog']], expected: 5 },
    { input: ['hit', 'cog', ['hot','dot','dog','lot','log']], expected: 0 },
    { input: ['a', 'c', ['a','b','c']], expected: 2 },
  ],
  hints: [
    'Each word is a graph node.',
    'An edge exists when two words differ by exactly one character.',
    'BFS gives the shortest number of transformations.',
  ],
  pattern_explanation:
    'This is shortest path in an unweighted graph, where each BFS layer represents one transformation step.',
  solution: `function solve(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;

  const queue = [[beginWord, 1]];
  const seen = new Set([beginWord]);

  for (let head = 0; head < queue.length; head++) {
    const [word, distance] = queue[head];
    if (word === endWord) return distance;

    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (words.has(next) && !seen.has(next)) {
          seen.add(next);
          queue.push([next, distance + 1]);
        }
      }
    }
  }

  return 0;
}`,
};
