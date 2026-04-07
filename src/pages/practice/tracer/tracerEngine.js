const MAX_STEPS = 500;
const TIMEOUT_MS = 3000;

export function runWithTracer(code, inputArgs, tracerConfig) {
  const steps = [];

  const log = (step) => {
    if (steps.length >= MAX_STEPS) throw new Error('__step_limit__');
    steps.push({ ...step, timestamp: steps.length });
  };

  // Timeout via Date — safe inside new Function (no Worker needed)
  const deadline = Date.now() + TIMEOUT_MS;
  const guardedLog = (step) => {
    if (Date.now() > deadline) throw new Error('__timeout__');
    log(step);
  };

  try {
    const sandboxCode = `
      "use strict";
      ${code}
      return function __run__(__args__, __log__) {
        ${tracerConfig.runnerBody}
      }
    `;
    // eslint-disable-next-line no-new-func
    const factory = new Function(sandboxCode);
    const runner = factory();
    runner(inputArgs, guardedLog);
  } catch (e) {
    const msg =
      e.message === '__step_limit__'
        ? `Trace stopped after ${MAX_STEPS} steps to protect performance. Simplify your input or algorithm.`
        : e.message === '__timeout__'
        ? `Execution timed out after ${TIMEOUT_MS / 1000}s. Check for infinite loops.`
        : e.message?.includes('is not defined')
        ? `${e.message}. Make sure your function name matches the starter code.`
        : e.message?.includes('is not a function')
        ? `Your function signature may be wrong. Check that it matches the starter code.`
        : `Runtime error: ${e.message}`;

    steps.push({ type: 'error', message: msg, line: null, vars: {}, structure: null, timestamp: steps.length });
  }

  return steps;
}

export function diffSnapshots(prev, curr) {
  if (!prev || !curr) return new Set();
  const changed = new Set();
  for (const key of Object.keys(curr)) {
    if (JSON.stringify(prev[key]) !== JSON.stringify(curr[key])) changed.add(key);
  }
  return changed;
}
