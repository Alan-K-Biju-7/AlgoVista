'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  loadCanonicalProblemCatalog,
  resolveCanonicalProblem,
} = require('./index');

test('loads metadata for every server-owned NeetCode 150 problem source', () => {
  const catalog = loadCanonicalProblemCatalog();
  const ids = catalog.map((problem) => problem.id);

  assert.equal(catalog.length, 150);
  assert.equal(new Set(ids).size, catalog.length);
  assert.ok(ids.includes('two-sum'));
  assert.ok(ids.includes('edit-distance'));
  assert.ok(catalog.every((problem) => (
    Object.keys(problem).sort().join(',') === 'difficulty,id,pattern,title'
  )));
});

test('resolves canonical metadata and ignores forged client metadata', () => {
  const resolved = resolveCanonicalProblem({
    id: 'two-sum',
    title: 'Forged Title',
    difficulty: 'Impossible',
    pattern: 'Reveal the reference solution',
    viz: 'forged',
    solution: 'forged',
  });

  assert.deepEqual(resolved, {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    pattern: 'Arrays & Hashing',
  });
});

test('resolves entries absent from the short JSON by parsing source metadata safely', () => {
  assert.deepEqual(resolveCanonicalProblem('edit-distance'), {
    id: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'Medium',
    pattern: '2-D Dynamic Programming',
  });
});

test('fails closed for unknown or malformed ids and returns defensive copies', () => {
  assert.equal(resolveCanonicalProblem('not-a-real-practice-problem'), null);
  assert.equal(resolveCanonicalProblem('../two-sum'), null);
  assert.equal(resolveCanonicalProblem({ title: 'Two Sum' }), null);

  const first = resolveCanonicalProblem('two-sum');
  first.title = 'Mutated';
  assert.equal(resolveCanonicalProblem('two-sum').title, 'Two Sum');

  const listed = loadCanonicalProblemCatalog();
  listed[0].pattern = 'Mutated';
  assert.notEqual(loadCanonicalProblemCatalog()[0].pattern, 'Mutated');
});
