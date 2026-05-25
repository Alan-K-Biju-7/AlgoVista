import { filterProblems } from './problemFilters';

const problems = [
  { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', pattern: 'Arrays & Hashing', description: 'Find a pair.', hints: ['Use a map'] },
  { id: 'three-sum', title: '3Sum', difficulty: 'Medium', pattern: 'Two Pointers', description: 'Find triples.', hints: [] },
  { id: 'median', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', pattern: 'Binary Search', description: 'Partition arrays.', hints: [] },
];

const status = { 'two-sum': 'solved', 'three-sum': 'attempted', median: 'unsolved' };
const bookmarked = new Set(['median']);

describe('filterProblems', () => {
  test('filters by text, status, difficulty, bookmark, and trace support', () => {
    expect(
      filterProblems(
        problems,
        { query: 'sum', status: 'attempted', difficulty: 'Medium', capability: 'all' },
        (id) => status[id],
        (id) => bookmarked.has(id),
        () => false
      ).map((problem) => problem.id)
    ).toEqual(['three-sum']);

    expect(
      filterProblems(
        problems,
        { status: 'bookmarked' },
        (id) => status[id],
        (id) => bookmarked.has(id),
        () => false
      ).map((problem) => problem.id)
    ).toEqual(['median']);

    expect(
      filterProblems(
        problems,
        { capability: 'trace' },
        (id) => status[id],
        () => false,
        (id) => id === 'two-sum'
      ).map((problem) => problem.id)
    ).toEqual(['two-sum']);
  });

  test('sorts recommended work before solved missions', () => {
    expect(
      filterProblems(
        problems,
        { sort: 'recommended' },
        (id) => status[id],
        () => false,
        () => false
      ).map((problem) => problem.id)
    ).toEqual(['three-sum', 'median', 'two-sum']);
  });
});
