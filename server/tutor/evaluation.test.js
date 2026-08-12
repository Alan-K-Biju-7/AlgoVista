'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { aggregateScores, scoreTutorResponse } = require('./evaluation');

test('scores adaptive coaching behavior and solution safety', () => {
  const score = scoreTutorResponse({
    message: 'Inspect the boundary before changing the loop.', citations: ['problem:invariant'],
    solutionRevealed: false, diagnosis: { misconception: 'boundary-case' },
    intervention: 'targeted-cue', checkForUnderstanding: 'What changes at index zero?',
    recommendedFollowUp: { kind: 'retrieval-check' },
  }, { expectedMisconception: 'boundary-case', allowedCitations: ['problem:invariant'] });
  assert.deepEqual(aggregateScores([score]), score);
  assert.equal(score.solutionSafety, 1);
});
