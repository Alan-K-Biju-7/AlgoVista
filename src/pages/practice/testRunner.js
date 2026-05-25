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
  const results = [];
  let fn;
  try {
    const resolver = getCandidateFunctionNames(code)
      .map((name) => `typeof ${name} !== 'undefined' ? ${name} :`)
      .join('\n  ');

    // eslint-disable-next-line no-new-func
    fn = new Function(`${code}
return ${resolver}
  null;`)();
  } catch (e) {
    return [{ passed: false, error: `Syntax error: ${e.message}`, input: '', expected: '', got: '' }];
  }
  if (!fn) return [{ passed: false, error: 'Could not find a function to test. Define function solve(...) for this practice problem.', input: '', expected: '', got: '' }];
  for (const tc of testCases) {
    try {
      const inputCopy = cloneInput(tc.input);
      const returned = fn(...inputCopy);
      const got = returned === undefined ? inputCopy[0] : returned;
      const passed = valuesEqual(got, tc.expected);
      results.push({ passed, input: formatValue(tc.input), expected: formatValue(tc.expected), got: formatValue(got), error: null });
    } catch (e) {
      results.push({ passed: false, input: formatValue(tc.input), expected: formatValue(tc.expected), got: '', error: e.message });
    }
  }
  return results;
}
