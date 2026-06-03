const KNOWN_FUNCTION_NAMES = [
  'solve',
  'twoSum',
  'containsDuplicate',
  'maxProfit',
  'maxSubArray',
  'productExceptSelf',
  'isValid',
  'dailyTemperatures',
  'hasCycle',
  'search',
  'findMin',
  'minEatingSpeed',
  'findKthLargest',
  'topKFrequent',
  'canFinish',
  'numIslands',
  'sortColors',
];

function getCandidateFunctionNames(code) {
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

function cloneInput(input) {
  return JSON.parse(JSON.stringify(input));
}

function getNow() {
  return typeof performance !== 'undefined' && performance.now
    ? performance.now()
    : Date.now();
}

function withRuntime(results, startedAt) {
  Object.defineProperty(results, 'runtimeMs', {
    value: Math.max(0, Math.round(getNow() - startedAt)),
    enumerable: false,
    configurable: true,
  });
  return results;
}

function stripCodeFence(code) {
  const trimmed = code.trim();
  const fence = trimmed.match(/^```([A-Za-z0-9_-]+)?\s*\n([\s\S]*?)\n```$/);
  return fence ? fence[2] : code;
}

function normalizeHashLineComments(code) {
  return code
    .split('\n')
    .map((line) => (/^\s*#(?!!)/.test(line) ? line.replace('#', '//') : line))
    .join('\n');
}

function getUnsupportedLanguageError(code) {
  const trimmed = code.trim();
  const fenced = trimmed.match(/^```([A-Za-z0-9_-]+)/);
  const fencedLanguage = fenced?.[1]?.toLowerCase();
  if (fencedLanguage && !['js', 'javascript'].includes(fencedLanguage)) {
    return `The pasted code block is marked as ${fencedLanguage}. AlgoVista's in-browser runner currently supports JavaScript.`;
  }

  const looksPython =
    /^\s*(class|def)\s+[A-Za-z_][\w]*(?:\([^)]*\))?\s*:/m.test(code) ||
    /^\s*(from\s+\w+|import\s+\w+)/m.test(code) ||
    /\bself\b/.test(code) ||
    /\bNone\b/.test(code);

  if (looksPython) {
    return 'Python-style code was detected. Use JavaScript with a function named solve(...) for runnable practice tests.';
  }

  return null;
}

function prepareCodeForRunner(code) {
  const unsupportedLanguageError = getUnsupportedLanguageError(code);
  if (unsupportedLanguageError) {
    return { code, unsupportedLanguageError };
  }

  return {
    code: normalizeHashLineComments(stripCodeFence(code)),
    unsupportedLanguageError: null,
  };
}

function formatValue(value) {
  const json = JSON.stringify(value);
  return json === undefined ? String(value) : json;
}

function valuesEqual(actual, expected) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Object.is(actual, expected) || Math.abs(actual - expected) < 1e-9;
  }

  if (Array.isArray(actual) && Array.isArray(expected)) {
    return (
      actual.length === expected.length &&
      actual.every((value, index) => valuesEqual(value, expected[index]))
    );
  }

  if (
    actual &&
    expected &&
    typeof actual === 'object' &&
    typeof expected === 'object' &&
    !Array.isArray(actual) &&
    !Array.isArray(expected)
  ) {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    return (
      actualKeys.length === expectedKeys.length &&
      actualKeys.every((key) => Object.prototype.hasOwnProperty.call(expected, key)) &&
      actualKeys.every((key) => valuesEqual(actual[key], expected[key]))
    );
  }

  return Object.is(actual, expected);
}

export function runTests(code, testCases) {
  const startedAt = getNow();
  const prepared = prepareCodeForRunner(code);
  if (prepared.unsupportedLanguageError) {
    return withRuntime([{
      passed: false,
      kind: 'unsupported-language',
      error: prepared.unsupportedLanguageError,
      input: '',
      expected: '',
      got: '',
    }], startedAt);
  }

  const results = [];
  let fn;
  try {
    const resolver = getCandidateFunctionNames(prepared.code)
      .map((name) => `typeof ${name} !== 'undefined' ? ${name} :`)
      .join('\n  ');

    // eslint-disable-next-line no-new-func
    fn = new Function(`${prepared.code}
return ${resolver}
  null;`)();
  } catch (e) {
    return withRuntime([{
      passed: false,
      kind: 'syntax',
      error: `Syntax error: ${e.message}`,
      input: '',
      expected: '',
      got: '',
    }], startedAt);
  }
  if (!fn) {
    return withRuntime([{
      passed: false,
      kind: 'runtime',
      error: 'Could not find a function to test. Define function solve(...) for this practice problem.',
      input: '',
      expected: '',
      got: '',
    }], startedAt);
  }

  for (const tc of testCases) {
    try {
      const inputCopy = cloneInput(tc.input);
      const returned = fn(...inputCopy);
      const got = returned === undefined ? inputCopy[0] : returned;
      const passed = valuesEqual(got, tc.expected);
      results.push({
        passed,
        kind: passed ? 'accepted' : 'wrong-answer',
        input: formatValue(tc.input),
        expected: formatValue(tc.expected),
        got: formatValue(got),
        error: null,
      });
    } catch (e) {
      results.push({
        passed: false,
        kind: 'runtime',
        input: formatValue(tc.input),
        expected: formatValue(tc.expected),
        got: '',
        error: e.message,
      });
    }
  }
  return withRuntime(results, startedAt);
}
