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

export function runTestsAsync(code, testCases, { timeoutMs = 3000 } = {}) {
  const unavailable = () => withRuntime([{
    passed: false,
    kind: 'runner-unavailable',
    input: '',
    expected: '',
    got: '',
    error: 'The secure JavaScript runner is unavailable in this browser. Your code was not executed. Try a current browser or reload the page.',
  }], getNow());

  if (typeof Worker === 'undefined') return Promise.resolve(unavailable());

  const prepared = prepareCodeForRunner(code);
  if (prepared.unsupportedLanguageError) {
    return Promise.resolve(withRuntime([{
      passed: false,
      kind: 'unsupported-language',
      error: prepared.unsupportedLanguageError,
      input: '',
      expected: '',
      got: '',
    }], getNow()));
  }

  if (/\bimport\s*\(|\bimportScripts\s*\(/.test(prepared.code)) {
    return Promise.resolve(withRuntime([{
      passed: false,
      kind: 'unsupported-runtime-api',
      error: 'Dynamic imports are disabled in the isolated practice runner.',
      input: '',
      expected: '',
      got: '',
    }], getNow()));
  }

  return new Promise((resolve) => {
    let worker;
    try {
      const publicBase = String(import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      worker = new Worker(`${publicBase}/testRunnerWorker.js`);
    } catch {
      resolve(unavailable());
      return;
    }

    const startedAt = getNow();
    const requestId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    let activeCase = null;
    const timer = window.setTimeout(() => {
      worker.terminate();
      resolve(withRuntime([{
        passed: false,
        kind: 'timeout',
        caseIndex: activeCase?.caseIndex ?? 0,
        testSuiteSize: activeCase?.testSuiteSize ?? testCases.length,
        input: activeCase?.input || '',
        expected: activeCase?.expected || '',
        got: '',
        error: `Execution exceeded ${timeoutMs} ms on case ${(activeCase?.caseIndex ?? 0) + 1}. Check for an infinite loop or an algorithm that grows too quickly.`,
      }], startedAt));
    }, timeoutMs);

    worker.onmessage = (event) => {
      if (event.data?.protocol !== 'algovista-runner-v1' || event.data?.requestId !== requestId) {
        return;
      }
      if (event.data?.event === 'case-started') {
        activeCase = {
          caseIndex: Number(event.data.caseIndex) || 0,
          testSuiteSize: Number(event.data.testSuiteSize) || testCases.length,
          input: String(event.data.input || ''),
          expected: String(event.data.expected || ''),
        };
        return;
      }
      window.clearTimeout(timer);
      worker.terminate();
      const results = Array.isArray(event.data?.results) ? event.data.results : [];
      resolve(withRuntime(results, startedAt));
    };

    worker.onerror = (event) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(withRuntime([{
        passed: false,
        kind: 'runtime',
        input: '',
        expected: '',
        got: '',
        error: event.message || 'The isolated runner stopped unexpectedly.',
      }], startedAt));
    };

    worker.postMessage({
      protocol: 'algovista-runner-v1',
      requestId,
      code: prepared.code,
      testCases,
    });
  });
}
