import { binarySearchTracer } from './binarySearch';
import { containsDuplicateTracer } from './containsDuplicate';
import { dailyTempsTracer } from './dailyTemps';
import { maxSubarrayTracer } from './maxSubarray';
import { stockProfitTracer } from './stockProfit';
import { twoSumTracer } from './twoSum';
import { validParensTracer } from './validParens';

export const TRACER_CONFIGS = {
  'best-time-to-buy-and-sell-stock': stockProfitTracer,
  'binary-search': binarySearchTracer,
  'contains-duplicate': containsDuplicateTracer,
  'daily-temperatures': dailyTempsTracer,
  'maximum-subarray': maxSubarrayTracer,
  'two-sum': twoSumTracer,
  'valid-parentheses': validParensTracer,
};

export default TRACER_CONFIGS;
