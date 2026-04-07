export const maxSubarrayTracer = {
  defaultInput: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  runnerBody: `
    const { nums } = __args__;
    let cur = nums[0], best = nums[0];
    __log__({ line: 0, message: 'Init: cur=' + cur + ', best=' + best, vars: { i: 0, cur, best }, structure: { type: 'array', label: 'nums', items: nums.map((v,i) => ({ idx: i, val: v, role: i === 0 ? 'current' : null })) } });

    for (let i = 1; i < nums.length; i++) {
      const extend = cur + nums[i];
      const fresh  = nums[i];
      const prev_cur = cur;
      cur = Math.max(fresh, extend);
      best = Math.max(best, cur);
      const decision = cur === fresh && fresh > extend ? 'reset' : 'extend';
      __log__({
        line: 4,
        message: 'i=' + i + ': nums[i]=' + nums[i] + ' | extend=' + extend.toFixed(0) + ' vs fresh=' + fresh + ' → ' + (decision === 'reset' ? 'Start fresh (reset subarray)' : 'Extend subarray') + ' | cur=' + cur + ', best=' + best,
        vars: { i, 'nums[i]': nums[i], extend, fresh, cur, best, decision },
        structure: { type: 'array', label: 'nums', items: nums.map((v, j) => ({ idx: j, val: v, role: j === i ? (decision === 'reset' ? 'min' : 'current') : j < i && v >= 0 ? 'compare' : null })) },
      });
    }
    __log__({ line: 8, message: 'Done. Maximum subarray sum = ' + best, vars: { result: best }, structure: { type: 'array', label: 'nums', items: nums.map((v,i) => ({ idx: i, val: v, role: null })) } });
  `,
};
