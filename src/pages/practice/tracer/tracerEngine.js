const MAX_STEPS = 500;
const TIMEOUT_MS = 3000;

export function runWithTracer(_code, inputArgs, tracerConfig) {
  const steps = [];
  const deadline = Date.now() + TIMEOUT_MS;

  const log = (step) => {
    if (Date.now() > deadline) throw new Error('__timeout__');
    if (steps.length >= MAX_STEPS) throw new Error('__step_limit__');
    // Deep clone structure + vars to prevent reference mutation
    steps.push({
      ...step,
      vars: step.vars ? JSON.parse(JSON.stringify(step.vars)) : {},
      structure: step.structure ? JSON.parse(JSON.stringify(step.structure)) : null,
      timestamp: steps.length,
    });
  };

  try {
    // Deep clone inputs so user mutations don't corrupt snapshots
    const safeArgs = JSON.parse(JSON.stringify(inputArgs));

    // Trace recipes are imported repository-owned functions. Learner source is
    // deliberately not evaluated here, and no string compilation is needed in
    // the application realm, so the production CSP can keep unsafe-eval off.
    if (typeof tracerConfig?.runner !== 'function') {
      throw new Error('__missing_trace_recipe__');
    }
    tracerConfig.runner(safeArgs, log);

  } catch (e) {
    let msg;
    if (e.message === '__timeout__')
      msg = `Execution timed out after ${TIMEOUT_MS / 1000}s. Check for infinite loops.`;
    else if (e.message === '__step_limit__')
      msg = `Trace stopped after ${MAX_STEPS} steps. Try a smaller input.`;
    else if (e.message === '__missing_trace_recipe__')
      msg = 'This problem does not have a trusted reference trace yet.';
    else if (e.message === 'Script error.' || !e.message)
      msg = `A cross-origin script error occurred. This usually means a syntax error in your code or an unsupported browser API. Check your code carefully.`;
    else if (/is not defined/.test(e.message))
      msg = `${e.message} — Check your function name matches the starter code exactly.`;
    else if (/is not a function/.test(e.message))
      msg = `${e.message} — Your function signature may be wrong.`;
    else if (/Maximum call stack/.test(e.message))
      msg = `Stack overflow! Your recursive function has no base case or recurses too deeply.`;
    else
      msg = `Runtime error: ${e.message}`;

    steps.push({ type: 'error', message: msg, line: null, vars: {}, structure: null, timestamp: 0 });
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
