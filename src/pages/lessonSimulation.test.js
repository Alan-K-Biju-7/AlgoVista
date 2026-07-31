import { buildLessonSimulation, clampSimulationStep } from './lessonSimulation';

const genericLesson = {
  visual: 'graph',
  coreIdea: 'Graphs model relationships.',
  mentalModel: 'Track the frontier and visited nodes.',
  reasoningSteps: ['Choose a start node.', 'Visit each neighbor.', 'Mark nodes visited.'],
};

describe('lessonSimulation', () => {
  test('builds a meaningful binary-search trace', () => {
    const frames = buildLessonSimulation({ ...genericLesson, visual: 'binary-search' });

    expect(frames).toHaveLength(3);
    expect(frames[0].state).toContain('M = 3');
    expect(frames[1].cutIndexes).toEqual([0, 1, 2, 3]);
    expect(frames[2].title).toBe('Find the target');
    expect(frames[2].activeIndexes).toEqual([4]);
  });

  test('uses lesson reasoning steps for concepts without a bespoke trace', () => {
    const frames = buildLessonSimulation(genericLesson);

    expect(frames).toHaveLength(3);
    expect(frames[0].title).toBe('Choose a start node');
    expect(frames[2].doneIndexes).toEqual([0, 1]);
    expect(frames[2].invariant).toBe(genericLesson.mentalModel);
  });

  test('clamps navigation to available frames', () => {
    expect(clampSimulationStep(-2, 4)).toBe(0);
    expect(clampSimulationStep(8, 4)).toBe(3);
    expect(clampSimulationStep(2.8, 4)).toBe(2);
    expect(clampSimulationStep(Number.NaN, 0)).toBe(0);
  });
});
