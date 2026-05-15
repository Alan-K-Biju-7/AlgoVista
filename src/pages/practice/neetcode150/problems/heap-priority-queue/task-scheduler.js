/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'task-scheduler',
  title: 'Task Scheduler',
  difficulty: 'Medium',
  pattern: 'Heap / Priority Queue',
  timeO: 'O(m log 26)',
  spaceO: 'O(26)',
  viz: 'heap',
  concept: 'heap-priority-queue',
  description:
    'Return the minimum CPU intervals needed to complete all tasks with a cooldown of n.',
  examples: [
    { input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: '8' },
    { input: 'tasks = ["A","C","A","B","D","B"], n = 1', output: '6' },
  ],
  testCases: [
    { input: [['A','A','A','B','B','B'], 2], expected: 8 },
    { input: [['A','C','A','B','D','B'], 1], expected: 6 },
    { input: [['A','A','A','B','B','B'], 3], expected: 10 },
  ],
  hints: [
    'You want to run the task with the highest remaining count whenever possible.',
    'A cooldown queue can track when a task becomes available again.',
    'If nothing is available, time must still advance through idle slots.',
  ],
  pattern_explanation:
    'A max-heap prioritizes the most constrained remaining task, while a queue enforces cooldown release times.',
  solution: `function solve(tasks, n) {
  const count = new Map();
  for (const t of tasks) count.set(t, (count.get(t) || 0) + 1);

  const freqs = [...count.values()].sort((a, b) => b - a);
  const maxFreq = freqs[0];
  let maxCount = 0;

  for (const f of freqs) {
    if (f === maxFreq) maxCount++;
  }

  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
}`,
};
