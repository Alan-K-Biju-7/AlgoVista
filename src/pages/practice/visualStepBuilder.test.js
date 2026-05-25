import { buildVisualSteps } from './visualStepBuilder';
import twoSum from './neetcode150/problems/arrays-hashing/two-sum';
import validAnagram from './neetcode150/problems/arrays-hashing/valid-anagram';
import groupAnagrams from './neetcode150/problems/arrays-hashing/group-anagrams';
import productExceptSelf from './neetcode150/problems/arrays-hashing/product-except-self';
import stockProfit from './neetcode150/problems/sliding-window/best-time-to-buy-and-sell-stock';
import longestSubstring from './neetcode150/problems/sliding-window/longest-substring-without-repeating-characters';
import dailyTemperatures from './neetcode150/problems/stack/daily-temperatures';
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

  test('builds concrete visual narratives for major interview patterns', () => {
    expect(buildVisualSteps(groupAnagrams).map((step) => step.title)).toEqual(
      expect.arrayContaining(['Create signature buckets', 'Place "eat" under "aet"', 'Return grouped buckets'])
    );

    expect(buildVisualSteps(productExceptSelf)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Write prefix for index 0' }),
        expect.objectContaining({ title: 'Fold suffix into index 3' }),
        expect.objectContaining({ focus: expect.stringContaining('[24,12,8,6]') }),
      ])
    );

    expect(buildVisualSteps(stockProfit)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'New cheapest buy: 1' }),
        expect.objectContaining({ focus: expect.stringContaining('Return 5') }),
      ])
    );

    expect(buildVisualSteps(longestSubstring)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Duplicate "a" found' }),
        expect.objectContaining({ focus: expect.stringContaining('Return 3') }),
      ])
    );

    expect(buildVisualSteps(dailyTemperatures)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: '74 warms day 0' }),
        expect.objectContaining({ focus: expect.stringContaining('[1,1,4,2,1,1,0,0]') }),
      ])
    );

    expect(buildVisualSteps(reverseLinkedList)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Save next after 1' }),
        expect.objectContaining({ focus: expect.stringContaining('[5, 4, 3, 2, 1]') }),
      ])
    );

    expect(buildVisualSteps(numberOfIslands)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Island 1 starts at (0, 0)' }),
        expect.objectContaining({ focus: expect.stringContaining('Return 1') }),
      ])
    );
  });
});
