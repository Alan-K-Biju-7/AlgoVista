export const TUTOR_TURN_ENDPOINT = '/api/tutor/v1/turn';

export const TUTOR_REQUEST_LIMITS = Object.freeze({
  question: 2000,
  id: 96,
  language: 48,
  code: 8000,
  diagnostic: 1200,
  mismatch: 320,
  historyMessages: 8,
  historyMessage: 1200,
  weakness: 320,
  weaknesses: 8,
});

const TUTOR_MODES = new Set([
  'socratic',
  'debug',
  'dry-run',
  'quiz',
  'complexity',
  'review',
]);

const LEARNER_STAGES = new Set(['beginner', 'intermediate', 'advanced', 'unknown']);
const PROGRESS_STATUSES = new Set(['not-started', 'learning', 'confident', 'mastered', 'unknown']);
const EVIDENCE_LEVELS = new Set(['seen', 'guided', 'independent', 'durable', 'transfer', 'unknown']);
const CONFIDENCE_LEVELS = new Set(['shaky', 'developing', 'confident', 'unknown']);
const EMAIL_ADDRESS = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_NUMBER = /(?:\+?\d[\s().-]*){9,}\d/g;
const BEARER_TOKEN = /\b(Bearer\s+)[A-Za-z0-9._~-]+/gi;
const NAMED_SECRET = /\b(api[_-]?key|access[_-]?token|password)\s*([:=])\s*(["']?)[^\s,"';]+/gi;

function isRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function hasOwn(value, key) {
  return isRecord(value) && Object.prototype.hasOwnProperty.call(value, key);
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function stripControlCharacters(value) {
  return [...String(value || '')]
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join('');
}

export function redactTutorPii(value) {
  return String(value ?? '')
    .replace(EMAIL_ADDRESS, '[redacted email]')
    .replace(PHONE_NUMBER, '[redacted phone]')
    .replace(BEARER_TOKEN, '$1[redacted]')
    .replace(NAMED_SECRET, '$1$2[redacted]');
}

function cleanText(value, maxLength, { trim = true } = {}) {
  if (!['string', 'number', 'boolean'].includes(typeof value)) return '';
  let text = redactTutorPii(stripControlCharacters(String(value).replace(/\r\n?/g, '\n')));
  if (trim) text = text.trim();
  return text.slice(0, maxLength);
}

function cleanId(value) {
  return cleanText(value, TUTOR_REQUEST_LIMITS.id)
    .replace(/[^A-Za-z0-9._:-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function clampInteger(value, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number)) return undefined;
  return Math.max(minimum, Math.min(maximum, Math.round(number)));
}

function enumValue(value, allowed) {
  const normalized = cleanText(value, 48).toLowerCase();
  return allowed.has(normalized) ? normalized : undefined;
}

function boundedValue(value) {
  if (typeof value === 'string') {
    return cleanText(value, TUTOR_REQUEST_LIMITS.diagnostic, { trim: false });
  }
  if (value === undefined) return '';

  try {
    const seen = new WeakSet();
    const json = JSON.stringify(value, (key, nextValue) => {
      if (typeof nextValue === 'bigint') return `${nextValue}n`;
      if (nextValue && typeof nextValue === 'object') {
        if (seen.has(nextValue)) return '[Circular]';
        seen.add(nextValue);
      }
      return nextValue;
    });
    return cleanText(json ?? String(value), TUTOR_REQUEST_LIMITS.diagnostic, { trim: false });
  } catch {
    return cleanText(String(value), TUTOR_REQUEST_LIMITS.diagnostic, { trim: false });
  }
}

function mismatchAt(actual, expected, path = 'result', depth = 0) {
  if (Object.is(actual, expected)) return null;
  if (depth >= 5) return { path, actual, expected };

  if (Array.isArray(actual) && Array.isArray(expected)) {
    const length = Math.min(64, Math.max(actual.length, expected.length));
    for (let index = 0; index < length; index += 1) {
      if (index >= actual.length) return { path: `${path}[${index}]`, actual: 'missing', expected: expected[index] };
      if (index >= expected.length) return { path: `${path}[${index}]`, actual: actual[index], expected: 'no value expected' };
      const nested = mismatchAt(actual[index], expected[index], `${path}[${index}]`, depth + 1);
      if (nested) return nested;
    }
  }

  if (isRecord(actual) && isRecord(expected)) {
    const keys = [...new Set([...Object.keys(actual), ...Object.keys(expected)])].slice(0, 64);
    for (const key of keys) {
      if (!hasOwn(actual, key)) return { path: `${path}.${key}`, actual: 'missing', expected: expected[key] };
      if (!hasOwn(expected, key)) return { path: `${path}.${key}`, actual: actual[key], expected: 'no value expected' };
      const nested = mismatchAt(actual[key], expected[key], `${path}.${key}`, depth + 1);
      if (nested) return nested;
    }
  }

  return { path, actual, expected };
}

function describeFirstMismatch(result) {
  const supplied = cleanText(result?.firstMismatch, TUTOR_REQUEST_LIMITS.mismatch);
  if (supplied) return supplied;

  const hasActualValue = hasOwn(result, 'actualValue');
  const hasExpectedValue = hasOwn(result, 'expectedValue');
  if (hasActualValue && hasExpectedValue) {
    const mismatch = mismatchAt(result.actualValue, result.expectedValue);
    if (mismatch) {
      return cleanText(
        `${mismatch.path}: expected ${boundedValue(mismatch.expected)} but received ${boundedValue(mismatch.actual)}`,
        TUTOR_REQUEST_LIMITS.mismatch
      );
    }
  }

  const actual = firstDefined(result?.actual, result?.got);
  if (actual !== undefined && result?.expected !== undefined && String(actual) !== String(result.expected)) {
    return cleanText(
      `result: expected ${boundedValue(result.expected)} but received ${boundedValue(actual)}`,
      TUTOR_REQUEST_LIMITS.mismatch
    );
  }
  return '';
}

function isVisibleResult(result) {
  return isRecord(result) && result.hidden !== true && result.isHidden !== true && result.visible !== false;
}

function verdictFor(results, failedResult) {
  if (failedResult) {
    if (failedResult.kind === 'timeout') return 'timeout';
    if (failedResult.kind === 'syntax' || failedResult.kind === 'compile' || failedResult.kind === 'unsupported-language') {
      return 'compile';
    }
    if (failedResult.kind === 'memory-limit') return 'memory-limit';
    if (failedResult.kind === 'runtime' || failedResult.error) return 'runtime';
    return 'wrong-answer';
  }
  return results.length > 0 && results.every((result) => result.passed === true) ? 'accepted' : 'unknown';
}

function buildExecution(payload) {
  const context = isRecord(payload.context) ? payload.context : {};
  const executionInput = isRecord(context.execution) ? context.execution : {};
  const nestedFailedCase = isRecord(executionInput.failedCase) && isVisibleResult(executionInput.failedCase)
    ? executionInput.failedCase
    : null;
  const resultCandidates = firstDefined(payload.testResults, payload.results, context.testResults);
  const visibleResults = Array.isArray(resultCandidates) ? resultCandidates.filter(isVisibleResult) : [];
  const failedResult = nestedFailedCase || visibleResults.find((result) => result.passed === false);
  const language = cleanText(firstDefined(executionInput.language, payload.language, 'javascript'), TUTOR_REQUEST_LIMITS.language);
  const suppliedVerdict = cleanText(firstDefined(executionInput.verdict, executionInput.kind), 32).toLowerCase();
  const allowedVerdicts = new Set(['accepted', 'wrong-answer', 'runtime', 'compile', 'timeout', 'memory-limit', 'unknown']);
  const verdict = allowedVerdicts.has(suppliedVerdict)
    ? suppliedVerdict
    : verdictFor(visibleResults, failedResult);
  const execution = {
    language: language || 'javascript',
    verdict,
  };

  if (failedResult && verdict !== 'accepted' && failedResult.passed !== true) {
    const error = cleanText(firstDefined(executionInput.error, failedResult.error), TUTOR_REQUEST_LIMITS.diagnostic);
    const firstMismatch = cleanText(
      firstDefined(executionInput.firstMismatch, failedResult.firstMismatch),
      TUTOR_REQUEST_LIMITS.mismatch
    ) || describeFirstMismatch(failedResult);
    if (error) execution.error = error;
    if (firstMismatch) execution.firstMismatch = firstMismatch;
    execution.failedCase = {
      input: boundedValue(failedResult.input),
      expected: boundedValue(firstDefined(
        hasOwn(failedResult, 'expectedValue') ? failedResult.expectedValue : undefined,
        failedResult.expected
      )),
      actual: boundedValue(firstDefined(
        hasOwn(failedResult, 'actualValue') ? failedResult.actualValue : undefined,
        failedResult.actual,
        failedResult.got
      )),
    };
  }

  const shareCodeConsent = isRecord(payload.privacy) && payload.privacy.shareCode === true;
  const code = shareCodeConsent
    ? cleanText(firstDefined(executionInput.code, payload.code), TUTOR_REQUEST_LIMITS.code, { trim: false })
    : '';
  if (shareCodeConsent && code.trim()) execution.code = code;

  return { execution, shareCode: Boolean(execution.code) };
}

function assignNumber(target, key, value, minimum = 0, maximum = 100000) {
  const bounded = clampInteger(value, minimum, maximum);
  if (bounded !== undefined) target[key] = bounded;
}

function buildLearner(payload) {
  const context = isRecord(payload.context) ? payload.context : {};
  const contextLearner = isRecord(context.learner) ? context.learner : {};
  const learnerInput = isRecord(payload.learnerContext) ? payload.learnerContext : contextLearner;
  const practiceInput = isRecord(payload.practiceRecord)
    ? payload.practiceRecord
    : isRecord(learnerInput.practiceRecord)
      ? learnerInput.practiceRecord
      : learnerInput;
  const learner = {};

  const stage = enumValue(learnerInput.stage, LEARNER_STAGES);
  if (stage) learner.stage = stage;
  assignNumber(learner, 'mastery', learnerInput.mastery, 0, 100);
  if (typeof learnerInput.dueForReview === 'boolean') learner.dueForReview = learnerInput.dueForReview;

  if (Array.isArray(learnerInput.weaknesses)) {
    const weaknesses = learnerInput.weaknesses
      .slice(0, TUTOR_REQUEST_LIMITS.weaknesses)
      .map((item) => cleanText(item, TUTOR_REQUEST_LIMITS.weakness))
      .filter(Boolean);
    if (weaknesses.length) learner.weaknesses = weaknesses;
  }

  const progressStatus = enumValue(
    firstDefined(learnerInput.conceptProgress?.status, learnerInput.progressStatus),
    PROGRESS_STATUSES
  );
  if (progressStatus) learner.progressStatus = progressStatus;

  const practiceRecord = {};
  assignNumber(practiceRecord, 'attempts', firstDefined(practiceInput.attempts, practiceInput.attemptCount));
  assignNumber(practiceRecord, 'passes', practiceInput.passes);
  assignNumber(practiceRecord, 'hintsUsed', practiceInput.hintsUsed);
  assignNumber(practiceRecord, 'hintDepth', practiceInput.hintDepth, 0, 3);
  assignNumber(practiceRecord, 'reviewCount', practiceInput.reviewCount);
  if (typeof practiceInput.solutionViewed === 'boolean') practiceRecord.solutionViewed = practiceInput.solutionViewed;

  const evidenceLevel = enumValue(practiceInput.evidenceLevel, EVIDENCE_LEVELS);
  if (evidenceLevel) practiceRecord.evidenceLevel = evidenceLevel;
  const confidence = enumValue(practiceInput.confidence, CONFIDENCE_LEVELS);
  if (confidence) practiceRecord.confidence = confidence;
  const lastLanguage = cleanText(practiceInput.lastLanguage, TUTOR_REQUEST_LIMITS.language);
  if (lastLanguage) practiceRecord.lastLanguage = lastLanguage;

  if (Object.keys(practiceRecord).length) learner.practiceRecord = practiceRecord;
  return learner;
}

function buildHistory(payload) {
  const shareHistory = isRecord(payload.privacy) && payload.privacy.shareHistory === true;
  if (!shareHistory || !Array.isArray(payload.history)) return { history: [], shareHistory };

  const history = payload.history
    .filter((item) => isRecord(item) && item.role === 'user')
    .slice(-TUTOR_REQUEST_LIMITS.historyMessages)
    .map((item) => ({
      role: 'user',
      content: cleanText(item.content, TUTOR_REQUEST_LIMITS.historyMessage),
    }))
    .filter((item) => item.content);
  return { history, shareHistory };
}

export function buildTutorTurnRequest(payload = {}) {
  if (!isRecord(payload)) throw new TypeError('Tutor payload must be an object.');

  const question = cleanText(payload.question, TUTOR_REQUEST_LIMITS.question);
  if (question.length < 2) throw new TypeError('Tutor question must contain at least 2 characters.');

  const mode = TUTOR_MODES.has(payload.mode) ? payload.mode : 'socratic';
  const requestedHintLevel = clampInteger(payload.hintLevel, 0, 3);
  const hintLevel = requestedHintLevel ?? (['quiz', 'review'].includes(mode) ? 0 : 1);
  const context = isRecord(payload.context) ? payload.context : {};
  const problem = isRecord(payload.problem) ? payload.problem : isRecord(context.problem) ? context.problem : {};
  const { execution, shareCode } = buildExecution(payload);
  const { history, shareHistory } = buildHistory(payload);

  return {
    version: 1,
    question,
    mode,
    hintLevel,
    context: {
      problem: { id: cleanId(problem.id) },
      execution,
      learner: buildLearner(payload),
    },
    privacy: {
      shareCode,
      shareHistory,
      retainConversation: false,
    },
    history,
  };
}

export async function askTutorTurn({ apiRequest, payload, signal } = {}) {
  if (typeof apiRequest !== 'function') throw new TypeError('askTutorTurn requires an apiRequest function.');

  const request = buildTutorTurnRequest(payload);

  return apiRequest(TUTOR_TURN_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(request),
    signal: signal ?? payload?.signal,
  });
}
