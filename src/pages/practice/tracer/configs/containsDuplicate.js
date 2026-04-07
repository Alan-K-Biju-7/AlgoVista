export const containsDuplicateTracer = {
  defaultInput: { nums: [1, 2, 3, 1] },
  runnerBody: `
    const { nums } = __args__;
    const seen = new Set();
    __log__({ line: 0, message: 'Start: scan array, insert each into Set. If already present → duplicate found.', vars: { i: '-', 'nums[i]': '-', seenSize: 0 }, structure: { type: 'array', label: 'nums', items: nums.map((v,i) => ({ idx: i, val: v, role: null })) } });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      if (seen.has(n)) {
        __log__({ line: 3, message: '✓ Duplicate found! ' + n + ' is already in the Set → return true', vars: { i, 'nums[i]': n, inSet: true }, structure: { type: 'array', label: 'nums', items: nums.map((v, j) => ({ idx: j, val: v, role: v === n ? 'found' : seen.has(v) ? 'compare' : null })) } });
        return true;
      }
      seen.add(n);
      __log__({ line: 5, message: n + ' not in Set yet. Added to Set. Set size = ' + seen.size, vars: { i, 'nums[i]': n, inSet: false, setSize: seen.size }, structure: { type: 'array', label: 'nums', items: nums.map((v, j) => ({ idx: j, val: v, role: j === i ? 'current' : j < i ? 'compare' : null })) } });
    }
    __log__({ line: 7, message: 'Scanned all elements, no duplicate found → return false', vars: { result: false }, structure: { type: 'array', label: 'nums', items: nums.map((v,i) => ({ idx: i, val: v, role: null })) } });
    return false;
  `,
};
