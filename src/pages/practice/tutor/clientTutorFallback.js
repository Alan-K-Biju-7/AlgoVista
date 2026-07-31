const MODE_ACTIONS = {
  socratic: 'answer-question',
  debug: 'inspect-state',
  'dry-run': 'trace-step',
  quiz: 'answer-question',
  complexity: 'estimate-complexity',
  review: 'recall-invariant',
};

function evidenceFrom(payload) {
  const execution = payload?.context?.execution || {};
  return execution.firstMismatch || execution.error || '';
}

export function createClientTutorFallback(payload = {}) {
  const mode = MODE_ACTIONS[payload.mode] ? payload.mode : 'socratic';
  const evidence = evidenceFrom(payload);
  const problemTitle = payload?.context?.problem?.title || 'this problem';
  const messages = {
    debug: evidence
      ? `Start with the first visible failure: ${evidence}. Trace only the state that produces that value before changing the whole algorithm.`
      : 'Run the smallest visible failing case, then compare the first value that differs from the expected output.',
    'dry-run': 'Choose the smallest example and write the values that survive from one step to the next.',
    quiz: `Without opening the solution, state the invariant that makes your approach to ${problemTitle} correct.`,
    complexity: 'Count the dominant repeated operation, then separately count the extra state that can exist at one time.',
    review: `Recall the pattern for ${problemTitle} from memory before using another hint.`,
    socratic: `For ${problemTitle}, name the one piece of state your next decision depends on and what it means.`,
  };
  const questions = {
    debug: 'Which assignment or pointer update first makes that state differ?',
    'dry-run': 'After the first decision, what changes and what must remain true?',
    quiz: 'What edge case is most likely to break that invariant?',
    complexity: 'How many times can the dominant operation run as the input grows?',
    review: 'Can you explain the invariant in one sentence without looking?',
    socratic: 'Why is that state sufficient for the next decision?',
  };

  return {
    requestId: 'browser-fallback',
    source: 'browser-fallback',
    degraded: true,
    tutor: {
      version: 1,
      mode,
      message: messages[mode],
      nextQuestion: questions[mode],
      nextAction: MODE_ACTIONS[mode],
      hintLevel: Math.max(0, Math.min(3, Number(payload.hintLevel) || (['quiz', 'review'].includes(mode) ? 0 : 1))),
      solutionRevealed: false,
      citations: evidence ? ['execution:visible-failure'] : [],
      masterySignal: { evidence: 'none', confidenceDelta: 0 },
      warnings: ['offline-tutor', 'backend-unavailable'],
    },
    policy: {
      solutionRevealed: false,
      hiddenTestsRevealed: false,
      guidancePolicy: 'learning-first-v1',
      conversationRetained: false,
    },
  };
}

export function shouldUseClientTutorFallback(error) {
  return !error?.status || error.status === 404 || error.status >= 500;
}
