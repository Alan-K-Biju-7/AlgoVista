import { buildVisualSteps } from './visualStepBuilder';
import twoSum from './neetcode150/problems/arrays-hashing/two-sum';
import validAnagram from './neetcode150/problems/arrays-hashing/valid-anagram';
import reverseLinkedList from './neetcode150/problems/linked-list/reverse-linked-list';
import numberOfIslands from './neetcode150/problems/graphs/number-of-islands';

describe('buildVisualSteps', () => {
  test('builds a concrete complement trace for Two Sum', () => {
    const steps = buildVisualSteps(twoSum);

    expect(steps[0]).toEqual(
      expect.objectContaining({
        title: 'Prepare complement memory',
        focus: expect.stringContaining('value -> index'),
      })
    );
    expect(steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Complement found',
          focus: expect.stringContaining('Return [0, 1]'),
          visual: expect.objectContaining({
            state: expect.arrayContaining([['return', '[0, 1]']]),
          }),
        }),
      ])
    );
  });

  test('builds count and match steps for Valid Anagram', () => {
    const steps = buildVisualSteps(validAnagram);
    const titles = steps.map((step) => step.title);

    expect(titles).toEqual(
      expect.arrayContaining([
        'Compare lengths',
        'Count "a" from s',
        'Match "n" from t',
        'All counts balanced',
      ])
    );
    expect(steps[steps.length - 1].visual.state).toContainEqual(['answer', true]);
  });

  test('falls back to a five-step visual plan for unspecialized problems', () => {
    const steps = buildVisualSteps({
      id: 'new-pattern',
      title: 'New Pattern',
      pattern: 'Custom',
      description: 'Use a custom approach to solve the task.',
      pattern_explanation: 'Keep only the useful state.',
      examples: [{ input: 'nums = [1,2,3]', output: '6' }],
      testCases: [{ input: [[1, 2, 3]], expected: 6 }],
      hints: ['Scan the input.', 'Update the answer.', 'Return the result.'],
    });

    expect(steps).toHaveLength(5);
    expect(steps.map((step) => step.title)).toEqual([
      'Understand the mission',
      'Name the state',
      'Advance one decision',
      'Lock the invariant',
      'Return the answer',
    ]);
  });

  test('uses category-specific visuals for non-bespoke problem families', () => {
    expect(buildVisualSteps(reverseLinkedList)[0].visual).toEqual(
      expect.objectContaining({
        kind: 'linked-list',
        nodes: expect.arrayContaining([expect.objectContaining({ value: 1 })]),
      })
    );

    expect(buildVisualSteps(numberOfIslands)[0].visual).toEqual(
      expect.objectContaining({
        kind: 'matrix',
        mode: 'grid',
      })
    );
  });
});
