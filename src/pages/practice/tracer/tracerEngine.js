// Instruments user code and captures execution steps
export function runWithTracer(code, inputArgs, tracerConfig) {
  const steps = [];
  const log = (step) => steps.push({ ...step, timestamp: steps.length });

  try {
    // Build a sandbox with injected __log__ and __snap__ helpers
    const sandboxCode = `
      ${code}
      return function __run__(__args__, __log__) {
        ${tracerConfig.runnerBody}
      }
    `;
    // eslint-disable-next-line no-new-func
    const factory = new Function(sandboxCode);
    const runner = factory();
    runner(inputArgs, log);
  } catch (e) {
    steps.push({
      type: 'error',
      message: e.message,
      line: null,
      vars: {},
      structure: null,
      timestamp: steps.length,
    });
  }

  return steps;
}

// Diff two snapshots — returns set of keys that changed
export function diffSnapshots(prev, curr) {
  if (!prev || !curr) return new Set();
  const changed = new Set();
  for (const key of Object.keys(curr)) {
    if (JSON.stringify(prev[key]) !== JSON.stringify(curr[key])) {
      changed.add(key);
    }
  }
  return changed;
}
