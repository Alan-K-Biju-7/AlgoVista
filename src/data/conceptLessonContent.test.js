import { getConceptLesson } from './conceptLessonContent';
import { getBeginnerConceptById } from './dsaBeginnersCurriculum';

test('non-array lessons include useful cost guidance and a guided dry run', () => {
  const graphConcept = getBeginnerConceptById('graphs-bfs-breadth-first-search');
  const lesson = getConceptLesson(graphConcept);

  expect(lesson.complexity.time).toContain('O(V + E)');
  expect(lesson.complexity.space).toContain('O(V + E)');
  expect(lesson.dryRun).toHaveLength(4);
  expect(lesson.intuition).toBeTruthy();
});
