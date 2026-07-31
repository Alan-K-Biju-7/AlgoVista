export function getAllPracticeProblems(allProblems) {
  return Object.values(allProblems).flatMap((topic) => topic.problems || []);
}

const difficultyOrder = { Easy: 0, Medium: 1, Hard: 2 };
const statusWeight = { attempted: 0, unsolved: 1, solved: 9 };

export function getProgressSummary(allProblems, getStatus) {
  const all = getAllPracticeProblems(allProblems);
  const solved = all.filter((problem) => getStatus(problem.id) === 'solved').length;
  const attempted = all.filter((problem) => getStatus(problem.id) === 'attempted').length;
  const pct = all.length ? Math.round((solved / all.length) * 100) : 0;

  return {
    all,
    solved,
    attempted,
    fresh: all.length - solved - attempted,
    pct,
  };
}

export function getPhaseSummaries(phases, topics, getStatus) {
  return Object.values(phases).map((phase) => {
    const phaseProblems = topics
      .filter((topic) => topic.phase === phase.id)
      .flatMap((topic) => topic.problems || []);
    const phaseSolved = phaseProblems.filter((problem) => getStatus(problem.id) === 'solved').length;

    return {
      ...phase,
      solved: phaseSolved,
      total: phaseProblems.length,
      pct: phaseProblems.length ? Math.round((phaseSolved / phaseProblems.length) * 100) : 0,
    };
  });
}

export function getFocusQueue(topic, getStatus, limit = 3) {
  const problems = topic?.problems || [];
  const active = problems.filter((problem) => getStatus(problem.id) === 'attempted');
  const fresh = problems.filter((problem) => getStatus(problem.id) === 'unsolved');
  const fallback = problems.filter((problem) => getStatus(problem.id) !== 'solved');

  return [...active, ...fresh, ...fallback]
    .filter((problem, index, items) => items.findIndex((item) => item.id === problem.id) === index)
    .slice(0, limit);
}

export function getRecommendedProblem({
  allProblems,
  topic,
  getStatus,
  currentProblemId = null,
}) {
  const topicProblems = topic?.problems || [];
  const all = getAllPracticeProblems(allProblems);
  const sameTopicStart = currentProblemId
    ? topicProblems.findIndex((problem) => problem.id === currentProblemId) + 1
    : 0;
  const sameTopicCandidates = [
    ...topicProblems.slice(Math.max(0, sameTopicStart)),
    ...topicProblems.slice(0, Math.max(0, sameTopicStart)),
  ];

  return (
    sameTopicCandidates.find(
      (problem) => problem.id !== currentProblemId && getStatus(problem.id) !== 'solved'
    ) ||
    all.find((problem) => problem.id !== currentProblemId && getStatus(problem.id) !== 'solved') ||
    topicProblems.find((problem) => problem.id !== currentProblemId) ||
    null
  );
}

export function getDifficultySummaries(allProblems, getStatus) {
  const all = getAllPracticeProblems(allProblems);

  return ['Easy', 'Medium', 'Hard'].map((difficulty) => {
    const problems = all.filter((problem) => problem.difficulty === difficulty);
    const solved = problems.filter((problem) => getStatus(problem.id) === 'solved').length;
    const attempted = problems.filter((problem) => getStatus(problem.id) === 'attempted').length;

    return {
      difficulty,
      total: problems.length,
      solved,
      attempted,
      fresh: problems.length - solved - attempted,
      pct: problems.length ? Math.round((solved / problems.length) * 100) : 0,
    };
  });
}

export function getReviewQueue(
  allProblems,
  getStatus,
  isBookmarked = () => false,
  limit = 5,
  isDueForReview = () => false
) {
  const all = getAllPracticeProblems(allProblems);

  return all
    .filter((problem) => getStatus(problem.id) !== 'solved' || isDueForReview(problem.id))
    .sort((a, b) => {
      const dueDiff = (isDueForReview(a.id) ? 0 : 1) - (isDueForReview(b.id) ? 0 : 1);
      if (dueDiff !== 0) return dueDiff;
      const aBookmarked = isBookmarked(a.id) ? 0 : 1;
      const bBookmarked = isBookmarked(b.id) ? 0 : 1;
      if (aBookmarked !== bBookmarked) return aBookmarked - bBookmarked;

      const statusDiff = (statusWeight[getStatus(a.id)] ?? 9) - (statusWeight[getStatus(b.id)] ?? 9);
      if (statusDiff !== 0) return statusDiff;

      const difficultyDiff = (difficultyOrder[a.difficulty] ?? 9) - (difficultyOrder[b.difficulty] ?? 9);
      if (difficultyDiff !== 0) return difficultyDiff;

      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}

export function getDailyTrainingPlan(
  allProblems,
  getStatus,
  isBookmarked = () => false,
  isDueForReview = () => false
) {
  const all = getAllPracticeProblems(allProblems);
  const review = getReviewQueue(allProblems, getStatus, isBookmarked, 3, isDueForReview);
  const used = new Set();

  const pick = (predicate) => {
    const problem = all.find((item) => !used.has(item.id) && getStatus(item.id) !== 'solved' && predicate(item));
    if (problem) used.add(problem.id);
    return problem || null;
  };

  const dueRecall = all.find((problem) => isDueForReview(problem.id)) || null;
  if (dueRecall) used.add(dueRecall.id);
  const warmup = dueRecall || pick((problem) => problem.difficulty === 'Easy') || review[0] || null;
  const builder = pick((problem) => problem.difficulty === 'Medium') || review[1] || warmup;
  const stretch = pick((problem) => problem.difficulty === 'Hard') || review[2] || builder;

  return [
    {
      id: 'warmup',
      label: 'Warm-up',
      duration: '10 min',
      problem: warmup,
      reason: dueRecall?.id === warmup?.id
        ? 'This pattern is due for spaced recall. Solve it without revealing the topic.'
        : 'Start with fast recall and a clean invariant.',
    },
    {
      id: 'builder',
      label: 'Pattern builder',
      duration: '25 min',
      problem: builder,
      reason: 'Spend focused time on the next unsolved core pattern.',
    },
    {
      id: 'stretch',
      label: 'Stretch',
      duration: '20 min',
      problem: stretch,
      reason: 'Close with a harder edge case or proof-quality review.',
    },
  ].filter((item, index, items) => {
    if (!item.problem) return false;
    return items.findIndex((candidate) => candidate.problem?.id === item.problem.id) === index;
  });
}

export function getMasterySignal(allProblems, getStatus, getRecord) {
  const summary = getProgressSummary(allProblems, getStatus);
  if (getRecord) {
    const weights = { seen: 0.1, guided: 0.25, independent: 0.55, durable: 0.82, transfer: 1 };
    const evidenceTotal = summary.all.reduce((total, problem) => {
      const level = getRecord(problem.id)?.evidenceLevel;
      return total + (weights[level] || 0);
    }, 0);
    const score = summary.all.length ? Math.round((evidenceTotal / summary.all.length) * 100) : 0;
    const levelCounts = summary.all.reduce((counts, problem) => {
      const level = getRecord(problem.id)?.evidenceLevel;
      if (level) counts[level] = (counts[level] || 0) + 1;
      return counts;
    }, {});
    const label = score >= 75 ? 'Durable' : score >= 45 ? 'Independent' : score >= 15 ? 'Guided' : 'Foundation';
    return {
      score,
      label,
      levelCounts,
      nextMilestone: `${levelCounts.durable || 0} patterns retained · ${levelCounts.independent || 0} ready for review`,
    };
  }
  const attemptedValue = summary.attempted * 0.35;
  const solvedValue = summary.solved;
  const score = summary.all.length
    ? Math.round(((solvedValue + attemptedValue) / summary.all.length) * 100)
    : 0;

  let label = 'Foundation';
  if (score >= 75) label = 'Interview Ready';
  else if (score >= 45) label = 'Pattern Builder';
  else if (score >= 15) label = 'Momentum';

  return {
    score,
    label,
    nextMilestone: score >= 75 ? 'Keep hard problems warm' : `Reach ${Math.min(100, Math.max(15, Math.ceil((score + 1) / 15) * 15))}% mastery`,
  };
}
