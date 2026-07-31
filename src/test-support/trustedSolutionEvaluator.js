// Test-only evaluator for AlgoVista-authored reference solutions.
//
// Learner code must never use this path. The production practice workspace
// executes JavaScript only inside the time-limited worker in
// public/testRunnerWorker.js. Keeping this helper outside that module prevents
// Vite from including a main-thread evaluator in the browser bundle.

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

  for (const pattern of patterns) {
    let match = pattern.exec(code);
    while (match) {
      names.add(match[1]);
      match = pattern.exec(code);
    }
  }
  return [...names].filter((name) => /^[A-Za-z_$][\w$]*$/.test(name));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function equal(actual, expected) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Object.is(actual, expected) || Math.abs(actual - expected) < 1e-9;
  }
  if (Array.isArray(actual) && Array.isArray(expected)) {
    return actual.length === expected.length
      && actual.every((value, index) => equal(value, expected[index]));
  }
  if (actual && expected && typeof actual === 'object' && typeof expected === 'object') {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    return actualKeys.length === expectedKeys.length
      && actualKeys.every((key) => Object.prototype.hasOwnProperty.call(expected, key))
      && actualKeys.every((key) => equal(actual[key], expected[key]));
  }
  return Object.is(actual, expected);
}

function format(value) {
  const json = JSON.stringify(value);
  return json === undefined ? String(value) : json;
}

export function evaluateTrustedReferenceSolution(code, testCases) {
  if (import.meta.env.PROD) {
    throw new Error('The trusted reference evaluator is disabled in production.');
  }

  let solution;
  try {
    const resolver = candidateNames(code)
      .map((name) => `typeof ${name} !== 'undefined' ? ${name} :`)
      .join('\n  ');
    // This receives repository-authored fixtures only and is never imported by
    // the production app. Do not reuse it for learner input.
    // eslint-disable-next-line no-new-func
    solution = new Function(`${code}\nreturn ${resolver}\n  null;`)();
  } catch (error) {
    return [{
      passed: false,
      kind: 'syntax',
      error: `Syntax error: ${error.message}`,
      input: '',
      expected: '',
      got: '',
    }];
  }

  if (!solution) {
    return [{
      passed: false,
      kind: 'runtime',
      error: 'Could not find a reference solution function.',
      input: '',
      expected: '',
      got: '',
    }];
  }

  return testCases.map((testCase) => {
    try {
      const inputCopy = clone(testCase.input);
      const returned = solution(...inputCopy);
      const actual = returned === undefined ? inputCopy[0] : returned;
      return {
        passed: equal(actual, testCase.expected),
        input: format(testCase.input),
        expected: format(testCase.expected),
        got: format(actual),
        error: null,
      };
    } catch (error) {
      return {
        passed: false,
        kind: 'runtime',
        input: format(testCase.input),
        expected: format(testCase.expected),
        got: '',
        error: error.message,
      };
    }
  });
}
