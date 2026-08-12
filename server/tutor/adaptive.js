'use strict';

const { MISCONCEPTION_TYPES } = require('./constants');

const SIGNALS = Object.freeze([
  ['language', /\b(syntax|compile|typeerror|referenceerror|undefined|language)\b/i],
  ['complexity', /\b(complexity|big\s*o|too slow|timeout|memory)\b/i],
  ['boundary-case', /\b(edge|empty|single|duplicate|overflow|boundary|off.by.one)\b/i],
  ['invariant', /\b(invariant|must remain|assumption)\b/i],
  ['state-update', /\b(update|pointer|index|state|insert|remove|swap)\b/i],
  ['pattern-selection', /\b(pattern|approach|algorithm|brute force|which data structure)\b/i],
]);

function diagnoseMisconception(request) {
  const evidence = [
    request.execution?.error,
    request.execution?.firstMismatch,
    request.question,
  ].filter(Boolean).join(' ');
  if (!evidence.trim()) return { misconception: 'none', confidence: 0, evidence: '' };
  if (request.mode === 'debug' && request.execution?.verdict === 'unknown') {
    return { misconception: 'debugging-strategy', confidence: 0.55, evidence: 'No deterministic failure signal was supplied.' };
  }
  const match = SIGNALS.find(([, pattern]) => pattern.test(evidence));
  const misconception = match?.[0] || (request.mode === 'debug' ? 'debugging-strategy' : 'none');
  return {
    misconception: MISCONCEPTION_TYPES.includes(misconception) ? misconception : 'none',
    confidence: match ? 0.7 : misconception === 'none' ? 0.2 : 0.45,
    evidence: String(request.execution?.firstMismatch || request.execution?.error || '').slice(0, 320),
  };
}

function teachingPolicy(request, diagnosis) {
  const consumed = request.coachingState?.consumedHintLevels || [];
  const highestConsumed = consumed.length ? Math.max(...consumed) : -1;
  const hintLevel = Math.min(request.hintLevel, Math.max(0, highestConsumed + 1));
  const needsVerification = request.learner?.evidenceLevel === 'guided' || highestConsumed >= 1;
  return {
    hintLevel,
    intervention: needsVerification ? 'verify-understanding' : diagnosis.misconception === 'none' ? 'diagnose' : 'targeted-cue',
    followUpKind: needsVerification ? 'retrieval-check' : 'none',
  };
}

module.exports = { diagnoseMisconception, teachingPolicy };
