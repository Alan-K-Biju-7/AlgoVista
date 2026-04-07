export const dailyTempsTracer = {
  defaultInput: { temps: [73, 74, 75, 71, 69, 72, 76, 73] },
  runnerBody: `
    const { temps } = __args__;
    const res = new Array(temps.length).fill(0);
    const stack = [];
    __log__({ line: 0, message: 'Start: monotonic decreasing stack of indices. For each day find next warmer day.', vars: { i: '-', stackIndices: '[]' }, structure: { type: 'array', label: 'temps', items: temps.map((v,i) => ({ idx: i, val: v, role: null })) } });

    for (let i = 0; i < temps.length; i++) {
      while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
        const j = stack.pop();
        res[j] = i - j;
        __log__({ line: 4, message: 'temps[' + i + ']=' + temps[i] + ' > temps[' + j + ']=' + temps[j] + ' → res[' + j + '] = ' + (i-j) + ' days', vars: { i, j, 'temps[i]': temps[i], 'temps[j]': temps[j], 'res[j]': i - j }, structure: { type: 'array', label: 'temps', items: temps.map((v, k) => ({ idx: k, val: v, role: k === i ? 'current' : k === j ? 'found' : stack.includes(k) ? 'compare' : null })) } });
      }
      stack.push(i);
      __log__({ line: 6, message: 'Push index ' + i + ' (temp=' + temps[i] + ') onto stack. Stack: [' + stack.join(',') + ']', vars: { i, 'temps[i]': temps[i], stack: '[' + stack.join(',') + ']', resultSoFar: '[' + res.join(',') + ']' }, structure: { type: 'array', label: 'temps', items: temps.map((v, k) => ({ idx: k, val: v, role: k === i ? 'current' : stack.includes(k) ? 'compare' : null })) } });
    }
    __log__({ line: 8, message: 'Done. Result: [' + res.join(',') + ']', vars: { result: '[' + res.join(',') + ']' }, structure: { type: 'array', label: 'result', items: res.map((v,i) => ({ idx: i, val: v, role: v > 0 ? 'found' : null })) } });
  `,
};
