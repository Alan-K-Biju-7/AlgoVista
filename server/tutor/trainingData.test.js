'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { exportApprovedExamples, prepareQuarantinedExample } = require('./trainingData');

test('requires explicit active consent and quarantines de-identified examples', () => {
  assert.throws(() => prepareQuarantinedExample({}, {}), /explicit model-improvement consent/i);
  const item = prepareQuarantinedExample({ attemptId: 'a1', question: 'Email me at x@y.test', response: 'api_key=secret' }, {
    modelImprovement: true, grantedAt: '2026-01-01T00:00:00Z', subjectId: 'user-1', revision: '1',
  });
  assert.equal(item.status, 'quarantined');
  assert.doesNotMatch(JSON.stringify(item), /x@y\.test|api_key=secret/);
});

test('training exports include only approved, non-revoked examples', () => {
  const records = [
    { id: 'keep', status: 'approved', question: 'q', response: 'r', mode: 'debug', diagnosis: 'boundary-case' },
    { id: 'drop', status: 'approved', question: 'q2', response: 'r2' },
    { id: 'pending', status: 'quarantined', question: 'q3', response: 'r3' },
  ];
  assert.deepEqual(exportApprovedExamples(records, ['drop']), [
    { question: 'q', response: 'r', mode: 'debug', diagnosis: 'boundary-case' },
  ]);
});
