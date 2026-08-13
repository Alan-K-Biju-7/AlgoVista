'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { normalizeSource, selectLicensedSources } = require('./retrievalCatalog');

const source = {
  id: 'licensed-two-sum', text: 'A map supports complement lookup.', conceptId: 'arrays',
  pattern: 'hash-map', misconception: 'pattern-selection', difficulty: 'easy',
  license: 'CC-BY-4.0', sourceUrl: 'https://example.test/dsa', revision: '2026-01',
  permittedUses: ['grounding', 'evaluation'],
};

test('fails closed when external retrieval provenance is incomplete', () => {
  assert.throws(() => normalizeSource({ id: 'scrape', text: 'unknown origin' }), /require a license/i);
});

test('retrieves licensed sources by pedagogical metadata', () => {
  const selected = selectLicensedSources([source], {
    conceptId: 'arrays', pattern: 'hash-map', misconception: 'pattern-selection', difficulty: 'easy',
  });
  assert.equal(selected[0].id, source.id);
  assert.equal(selected[0].provenance.license, 'CC-BY-4.0');
});
