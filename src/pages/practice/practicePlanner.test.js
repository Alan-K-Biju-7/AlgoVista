import {
  getFocusQueue,
  getPhaseSummaries,
  getProgressSummary,
  getRecommendedProblem,
} from './practicePlanner';

const topics = {
  arrays: {
    id: 'arrays',
    phase: 'P1',
    problems: [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
      { id: 'c', title: 'C' },
    ],
  },
  trees: {
    id: 'trees',
    phase: 'P2',
    problems: [
      { id: 'd', title: 'D' },
    ],
  },
};

const statuses = { a: 'solved', b: 'attempted', c: 'unsolved', d: 'unsolved' };
const getStatus = (id) => statuses[id] || 'unsolved';

describe('practicePlanner', () => {
  test('summarizes progress and phase completion', () => {
    expect(getProgressSummary(topics, getStatus)).toEqual(
      expect.objectContaining({
        solved: 1,
        attempted: 1,
        fresh: 2,
        pct: 25,
      })
    );

    expect(
      getPhaseSummaries(
        {
          P1: { id: 'P1', label: 'Linear', color: '#0f0' },
          P2: { id: 'P2', label: 'Trees', color: '#00f' },
        },
        Object.values(topics),
        getStatus
      )
    ).toEqual([
      expect.objectContaining({ id: 'P1', solved: 1, total: 3, pct: 33 }),
      expect.objectContaining({ id: 'P2', solved: 0, total: 1, pct: 0 }),
    ]);
  });

  test('prioritizes resumed work and selects the next useful mission', () => {
    expect(getFocusQueue(topics.arrays, getStatus).map((problem) => problem.id)).toEqual(['b', 'c']);

    expect(
      getRecommendedProblem({
        allProblems: topics,
        topic: topics.arrays,
        getStatus,
        currentProblemId: 'b',
      })?.id
    ).toBe('c');
  });
});
