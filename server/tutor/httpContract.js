'use strict';

const { TutorInputError } = require('./sanitize');
const { LIMITS } = require('./constants');

const ALLOWED_KEYS = Object.freeze({
  request: new Set(['version', 'question', 'mode', 'hintLevel', 'context', 'privacy', 'history', 'coachingState']),
  coachingState: new Set(['sessionId', 'attemptId', 'consumedHintLevels', 'learningObjective']),
  context: new Set(['problem', 'execution', 'learner']),
  problem: new Set(['id']),
  execution: new Set([
    'language',
    'verdict',
    'kind',
    'error',
    'firstMismatch',
    'failedCase',
    'code',
    'codeExcerpt',
  ]),
  failedCase: new Set(['input', 'expected', 'actual', 'got', 'error', 'firstMismatch', 'caseIndex']),
  learner: new Set([
    'stage',
    'mastery',
    'progressStatus',
    'attempts',
    'passes',
    'hintsUsed',
    'hintDepth',
    'reviewCount',
    'solutionViewed',
    'evidenceLevel',
    'confidence',
    'dueForReview',
    'lastLanguage',
    'weaknesses',
    'practiceRecord',
  ]),
  practiceRecord: new Set([
    'attempts',
    'passes',
    'hintsUsed',
    'hintDepth',
    'reviewCount',
    'solutionViewed',
    'evidenceLevel',
    'confidence',
    'lastLanguage',
  ]),
  privacy: new Set(['shareCode', 'shareHistory', 'retainConversation']),
  historyItem: new Set(['role', 'content']),
});

function isRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function contractError(message, code = 'invalid_tutor_contract', status = 400) {
  const error = new TutorInputError(message, code);
  error.status = status;
  return error;
}

function assertRecord(value, label) {
  if (!isRecord(value)) throw contractError(`${label} must be an object.`);
}

function assertKnownKeys(value, allowed, label) {
  assertRecord(value, label);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length) {
    throw contractError(`${label} contains unsupported field: ${unknown[0]}.`, 'unknown_tutor_field');
  }
}

function validateTutorHttpRequest(body) {
  assertKnownKeys(body, ALLOWED_KEYS.request, 'Tutor request');
  if (![1, 2].includes(body.version)) {
    throw contractError('Tutor request version must be 1 or 2.', 'unsupported_tutor_version');
  }

  if (body.version === 2) {
    assertKnownKeys(body.coachingState || {}, ALLOWED_KEYS.coachingState, 'Tutor coaching state');
    const levels = body.coachingState?.consumedHintLevels || [];
    if (!Array.isArray(levels) || levels.some((level) => !Number.isInteger(level) || level < 0 || level > 3)) {
      throw contractError('Consumed hint levels must contain only integers from 0 to 3.');
    }
  }

  assertKnownKeys(body.context, ALLOWED_KEYS.context, 'Tutor context');
  assertKnownKeys(body.context.problem, ALLOWED_KEYS.problem, 'Tutor problem');
  const problemId = String(body.context.problem.id || '').trim();
  if (!problemId) throw contractError('A known problem id is required.', 'missing_problem_id', 422);

  const execution = body.context.execution || {};
  assertKnownKeys(execution, ALLOWED_KEYS.execution, 'Tutor execution');
  if (execution.failedCase !== undefined) {
    assertKnownKeys(execution.failedCase, ALLOWED_KEYS.failedCase, 'Tutor failed case');
  }

  const learner = body.context.learner || {};
  assertKnownKeys(learner, ALLOWED_KEYS.learner, 'Tutor learner context');
  if (learner.practiceRecord !== undefined) {
    assertKnownKeys(learner.practiceRecord, ALLOWED_KEYS.practiceRecord, 'Tutor practice record');
  }

  const privacy = body.privacy || {};
  assertKnownKeys(privacy, ALLOWED_KEYS.privacy, 'Tutor privacy settings');
  if (privacy.retainConversation === true) {
    throw contractError(
      'Conversation retention is not enabled in this tutor version.',
      'conversation_retention_unavailable',
      422
    );
  }
  if ((execution.code || execution.codeExcerpt) && privacy.shareCode !== true) {
    throw contractError('Code requires explicit sharing consent.', 'code_consent_required');
  }
  const sharedCode = execution.code ?? execution.codeExcerpt;
  if (typeof sharedCode === 'string' && sharedCode.length > LIMITS.codeExcerpt) {
    throw contractError(
      `Shared code must be ${LIMITS.codeExcerpt} characters or fewer.`,
      'code_too_long',
      413
    );
  }

  if (body.history !== undefined) {
    if (!Array.isArray(body.history)) throw contractError('Tutor history must be an array.');
    if (body.history.length > LIMITS.historyMessages) {
      throw contractError('Tutor history contains too many messages.', 'history_too_long', 413);
    }
    if (body.history.length && privacy.shareHistory !== true) {
      throw contractError('Conversation history requires explicit sharing consent.', 'history_consent_required');
    }
    body.history.forEach((item) => {
      assertKnownKeys(item, ALLOWED_KEYS.historyItem, 'Tutor history item');
      if (item.role !== 'user') {
        throw contractError('Only prior learner messages may be supplied.', 'untrusted_history_role');
      }
      if (typeof item.content !== 'string' || item.content.length > LIMITS.historyMessage) {
        throw contractError('A tutor history message is invalid or too long.', 'history_message_too_long', 413);
      }
    });
  }

  return body;
}

module.exports = {
  ALLOWED_KEYS,
  validateTutorHttpRequest,
};
