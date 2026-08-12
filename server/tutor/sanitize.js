'use strict';

const { LIMITS, PEDAGOGY_MODES } = require('./constants');

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const LEARNER_STAGES = ['beginner', 'intermediate', 'advanced', 'unknown'];
const PROGRESS_STATUSES = ['not-started', 'learning', 'confident', 'mastered', 'unknown'];
const EVIDENCE_LEVELS = ['seen', 'guided', 'independent', 'durable', 'transfer', 'unknown'];
const CONFIDENCE_LEVELS = ['shaky', 'developing', 'confident', 'unknown'];
const VERDICTS = [
  'accepted',
  'wrong-answer',
  'runtime',
  'compile',
  'timeout',
  'memory-limit',
  'unknown',
];

class TutorInputError extends Error {
  constructor(message, code = 'invalid_tutor_request') {
    super(message);
    this.name = 'TutorInputError';
    this.code = code;
    this.status = 400;
  }
}

function isRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function cleanText(value, maxLength, { trim = true } = {}) {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
    return '';
  }

  let text = String(value)
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARACTERS, '');
  if (trim) text = text.trim();
  return text.slice(0, maxLength);
}

function cleanId(value, fallback = '') {
  const text = cleanText(value, LIMITS.id)
    .replace(/[^A-Za-z0-9._:-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return text || fallback;
}

function clampInteger(value, minimum, maximum, fallback = minimum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(minimum, Math.min(maximum, Math.round(parsed)));
}

function enumValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function boundedValue(value, maxLength = LIMITS.diagnosticValue) {
  if (typeof value === 'string') return cleanText(value, maxLength, { trim: false });
  if (value === undefined) return '';

  try {
    const seen = new WeakSet();
    const serialized = JSON.stringify(value, (key, nextValue) => {
      if (typeof nextValue === 'bigint') return `${nextValue}n`;
      if (nextValue && typeof nextValue === 'object') {
        if (seen.has(nextValue)) return '[Circular]';
        seen.add(nextValue);
      }
      return nextValue;
    });
    return cleanText(serialized, maxLength, { trim: false });
  } catch {
    return cleanText(String(value), maxLength, { trim: false });
  }
}

function normalizeFactArray(value, prefix) {
  if (!Array.isArray(value)) return [];

  return value.slice(0, LIMITS.facts).map((fact, index) => {
    if (isRecord(fact)) {
      return {
        id: cleanId(fact.id, `${prefix}-${index + 1}`),
        text: cleanText(fact.text || fact.content || fact.fact, LIMITS.fact),
      };
    }
    return {
      id: `${prefix}-${index + 1}`,
      text: cleanText(fact, LIMITS.fact),
    };
  }).filter((fact) => fact.text);
}

function normalizeExamples(value) {
  if (!Array.isArray(value)) return [];

  return value.slice(0, LIMITS.examples).map((example) => {
    if (!isRecord(example)) {
      return { input: boundedValue(example), output: '', explanation: '' };
    }
    return {
      input: boundedValue(example.input),
      output: boundedValue(example.output ?? example.expected),
      explanation: cleanText(example.explanation, LIMITS.fact),
    };
  }).filter((example) => example.input || example.output || example.explanation);
}

function normalizeLesson(value) {
  const lesson = isRecord(value) ? value : {};
  return {
    id: cleanId(lesson.id),
    title: cleanText(lesson.title, LIMITS.label),
    section: cleanText(lesson.section || lesson.sectionTitle, LIMITS.label),
    summary: cleanText(lesson.summary || lesson.focus || lesson.mentalModel, LIMITS.fact),
    facts: normalizeFactArray(lesson.facts, 'lesson-fact'),
  };
}

function normalizeProblem(value) {
  const problem = isRecord(value) ? value : {};
  return {
    id: cleanId(problem.id),
    title: cleanText(problem.title, LIMITS.label),
    difficulty: cleanText(problem.difficulty, 24),
    statement: cleanText(problem.statement || problem.description, LIMITS.fact),
    pattern: cleanText(problem.pattern, LIMITS.shortText),
    invariant: cleanText(problem.invariant || problem.patternExplanation || problem.pattern_explanation, LIMITS.fact),
    constraints: Array.isArray(problem.constraints)
      ? problem.constraints.slice(0, LIMITS.constraints)
        .map((item) => cleanText(item, LIMITS.shortText))
        .filter(Boolean)
      : [],
    examples: normalizeExamples(problem.examples),
    facts: normalizeFactArray(problem.facts, 'problem-fact'),
  };
}

function normalizeExecution(value, shareCode) {
  const execution = isRecord(value) ? value : {};
  const failedCase = isRecord(execution.failedCase)
    ? execution.failedCase
    : isRecord(execution.testResult)
      ? execution.testResult
      : {};

  return {
    language: cleanText(execution.language, 48),
    verdict: enumValue(execution.verdict || execution.kind, VERDICTS, 'unknown'),
    error: cleanText(execution.error || failedCase.error, LIMITS.diagnosticValue),
    firstMismatch: cleanText(execution.firstMismatch || failedCase.firstMismatch, LIMITS.shortText),
    input: boundedValue(failedCase.input ?? execution.input),
    expected: boundedValue(failedCase.expected ?? execution.expected),
    actual: boundedValue(failedCase.actual ?? failedCase.got ?? execution.actual),
    codeExcerpt: shareCode
      ? cleanText(execution.codeExcerpt || execution.code, LIMITS.codeExcerpt, { trim: false })
      : '',
  };
}

function normalizeLearnerContext(value) {
  const learner = isRecord(value) ? value : {};
  const practice = isRecord(learner.practiceRecord) ? learner.practiceRecord : learner;
  const concept = isRecord(learner.conceptProgress) ? learner.conceptProgress : learner;

  return {
    stage: enumValue(learner.stage, LEARNER_STAGES, 'unknown'),
    progressStatus: enumValue(concept.status || learner.progressStatus, PROGRESS_STATUSES, 'unknown'),
    mastery: clampInteger(learner.mastery, 0, 100, 0),
    attempts: clampInteger(practice.attempts, 0, 100000, 0),
    passes: clampInteger(practice.passes, 0, 100000, 0),
    hintsUsed: clampInteger(practice.hintsUsed, 0, 100000, 0),
    hintDepth: clampInteger(practice.hintDepth, 0, 3, 0),
    reviewCount: clampInteger(practice.reviewCount, 0, 100000, 0),
    solutionViewed: Boolean(practice.solutionViewed),
    evidenceLevel: enumValue(practice.evidenceLevel, EVIDENCE_LEVELS, 'unknown'),
    confidence: enumValue(practice.confidence, CONFIDENCE_LEVELS, 'unknown'),
    dueForReview: Boolean(learner.dueForReview),
    lastLanguage: cleanText(practice.lastLanguage, 48),
    weaknesses: Array.isArray(learner.weaknesses)
      ? learner.weaknesses.slice(0, LIMITS.weaknesses)
        .map((item) => cleanText(item, LIMITS.shortText))
        .filter(Boolean)
      : [],
  };
}

function normalizeHistory(value, shareHistory) {
  if (!shareHistory || !Array.isArray(value)) return [];
  return value
    // Prior assistant messages are not trusted input. Accepting them would let a
    // client forge tutor instructions or claimed disclosures at assistant
    // priority in the provider conversation.
    .filter((item) => isRecord(item) && item.role === 'user')
    .slice(-LIMITS.historyMessages)
    .map((item) => ({
      role: 'user',
      content: cleanText(item.content, LIMITS.historyMessage),
    }))
    .filter((item) => item.content);
}

function normalizeTutorRequest(input, trustedOptions = {}) {
  if (!isRecord(input)) {
    throw new TutorInputError('Tutor request must be an object.');
  }

  if (typeof input.question !== 'string') {
    throw new TutorInputError('Tutor question is required.', 'missing_question');
  }
  const rawQuestion = input.question.replace(CONTROL_CHARACTERS, '').trim();
  if (rawQuestion.length < 2) {
    throw new TutorInputError('Tutor question must contain at least 2 characters.', 'missing_question');
  }
  if (rawQuestion.length > LIMITS.question) {
    throw new TutorInputError(
      `Tutor question must be ${LIMITS.question} characters or fewer.`,
      'question_too_long'
    );
  }

  const mode = input.mode || 'socratic';
  if (!PEDAGOGY_MODES.includes(mode)) {
    throw new TutorInputError(`Unsupported tutor mode: ${cleanText(mode, 48) || 'unknown'}.`, 'invalid_mode');
  }

  const context = isRecord(input.context) ? input.context : {};
  const privacyInput = isRecord(input.privacy) ? input.privacy : {};
  const trusted = isRecord(trustedOptions) ? trustedOptions : {};
  const shareCode = privacyInput.shareCode === true;
  const shareHistory = privacyInput.shareHistory === true;
  const defaultHintLevel = ['quiz', 'review'].includes(mode) ? 0 : 1;

  return {
    version: input.version === 2 ? 2 : 1,
    mode,
    question: cleanText(rawQuestion, LIMITS.question),
    hintLevel: clampInteger(input.hintLevel, 0, 3, defaultHintLevel),
    // Authorization cannot be supplied inside an HTTP request body. The API
    // layer may opt in only after checking deterministic server-side state.
    solutionPolicy: trusted.allowSolution === true ? 'explain-after-attempt' : 'withhold',
    privacy: {
      shareCode,
      shareHistory,
      retainConversation: privacyInput.retainConversation === true,
    },
    lesson: normalizeLesson(context.lesson || input.lesson),
    problem: normalizeProblem(context.problem || input.problem),
    execution: normalizeExecution(context.execution || input.execution, shareCode),
    learner: normalizeLearnerContext(context.learner || input.learnerContext || input.learner),
    history: normalizeHistory(input.history, shareHistory),
    coachingState: {
      sessionId: cleanId(input.coachingState?.sessionId),
      attemptId: cleanId(input.coachingState?.attemptId),
      learningObjective: cleanText(input.coachingState?.learningObjective, LIMITS.learningObjective),
      consumedHintLevels: Array.isArray(input.coachingState?.consumedHintLevels)
        ? [...new Set(input.coachingState.consumedHintLevels
          .map((level) => clampInteger(level, 0, 3, -1))
          .filter((level) => level >= 0))].sort()
        : [],
    },
  };
}

module.exports = {
  TutorInputError,
  boundedValue,
  cleanId,
  cleanText,
  isRecord,
  normalizeTutorRequest,
};
