'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { diagnoseMisconception, teachingPolicy } = require('./adaptive');
const { normalizeTutorRequest, prepareTutorTurn } = require('./index');

test('classifies bounded deterministic misconception signals', () => {
  const request = normalizeTutorRequest({
    version: 2,
    question: 'Why does the duplicate edge case fail?',
    mode: 'debug',
    context: { execution: { verdict: 'wrong-answer', firstMismatch: 'off-by-one at index 2' } },
    coachingState: { consumedHintLevels: [0], learningObjective: 'Handle boundaries independently' },
  });
  assert.equal(diagnoseMisconception(request).misconception, 'boundary-case');
  assert.equal(teachingPolicy(request, diagnoseMisconception(request)).hintLevel, 1);
});

test('v2 turns expose adaptive response fields without retaining raw coaching text', () => {
  const turn = prepareTutorTurn({
    version: 2,
    question: 'Help me choose an approach',
    mode: 'socratic',
    context: { lesson: { id: 'arrays' }, problem: { id: 'two-sum' } },
    coachingState: { sessionId: 'session-safe', attemptId: 'attempt-safe', consumedHintLevels: [] },
  });
  assert.equal(turn.request.version, 2);
  assert.equal(turn.responseSchema.properties.version.enum.includes(2), true);
  assert.match(turn.messages[0].content, /diagnosis/i);
});
