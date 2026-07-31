'use strict';

const { LIMITS } = require('./constants');
const { cleanId, cleanText } = require('./sanitize');

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'because', 'by', 'can', 'do', 'does',
  'for', 'from', 'how', 'i', 'if', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or',
  'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'which', 'why', 'with',
]);

const MODE_TERMS = Object.freeze({
  socratic: ['invariant', 'pattern', 'state'],
  debug: ['error', 'failure', 'mismatch', 'expected', 'actual', 'invariant'],
  'dry-run': ['example', 'input', 'state', 'step'],
  quiz: ['concept', 'pattern', 'invariant'],
  complexity: ['time', 'space', 'complexity', 'loop', 'operation'],
  review: ['pattern', 'invariant', 'recall'],
});

function tokens(value) {
  return new Set(
    String(value || '')
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((token) => token.length > 1 && !STOP_WORDS.has(token)) || []
  );
}

function buildGroundingCandidates(request) {
  const candidates = [];
  const seenText = new Set();
  const seenIds = new Map();

  const add = (kind, rawId, rawText, priority = 0) => {
    const text = cleanText(rawText, LIMITS.fact);
    const fingerprint = text.toLowerCase();
    if (!text || seenText.has(fingerprint)) return;
    seenText.add(fingerprint);

    const baseId = cleanId(rawId, `source-${candidates.length + 1}`);
    const occurrence = (seenIds.get(baseId) || 0) + 1;
    seenIds.set(baseId, occurrence);
    candidates.push({
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      kind,
      text,
      priority,
      order: candidates.length,
    });
  };

  add('lesson-summary', 'lesson:summary', request.lesson.summary, 3);
  request.lesson.facts.forEach((fact) => add('lesson-fact', `lesson:${fact.id}`, fact.text, 2));

  add('problem-statement', 'problem:statement', request.problem.statement, 3);
  add('problem-pattern', 'problem:pattern', request.problem.pattern, 5);
  add('problem-invariant', 'problem:invariant', request.problem.invariant, 6);
  request.problem.constraints.forEach((constraint, index) => {
    add('problem-constraint', `problem:constraint-${index + 1}`, constraint, 2);
  });
  request.problem.examples.forEach((example, index) => {
    const text = [
      example.input ? `Input: ${example.input}` : '',
      example.output ? `Output: ${example.output}` : '',
      example.explanation,
    ].filter(Boolean).join(' | ');
    add('problem-example', `problem:example-${index + 1}`, text, 2);
  });
  request.problem.facts.forEach((fact) => add('problem-fact', `problem:${fact.id}`, fact.text, 3));

  if (request.execution.verdict !== 'unknown') {
    add('execution-verdict', 'execution:verdict', `Verdict: ${request.execution.verdict}`, request.mode === 'debug' ? 8 : 1);
  }
  add('execution-error', 'execution:error', request.execution.error, request.mode === 'debug' ? 9 : 1);
  add('execution-mismatch', 'execution:mismatch', request.execution.firstMismatch, request.mode === 'debug' ? 9 : 1);
  if (request.execution.input || request.execution.expected || request.execution.actual) {
    add(
      'execution-case',
      'execution:failing-case',
      [
        request.execution.input ? `Input: ${request.execution.input}` : '',
        request.execution.expected ? `Expected: ${request.execution.expected}` : '',
        request.execution.actual ? `Actual: ${request.execution.actual}` : '',
      ].filter(Boolean).join(' | '),
      ['debug', 'dry-run'].includes(request.mode) ? 8 : 1
    );
  }

  return candidates;
}

function selectGrounding(request) {
  const queryTokens = tokens([
    request.question,
    ...(MODE_TERMS[request.mode] || []),
    ...request.learner.weaknesses,
  ].join(' '));

  return buildGroundingCandidates(request)
    .map((candidate) => {
      const candidateTokens = tokens(candidate.text);
      let overlap = 0;
      queryTokens.forEach((token) => {
        if (candidateTokens.has(token)) overlap += token.length >= 6 ? 3 : 2;
      });
      return { ...candidate, score: candidate.priority + overlap };
    })
    .sort((left, right) => right.score - left.score || left.order - right.order)
    .slice(0, LIMITS.selectedFacts)
    .map(({ id, kind, text }) => ({ id, kind, text }));
}

function formatGrounding(grounding) {
  if (!grounding.length) return 'No curated grounding facts were supplied.';
  return grounding.map((source) => `[${source.id}] (${source.kind}) ${source.text}`).join('\n');
}

module.exports = {
  buildGroundingCandidates,
  formatGrounding,
  selectGrounding,
  tokens,
};
