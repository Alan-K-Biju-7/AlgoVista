import {
  NEETCODE150,
  NEETCODE_TOPICS,
  NEETCODE_TOPIC_ORDER,
  NEETCODE_TOPIC_META,
  getNeetcode150Problems,
  isNeetcode150,
} from './index';
import { runTests } from '../testRunner';

describe('NeetCode 150 problem bank', () => {
  test('ships exactly 150 uniquely identified problems across configured topics', () => {
    const ids = NEETCODE150.map((problem) => problem.id);

    expect(NEETCODE150).toHaveLength(150);
    expect(new Set(ids).size).toBe(150);
    expect(getNeetcode150Problems()).toBe(NEETCODE150);
    expect(isNeetcode150(ids[0])).toBe(true);
    expect(isNeetcode150('not-a-real-problem')).toBe(false);
  });

  test('keeps topic metadata and problem ownership in sync', () => {
    expect(NEETCODE_TOPICS.map((topic) => topic.id)).toEqual(NEETCODE_TOPIC_ORDER);

    for (const topic of NEETCODE_TOPICS) {
      expect(topic).toEqual(expect.objectContaining(NEETCODE_TOPIC_META[topic.id]));
      expect(topic.problems.length).toBeGreaterThan(0);

      for (const problem of topic.problems) {
        expect(problem).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            difficulty: expect.stringMatching(/^(Easy|Medium|Hard)$/),
            description: expect.any(String),
            solution: expect.any(String),
            testCases: expect.any(Array),
            hints: expect.any(Array),
          })
        );
        expect(problem.concept).toBe(topic.id);
        expect(problem.testCases.length).toBeGreaterThan(0);
      }
    }
  });

  test('all bundled reference solutions pass their own executable test cases', () => {
    const failures = [];

    for (const problem of NEETCODE150) {
      const results = runTests(problem.solution, problem.testCases);
      results.forEach((result, caseIndex) => {
        if (!result.passed) {
          failures.push({
            id: problem.id,
            caseIndex,
            input: result.input,
            expected: result.expected,
            got: result.got,
            error: result.error,
          });
        }
      });
    }

    expect(failures).toEqual([]);
  });
});
