// These checks give useful editor feedback. Learner source is never executed
// by the reference tracer; only repository-owned trace recipes are evaluated.
export function validateCodeForTracer(code, tracerConfig) {
  const warnings = [];
  const errors   = [];

  if (!code || code.trim().length < 10) {
    errors.push('Code is empty. Write your solution first.');
    return { valid: false, errors, warnings };
  }

  // Dangerous patterns
  if (/while\s*\(\s*true\s*\)/.test(code))
    warnings.push('Infinite loop detected (while(true)). The reference trace is safe, but your submitted solution would time out.');

  if (/fetch\(|XMLHttpRequest|localStorage|sessionStorage/.test(code))
    warnings.push('Network/storage APIs are not part of interview-style solutions and are never run by the reference tracer.');

  if (/import\s|require\(/.test(code))
    warnings.push('import/require are not supported in the tracer. Use plain JS only.');

  if (/async\s+function|await\s/.test(code))
    warnings.push('async/await is not supported in tracer mode. Synchronous code only.');

  // Check function name exists
  if (tracerConfig?.expectedFnName) {
    const fnPattern = new RegExp(`function\\s+${tracerConfig.expectedFnName}\\s*\\(`);
    const arrowPattern = new RegExp(`(?:const|let|var)\\s+${tracerConfig.expectedFnName}\\s*=`);
    if (!fnPattern.test(code) && !arrowPattern.test(code)) {
      warnings.push(`Expected function "${tracerConfig.expectedFnName}" not found. Make sure your function name matches.`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
