import {
  DSA_BEGINNER_CONCEPTS,
  DSA_BEGINNERS_CURRICULUM,
} from './data/dsaBeginnersCurriculum';

test('ships the complete DSA for Beginners curriculum map', () => {
  expect(DSA_BEGINNERS_CURRICULUM).toHaveLength(16);
  expect(DSA_BEGINNER_CONCEPTS.length).toBeGreaterThan(100);
  expect(DSA_BEGINNER_CONCEPTS.map((concept) => concept.title)).toEqual(
    expect.arrayContaining([
      'What is DSA?',
      'Binary Search',
      "Dijkstra's Algorithm",
      'Memoization and Tabulation',
      'KMP and Z Algorithm (String Matching)',
    ])
  );
});
