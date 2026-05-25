export function getAllPracticeProblems(allProblems) {
  return Object.values(allProblems).flatMap((topic) => topic.problems || []);
}

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
