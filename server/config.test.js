'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { boundedEnvironmentInteger } = require('./config');

test('bounded environment integers accept only finite safe values in range', () => {
  assert.equal(boundedEnvironmentInteger('LIMIT', 4, 1, 16, { LIMIT: '8' }), 8);
  assert.equal(boundedEnvironmentInteger('LIMIT', 4, 1, 16, { LIMIT: 'not-a-number' }), 4);
  assert.equal(boundedEnvironmentInteger('LIMIT', 4, 1, 16, { LIMIT: 'Infinity' }), 4);
  assert.equal(boundedEnvironmentInteger('LIMIT', 4, 1, 16, { LIMIT: '2.5' }), 4);
  assert.equal(boundedEnvironmentInteger('LIMIT', 4, 1, 16, { LIMIT: '17' }), 4);
  assert.equal(boundedEnvironmentInteger('LIMIT', 4, 1, 16, {}), 4);
});
