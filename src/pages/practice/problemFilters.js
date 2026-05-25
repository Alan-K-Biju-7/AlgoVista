const difficultyRank = { Easy: 0, Medium: 1, Hard: 2 };
const statusRank = { attempted: 0, unsolved: 1, solved: 2 };

function matchesText(problem, query) {
  if (!query.trim()) return true;
  const needle = query.trim().toLowerCase();
  return [
    problem.title,
    problem.pattern,
    problem.difficulty,
    problem.description,
    ...(problem.hints || []),
  ].some((value) => String(value || '').toLowerCase().includes(needle));
}

function compareByRecommended(a, b, getStatus) {
  const statusDiff = (statusRank[getStatus(a.id)] ?? 9) - (statusRank[getStatus(b.id)] ?? 9);
  if (statusDiff !== 0) return statusDiff;

  const difficultyDiff = (difficultyRank[a.difficulty] ?? 9) - (difficultyRank[b.difficulty] ?? 9);
  if (difficultyDiff !== 0) return difficultyDiff;

  return a.title.localeCompare(b.title);
}

export function filterProblems(
  problems,
  filters,
  getStatus,
  isBookmarked,
  hasTrace
) {
  const {
    query = '',
    status = 'all',
    difficulty = 'all',
    capability = 'all',
    sort = 'recommended',
  } = filters || {};

  const filtered = problems.filter((problem) => {
    const problemStatus = getStatus(problem.id);
    if (!matchesText(problem, query)) return false;
    if (status === 'bookmarked' && !isBookmarked(problem.id)) return false;
    if (status !== 'all' && status !== 'bookmarked' && problemStatus !== status) return false;
    if (difficulty !== 'all' && problem.difficulty !== difficulty) return false;
    if (capability === 'trace' && !hasTrace(problem.id)) return false;
    if (capability === 'visual' && hasTrace(problem.id)) return false;
    return true;
  });

  return filtered.sort((a, b) => {
    if (sort === 'difficulty') {
      return (difficultyRank[a.difficulty] ?? 9) - (difficultyRank[b.difficulty] ?? 9) ||
        a.title.localeCompare(b.title);
    }

    if (sort === 'title') return a.title.localeCompare(b.title);

    if (sort === 'status') {
      return (statusRank[getStatus(a.id)] ?? 9) - (statusRank[getStatus(b.id)] ?? 9) ||
        a.title.localeCompare(b.title);
    }

    return compareByRecommended(a, b, getStatus);
  });
}
