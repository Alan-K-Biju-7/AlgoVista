export const binarySearchTracer = {
  defaultInput: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
  runnerBody: `
    const { nums, target } = __args__;
    let lo = 0, hi = nums.length - 1;
    __log__({ line: 0, message: 'Start: lo=' + lo + ', hi=' + hi + ', searching for target=' + target, vars: { lo, hi, mid: '-', target }, structure: { type: 'array', label: 'nums', items: nums.map((v,i) => ({ idx: i, val: v, role: i >= lo && i <= hi ? 'window' : 'eliminated' })) } });

    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      __log__({ line: 2, message: 'mid=' + mid + ' → nums[mid]=' + nums[mid] + (nums[mid] === target ? ' ✓ FOUND!' : nums[mid] < target ? ' < target, go RIGHT' : ' > target, go LEFT'), vars: { lo, hi, mid, 'nums[mid]': nums[mid], target }, structure: { type: 'array', label: 'nums', items: nums.map((v,i) => ({ idx: i, val: v, role: i === mid ? (v === target ? 'found' : 'current') : i >= lo && i <= hi && i !== mid ? 'window' : 'eliminated' })) } });

      if (nums[mid] === target) { return mid; }
      else if (nums[mid] < target) { lo = mid + 1; }
      else { hi = mid - 1; }
    }
    __log__({ line: 7, message: 'lo > hi — target not found → return -1', vars: { lo, hi, result: -1 }, structure: { type: 'array', label: 'nums', items: nums.map((v,i) => ({ idx: i, val: v, role: 'eliminated' })) } });
    return -1;
  `,
};
