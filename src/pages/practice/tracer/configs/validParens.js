export const validParensTracer = {
  defaultInput: { s: '()[{}]' },
  runner(__args__, __log__) {
    const { s } = __args__;
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    __log__({ line: 0, message: 'Start: scan string "' + s + '". Push openers, match closers.', vars: { char: '-', stack: '[]' }, structure: { type: 'stack', label: 'Stack', items: [], } });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const isOpener = '([{'.includes(c);
      if (isOpener) {
        stack.push(c);
        __log__({ line: 4, message: 'char "' + c + '" is an opener → push to stack', vars: { i, char: c, stackSize: stack.length }, structure: { type: 'stack', label: 'Stack', items: [...stack].reverse().map((v, j) => ({ val: v, isTop: j === 0, role: j === 0 ? 'current' : null })) } });
      } else {
        const top = stack.pop();
        const matches = top === map[c];
        __log__({ line: 7, message: 'char "' + c + '" is a closer. Expected "' + map[c] + '", got "' + (top || 'empty') + '" → ' + (matches ? '✓ match' : '✗ mismatch → invalid!'), vars: { i, char: c, expected: map[c], got: top || 'empty', match: matches }, structure: { type: 'stack', label: 'Stack', items: [...stack].reverse().map((v, j) => ({ val: v, isTop: j === 0, role: null })) } });
        if (!matches) return false;
      }
    }
    const valid = stack.length === 0;
    __log__({ line: 10, message: valid ? '✓ Stack is empty → all brackets matched → true' : '✗ Stack not empty → unmatched openers remain → false', vars: { stackSize: stack.length, result: valid }, structure: { type: 'stack', label: 'Stack', items: [...stack].reverse().map((v, j) => ({ val: v, isTop: j === 0, role: null })) } });
    return valid;
  },
};
