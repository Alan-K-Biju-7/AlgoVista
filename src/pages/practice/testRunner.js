export function runTests(code, testCases) {
  const results = [];
  let fn;
  try {
    // eslint-disable-next-line no-new-func
    fn = new Function(`${code}\nreturn typeof solve!=='undefined'?solve:typeof twoSum!=='undefined'?twoSum:typeof containsDuplicate!=='undefined'?containsDuplicate:typeof maxProfit!=='undefined'?maxProfit:typeof maxSubArray!=='undefined'?maxSubArray:typeof productExceptSelf!=='undefined'?productExceptSelf:typeof isValid!=='undefined'?isValid:typeof dailyTemperatures!=='undefined'?dailyTemperatures:typeof hasCycle!=='undefined'?hasCycle:typeof search!=='undefined'?search:typeof findMin!=='undefined'?findMin:typeof minEatingSpeed!=='undefined'?minEatingSpeed:typeof findKthLargest!=='undefined'?findKthLargest:typeof topKFrequent!=='undefined'?topKFrequent:typeof canFinish!=='undefined'?canFinish:typeof numIslands!=='undefined'?numIslands:typeof sortColors!=='undefined'?sortColors:null`)();
  } catch (e) {
    return [{ passed: false, error: `Syntax error: ${e.message}`, input: '', expected: '', got: '' }];
  }
  if (!fn) return [{ passed: false, error: 'Could not find a function to test. Make sure your function name matches the problem.', input: '', expected: '', got: '' }];
  for (const tc of testCases) {
    try {
      const inputCopy = JSON.parse(JSON.stringify(tc.input));
      const got = fn(...inputCopy);
      const passed = JSON.stringify(got) === JSON.stringify(tc.expected);
      results.push({ passed, input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), got: JSON.stringify(got), error: null });
    } catch (e) {
      results.push({ passed: false, input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), got: '', error: e.message });
    }
  }
  return results;
}
