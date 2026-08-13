'use strict';

const PEDAGOGY_MODES = Object.freeze([
  'socratic',
  'debug',
  'dry-run',
  'quiz',
  'complexity',
  'review',
]);

const MISCONCEPTION_TYPES = Object.freeze([
  'none',
  'pattern-selection',
  'invariant',
  'state-update',
  'boundary-case',
  'complexity',
  'language',
  'debugging-strategy',
]);

const MODE_POLICIES = Object.freeze({
  socratic: {
    goal: 'Help the learner discover the next step through one focused question.',
    nextAction: 'answer-question',
    instruction: 'Give one small conceptual cue, then ask exactly one focused question.',
  },
  debug: {
    goal: 'Help the learner locate the first broken assumption without rewriting the solution.',
    nextAction: 'inspect-state',
    instruction: 'Start from the first supplied failure signal. Name one state or invariant to inspect.',
  },
  'dry-run': {
    goal: 'Build execution intuition from a small concrete input.',
    nextAction: 'trace-step',
    instruction: 'Walk through only the next state transition and ask the learner to predict what follows.',
  },
  quiz: {
    goal: 'Test retrieval with one answerable question.',
    nextAction: 'answer-question',
    instruction: 'Ask one question and stop. Do not include its answer in the same response.',
  },
  complexity: {
    goal: 'Help the learner derive time and space complexity from operations and stored state.',
    nextAction: 'estimate-complexity',
    instruction: 'Point to one dominant operation or state allocation, then ask for the resulting bound.',
  },
  review: {
    goal: 'Strengthen recall of a previously learned pattern before showing any cue.',
    nextAction: 'recall-invariant',
    instruction: 'Ask for retrieval first. Give a cue only when the supplied learner evidence shows it is needed.',
  },
});

const LIMITS = Object.freeze({
  question: 2000,
  id: 96,
  label: 160,
  shortText: 320,
  fact: 700,
  facts: 24,
  selectedFacts: 6,
  constraints: 12,
  examples: 5,
  historyMessages: 8,
  historyMessage: 1200,
  codeExcerpt: 8000,
  diagnosticValue: 1200,
  weaknesses: 8,
  responseMessage: 1800,
  responseQuestion: 500,
  citations: 6,
  warnings: 6,
  learningObjective: 320,
});

const TUTOR_RESPONSE_SCHEMA = Object.freeze({
  type: 'object',
  additionalProperties: false,
  required: [
    'version',
    'mode',
    'message',
    'nextQuestion',
    'nextAction',
    'hintLevel',
    'solutionRevealed',
    'citations',
    'masterySignal',
    'warnings',
    'diagnosis',
    'intervention',
    'checkForUnderstanding',
    'recommendedFollowUp',
  ],
  properties: {
    version: { type: 'integer', enum: [1, 2] },
    mode: { type: 'string', enum: PEDAGOGY_MODES },
    message: { type: 'string', maxLength: LIMITS.responseMessage },
    nextQuestion: { type: 'string', maxLength: LIMITS.responseQuestion },
    nextAction: {
      type: 'string',
      enum: [
        'answer-question',
        'inspect-state',
        'trace-step',
        'run-test',
        'estimate-complexity',
        'recall-invariant',
        'continue',
      ],
    },
    hintLevel: { type: 'integer', minimum: 0, maximum: 3 },
    solutionRevealed: { type: 'boolean' },
    citations: {
      type: 'array',
      maxItems: LIMITS.citations,
      items: { type: 'string', maxLength: LIMITS.id },
    },
    masterySignal: {
      type: 'object',
      additionalProperties: false,
      required: ['evidence', 'confidenceDelta'],
      properties: {
        evidence: {
          type: 'string',
          enum: ['none', 'attempted', 'explained', 'recalled', 'transferred'],
        },
        confidenceDelta: { type: 'integer', minimum: -1, maximum: 1 },
      },
    },
    warnings: {
      type: 'array',
      maxItems: LIMITS.warnings,
      items: { type: 'string', maxLength: LIMITS.shortText },
    },
    diagnosis: {
      type: 'object',
      additionalProperties: false,
      required: ['misconception', 'confidence', 'evidence'],
      properties: {
        misconception: { type: 'string', enum: MISCONCEPTION_TYPES },
        confidence: { type: 'number', minimum: 0, maximum: 1 },
        evidence: { type: 'string', maxLength: LIMITS.shortText },
      },
    },
    intervention: { type: 'string', maxLength: LIMITS.shortText },
    checkForUnderstanding: { type: 'string', maxLength: LIMITS.responseQuestion },
    recommendedFollowUp: {
      type: 'object',
      additionalProperties: false,
      required: ['kind', 'conceptId', 'reason'],
      properties: {
        kind: { type: 'string', enum: ['none', 'retrieval-check', 'related-problem'] },
        conceptId: { type: 'string', maxLength: LIMITS.id },
        reason: { type: 'string', maxLength: LIMITS.shortText },
      },
    },
  },
});

module.exports = {
  LIMITS,
  MODE_POLICIES,
  MISCONCEPTION_TYPES,
  PEDAGOGY_MODES,
  TUTOR_RESPONSE_SCHEMA,
};
