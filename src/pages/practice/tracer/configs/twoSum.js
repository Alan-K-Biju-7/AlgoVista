export const twoSumTracer = {
  defaultInput: { nums: [2, 7, 11, 15], target: 9 },
  runnerBody: `
    const { nums, target } = __args__;
    const map = {};
    __log__({ line: 0, message: 'Start: scan array looking for two numbers that sum to ' + target, vars: { target, i: '-', complement: '-', result: '-' }, structure: { type: 'array', label: 'nums', items: nums.map((v,i) => ({ idx: i, val: v, role: null })) } });

    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      __log__({ line: 2, message: 'i=' + i + ': nums[i]=' + nums[i] + ', looking for complement ' + complement + ' in map', vars: { i, 'nums[i]': nums[i], complement, map: JSON.stringify(map) }, structure: { type: 'array', label: 'nums', items: nums.map((v, j) => ({ idx: j, val: v, role: j === i ? 'current' : null })) } });

      if (complement in map) {
        __log__({ line: 3, message: '✓ Found! complement ' + complement + ' is at index ' + map[complement] + '. Answer = [' + map[complement] + ', ' + i + ']', vars: { i, complement, 'map[complement]': map[complement], result: '[' + map[complement] + ',' + i + ']' }, structure: { type: 'array', label: 'nums', items: nums.map((v, j) => ({ idx: j, val: v, role: j === i || j === map[complement] ? 'found' : null })) } });
        return [map[complement], i];
      }

      map[nums[i]] = i;
      __log__({ line: 5, message: 'Not found yet. Stored ' + nums[i] + ':' + i + ' in map', vars: { i, 'nums[i]': nums[i], complement, map: JSON.stringify(map) }, structure: { type: 'hashmap', label: 'Hash Map {num: index}', entries: Object.entries(map).map(([k,v]) => ({ key: k, val: v, role: String(k) === String(nums[i]) ? 'new' : null })) } });
    }
  `,
};
