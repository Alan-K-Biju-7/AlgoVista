import { twoSumTracer }               from './twoSum';
import { containsDuplicateTracer }    from './containsDuplicate';
import { maxSubarrayTracer }          from './maxSubarray';
import { stockProfitTracer }          from './stockProfit';
import { validParensTracer }          from './validParens';
import { dailyTempsTracer }           from './dailyTemps';
import { binarySearchTracer }         from './binarySearch';

// keyed by problem id
export const TRACER_CONFIGS = {
  1:  twoSumTracer,
  2:  containsDuplicateTracer,
  3:  stockProfitTracer,
  4:  maxSubarrayTracer,
  6:  validParensTracer,
  8:  dailyTempsTracer,
  13: binarySearchTracer,
};
