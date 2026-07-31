(() => {
'use strict';

// This worker is an availability and DOM-isolation boundary. Keep learner code
// away from page state, authenticated APIs, browser storage, and the response
// protocol. A future multi-language judge can replace this transport without
// changing the Practice UI contract.
// Keep every trusted capability inside this closure. Function-constructor code
// runs in the worker's global environment, so top-level lexical bindings would
// otherwise be visible to learner source.
const workerGlobal = self;
const nativePostMessage = workerGlobal.postMessage.bind(workerGlobal);
const NativeFunction = Function;
const NativeAsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const NativeGeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
const NativeAsyncGeneratorFunction = Object.getPrototypeOf(async function* () {}).constructor;
const nativeArrayIsArray = Array.isArray.bind(Array);
const nativeArrayMap = Function.call.bind(Array.prototype.map);
const nativeArrayEvery = Function.call.bind(Array.prototype.every);
const nativeArrayFilter = Function.call.bind(Array.prototype.filter);
const nativeArrayForEach = Function.call.bind(Array.prototype.forEach);
const nativeJsonParse = JSON.parse.bind(JSON);
const nativeJsonStringify = JSON.stringify.bind(JSON);
const nativeObjectIs = Object.is.bind(Object);
const nativeObjectKeys = Object.keys.bind(Object);
const nativeDefineProperty = Object.defineProperty.bind(Object);
const nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor.bind(Object);
const nativeGetPrototypeOf = Object.getPrototypeOf.bind(Object);
const nativeHasOwn = Function.call.bind(Object.prototype.hasOwnProperty);
const nativeMathAbs = Math.abs.bind(Math);
const nativeMathMax = Math.max.bind(Math);
const nativeMathRound = Math.round.bind(Math);
const nativeNow = performance.now.bind(performance);
const nativeString = String;
const nativeStringSlice = Function.call.bind(String.prototype.slice);
const blockedApi = () => {
  throw new Error('Network, storage, and worker APIs are unavailable in the practice runner.');
};

function replaceOwnProperty(target, name, value) {
  const descriptor = nativeGetOwnPropertyDescriptor(target, name);
  if (!descriptor) return true;
  try {
    nativeDefineProperty(target, name, {
      value,
      configurable: false,
      enumerable: false,
      writable: false,
    });
    return target[name] === value;
  } catch {
    return false;
  }
}

function sealReachableProperty(target, name, value) {
  let cursor = target;
  let safe = true;
  while (cursor) {
    if (nativeGetOwnPropertyDescriptor(cursor, name)) {
      safe = replaceOwnProperty(cursor, name, value) && safe;
    }
    cursor = nativeGetPrototypeOf(cursor);
  }
  if (!nativeGetOwnPropertyDescriptor(target, name)) {
    try {
      nativeDefineProperty(target, name, {
        value,
        configurable: false,
        enumerable: false,
        writable: false,
      });
    } catch {
      safe = false;
    }
  }
  return safe && target[name] === value;
}

const sealedGlobals = [
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts',
  'Worker', 'SharedWorker', 'BroadcastChannel', 'WebTransport',
  'WebSocketStream', 'RTCPeerConnection', 'webkitRTCPeerConnection',
  'FontFace', 'Notification', 'fetchLater', 'open',
  'setTimeout', 'setInterval', 'queueMicrotask', 'eval',
].every((name) => sealReachableProperty(workerGlobal, name, blockedApi));
const sealedStorage = ['indexedDB', 'caches', 'cookieStore', 'localStorage', 'sessionStorage']
  .every((name) => sealReachableProperty(workerGlobal, name, undefined));
const sealedMessaging = sealReachableProperty(workerGlobal, 'postMessage', blockedApi);

// Prevent learner code from manufacturing a fresh evaluator through
// (() => {}).constructor, async/generator variants, or global Function/eval.
const sealedConstructors = [
  NativeFunction.prototype,
  NativeAsyncFunction.prototype,
  NativeGeneratorFunction.prototype,
  NativeAsyncGeneratorFunction.prototype,
].every((prototype) => replaceOwnProperty(prototype, 'constructor', blockedApi));
const sealedFunctionGlobal = sealReachableProperty(workerGlobal, 'Function', blockedApi);

const sealedNavigator = !workerGlobal.navigator || (
  sealReachableProperty(workerGlobal.navigator, 'sendBeacon', blockedApi)
  && ['storage', 'locks', 'clipboard', 'serviceWorker']
    .every((name) => sealReachableProperty(workerGlobal.navigator, name, undefined))
);
const isolationReady = sealedGlobals
  && sealedStorage
  && sealedMessaging
  && sealedConstructors
  && sealedFunctionGlobal
  && sealedNavigator;

const MAX_FORMATTED_CHARS = 12_000;
const KNOWN_FUNCTION_NAMES = [
  'solve', 'twoSum', 'containsDuplicate', 'maxProfit', 'maxSubArray',
  'productExceptSelf', 'isValid', 'dailyTemperatures', 'hasCycle', 'search',
  'findMin', 'minEatingSpeed', 'findKthLargest', 'topKFrequent', 'canFinish',
  'numIslands', 'sortColors',
];

function candidateNames(code) {
  const names = new Set(KNOWN_FUNCTION_NAMES);
  const identifier = '[A-Za-z_$][\\w$]*';
  const patterns = [
    new RegExp(`function\\s+(${identifier})\\s*\\(`, 'g'),
    new RegExp(`(?:const|let|var)\\s+(${identifier})\\s*=\\s*function\\b`, 'g'),
    new RegExp(`(?:const|let|var)\\s+(${identifier})\\s*=\\s*(?:async\\s*)?(?:\\([^)]*\\)|${identifier})\\s*=>`, 'g'),
  ];
  nativeArrayForEach(patterns, (pattern) => {
    let match = pattern.exec(code);
    while (match) {
      names.add(match[1]);
      match = pattern.exec(code);
    }
  });
  return nativeArrayFilter([...names], (name) => /^[A-Za-z_$][\w$]*$/.test(name));
}

function clone(value) {
  return nativeJsonParse(nativeJsonStringify(value));
}

function boundedValue(value) {
  try {
    const serialized = nativeJsonStringify(value);
    if (serialized === undefined) return undefined;
    if (serialized.length > MAX_FORMATTED_CHARS) return '[output omitted: exceeded 12,000 characters]';
    return nativeJsonParse(serialized);
  } catch {
    return '[output omitted: value is not serializable]';
  }
}

function equal(actual, expected) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    return nativeObjectIs(actual, expected) || nativeMathAbs(actual - expected) < 1e-9;
  }
  if (nativeArrayIsArray(actual) && nativeArrayIsArray(expected)) {
    return actual.length === expected.length
      && nativeArrayEvery(actual, (value, index) => equal(value, expected[index]));
  }
  if (actual && expected && typeof actual === 'object' && typeof expected === 'object' && !nativeArrayIsArray(actual) && !nativeArrayIsArray(expected)) {
    const actualKeys = nativeObjectKeys(actual);
    const expectedKeys = nativeObjectKeys(expected);
    return actualKeys.length === expectedKeys.length
      && nativeArrayEvery(actualKeys, (key) => nativeHasOwn(expected, key) && equal(actual[key], expected[key]));
  }
  return nativeObjectIs(actual, expected);
}

function format(value) {
  let text;
  try {
    const json = nativeJsonStringify(value);
    text = json === undefined ? nativeString(value) : json;
  } catch {
    text = '[value is not serializable]';
  }
  return text.length > MAX_FORMATTED_CHARS
    ? `${nativeStringSlice(text, 0, MAX_FORMATTED_CHARS)}…`
    : text;
}

function execute(code, testCases, onCaseStart = () => {}) {
  if (!isolationReady) {
    return [{ passed: false, kind: 'runner-unavailable', error: 'The browser could not establish the isolated runner boundary.', input: '', expected: '', got: '' }];
  }
  if (/\b(?:import|export)\b/.test(code)) {
    return [{ passed: false, kind: 'unsupported-runtime-api', error: 'Module loading is disabled in the isolated practice runner.', input: '', expected: '', got: '' }];
  }
  let fn;
  try {
    const resolver = nativeArrayMap(
      candidateNames(code),
      (name) => `typeof ${name} !== 'undefined' ? ${name} :`
    ).join('\n  ');
    fn = new NativeFunction(
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'EventSource',
      `"use strict";\n${code}\nreturn ${resolver}\n  null;`
    )(undefined, undefined, undefined, undefined);
  } catch (error) {
    return [{ passed: false, kind: 'syntax', error: `Syntax error: ${error.message}`, input: '', expected: '', got: '' }];
  }
  if (!fn) {
    return [{ passed: false, kind: 'runtime', error: 'Could not find a function to test. Define function solve(...) for this practice problem.', input: '', expected: '', got: '' }];
  }

  return nativeArrayMap(testCases, (testCase, caseIndex) => {
    onCaseStart({
      caseIndex,
      input: format(testCase.input),
      expected: format(testCase.expected),
    });
    const startedAt = nativeNow();
    try {
      const inputCopy = clone(testCase.input);
      const returned = fn(...inputCopy);
      const actual = returned === undefined ? inputCopy[0] : returned;
      const passed = equal(actual, testCase.expected);
      return {
        passed,
        kind: passed ? 'accepted' : 'wrong-answer',
        input: format(testCase.input),
        expected: format(testCase.expected),
        got: format(actual),
        actualValue: boundedValue(actual),
        expectedValue: boundedValue(testCase.expected),
        durationMs: nativeMathMax(0, nativeMathRound((nativeNow() - startedAt) * 100) / 100),
        error: null,
      };
    } catch (error) {
      return {
        passed: false,
        kind: 'runtime',
        input: format(testCase.input),
        expected: format(testCase.expected),
        got: '',
        actualValue: undefined,
        expectedValue: testCase.expected,
        durationMs: nativeMathMax(0, nativeMathRound((nativeNow() - startedAt) * 100) / 100),
        error: error.message,
      };
    }
  });
}

const handleMessage = (event) => {
  const request = event.data || {};
  if (request.protocol !== 'algovista-runner-v1' || typeof request.requestId !== 'string') return;
  // A runner handles exactly one request. Hide the trusted handler before any
  // learner instruction runs so source cannot invoke it with a forged event.
  if (!replaceOwnProperty(workerGlobal, 'onmessage', blockedApi)) {
    nativePostMessage({
      protocol: 'algovista-runner-v1',
      requestId: request.requestId,
      event: 'complete',
      results: [{ passed: false, kind: 'runner-unavailable', error: 'The browser could not seal the runner message channel.', input: '', expected: '', got: '' }],
    });
    return;
  }
  const testCases = nativeArrayIsArray(request.testCases) ? request.testCases : [];
  const results = execute(nativeString(request.code || ''), testCases, (activeCase) => {
    nativePostMessage({
      protocol: 'algovista-runner-v1',
      requestId: request.requestId,
      event: 'case-started',
      testSuiteSize: testCases.length,
      ...activeCase,
    });
  });
  nativePostMessage({
    protocol: 'algovista-runner-v1',
    requestId: request.requestId,
    event: 'complete',
    results,
  });
};

nativeDefineProperty(workerGlobal, 'onmessage', {
  value: handleMessage,
  configurable: true,
  enumerable: false,
  writable: true,
});
})();
