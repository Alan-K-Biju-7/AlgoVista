import {
  getDailyTrainingPlan,
  getDifficultySummaries,
  getFocusQueue,
  getMasterySignal,
  getPhaseSummaries,
  getProgressSummary,
  getRecommendedProblem,
  getReviewQueue,
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

  test('builds mastery analytics, review queue, and a daily training plan', () => {
    expect(getDifficultySummaries(topics, getStatus)).toEqual([
      expect.objectContaining({ difficulty: 'Easy', total: 0, solved: 0, pct: 0 }),
      expect.objectContaining({ difficulty: 'Medium', total: 0, solved: 0, pct: 0 }),
      expect.objectContaining({ difficulty: 'Hard', total: 0, solved: 0, pct: 0 }),
    ]);

    const richerTopics = {
      arrays: {
        problems: [
          { id: 'easy-done', title: 'Easy Done', difficulty: 'Easy' },
          { id: 'easy-fresh', title: 'Easy Fresh', difficulty: 'Easy' },
          { id: 'medium-active', title: 'Medium Active', difficulty: 'Medium' },
          { id: 'hard-bookmark', title: 'Hard Bookmark', difficulty: 'Hard' },
        ],
      },
    };
    const richerStatus = {
      'easy-done': 'solved',
      'medium-active': 'attempted',
    };
    const richerGetStatus = (id) => richerStatus[id] || 'unsolved';
    const isBookmarked = (id) => id === 'hard-bookmark';

    expect(getDifficultySummaries(richerTopics, richerGetStatus)).toEqual([
      expect.objectContaining({ difficulty: 'Easy', total: 2, solved: 1, fresh: 1, pct: 50 }),
      expect.objectContaining({ difficulty: 'Medium', total: 1, attempted: 1 }),
      expect.objectContaining({ difficulty: 'Hard', total: 1, fresh: 1 }),
    ]);
    expect(getReviewQueue(richerTopics, richerGetStatus, isBookmarked).map((problem) => problem.id)).toEqual([
      'hard-bookmark',
      'medium-active',
      'easy-fresh',
    ]);
    expect(getDailyTrainingPlan(richerTopics, richerGetStatus, isBookmarked).map((item) => item.problem.id)).toEqual([
      'easy-fresh',
      'medium-active',
      'hard-bookmark',
    ]);
    expect(getMasterySignal(richerTopics, richerGetStatus)).toEqual(
      expect.objectContaining({ score: 34, label: 'Momentum' })
    );
  });
});
