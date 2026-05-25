import { buildStoryMode } from './storyMode';

describe('buildStoryMode', () => {
  test('creates a complete guided story from problem metadata', () => {
    const story = buildStoryMode({
      id: 'two-sum',
      title: 'Two Sum',
      concept: 'arrays-hashing',
      difficulty: 'Easy',
      description: 'Return indices of two numbers that add to target.',
      pattern: 'Hash Map',
      pattern_explanation: 'Use a map to remember complements.',
      timeO: 'O(n)',
      spaceO: 'O(n)',
      examples: [{ input: 'nums = [2,7], target = 9', output: '[0,1]' }],
      hints: ['Store previous values.', 'Look for the complement.', 'Return when found.'],
    });

    expect(story.title).toBe('Index Relay: Two Sum');
    expect(story.scenes).toHaveLength(5);
    expect(story.scenes[0].focus).toContain('nums = [2,7], target = 9 -> [0,1]');
    expect(story.checkpoints).toHaveLength(3);
    expect(story.pitfalls.length).toBeGreaterThanOrEqual(2);
  });
});
