export function generateMergeSortSteps(initialArr) {
  const steps = [];
  const arr = [...initialArr];

  steps.push({
    arr: [...arr], phase: 'init',
    activeRange: [0, arr.length - 1], mergeRange: null,
    leftPart: null, rightPart: null, merged: null,
    comparing: null, depth: 0,
    message: `Start merge sort on [${arr.join(', ')}]. Divide array in half recursively until single elements, then merge back in sorted order.`,
  });

  function recordSplit(a, lo, hi, depth) {
    if (lo >= hi) {
      steps.push({
        arr: [...arr], phase: 'base',
        activeRange: [lo, hi], mergeRange: null,
        leftPart: null, rightPart: null, merged: null,
        comparing: null, depth,
        message: `Base case: [${a[lo]}] at index ${lo} — single element, already sorted.`,
      });
      return;
    }
    const mid = Math.floor((lo + hi) / 2);
    steps.push({
      arr: [...arr], phase: 'split',
      activeRange: [lo, hi], mergeRange: null,
      leftPart: [lo, mid], rightPart: [mid + 1, hi],
      merged: null, comparing: null, depth,
      message: `Split [${lo}..${hi}] → left [${lo}..${mid}] and right [${mid + 1}..${hi}]. Recurse left.`,
    });
    recordSplit(a, lo, mid, depth + 1);
    steps.push({
      arr: [...arr], phase: 'split',
      activeRange: [lo, hi], mergeRange: null,
      leftPart: [lo, mid], rightPart: [mid + 1, hi],
      merged: null, comparing: null, depth,
      message: `Left half [${lo}..${mid}] done. Now recurse right [${mid + 1}..${hi}].`,
    });
    recordSplit(a, mid + 1, hi, depth + 1);
    recordMerge(a, lo, mid, hi, depth);
  }

  function recordMerge(a, lo, mid, hi, depth) {
    const left  = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);

    steps.push({
      arr: [...arr], phase: 'merge_start',
      activeRange: [lo, hi], mergeRange: [lo, hi],
      leftPart: [lo, mid], rightPart: [mid + 1, hi],
      merged: null, comparing: null, depth,
      message: `Merge [${lo}..${mid}]=[${left.join(',')}] and [${mid+1}..${hi}]=[${right.join(',')}]. Compare heads, pick smaller.`,
    });

    let i = 0, j = 0;
    const merged = [];

    while (i < left.length && j < right.length) {
      steps.push({
        arr: [...arr], phase: 'compare',
        activeRange: [lo, hi], mergeRange: [lo, hi],
        leftPart: [lo, mid], rightPart: [mid + 1, hi],
        merged: [...merged], comparing: [lo + i, mid + 1 + j], depth,
        message: `Compare ${left[i]} vs ${right[j]}. ${left[i] <= right[j] ? `${left[i]} ≤ ${right[j]} — take from left.` : `${right[j]} < ${left[i]} — take from right.`}`,
      });
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) {
      steps.push({
        arr: [...arr], phase: 'compare',
        activeRange: [lo, hi], mergeRange: [lo, hi],
        leftPart: [lo, mid], rightPart: [mid + 1, hi],
        merged: [...merged], comparing: [lo + i, -1], depth,
        message: `Right exhausted — take remaining left element ${left[i]}.`,
      });
      merged.push(left[i++]);
    }
    while (j < right.length) {
      steps.push({
        arr: [...arr], phase: 'compare',
        activeRange: [lo, hi], mergeRange: [lo, hi],
        leftPart: [lo, mid], rightPart: [mid + 1, hi],
        merged: [...merged], comparing: [-1, mid + 1 + j], depth,
        message: `Left exhausted — take remaining right element ${right[j]}.`,
      });
      merged.push(right[j++]);
    }

    for (let k = 0; k < merged.length; k++) arr[lo + k] = merged[k];

    steps.push({
      arr: [...arr], phase: 'merged',
      activeRange: [lo, hi], mergeRange: [lo, hi],
      leftPart: null, rightPart: null,
      merged: [...merged], comparing: null, depth,
      message: `Merged [${lo}..${hi}] → [${merged.join(', ')}]. Written back to array.`,
    });
  }

  recordSplit(arr, 0, arr.length - 1, 0);

  steps.push({
    arr: [...arr], phase: 'done',
    activeRange: [0, arr.length - 1], mergeRange: null,
    leftPart: null, rightPart: null, merged: null,
    comparing: null, depth: 0,
    message: `Merge sort complete ✓  Sorted array: [${arr.join(', ')}]. Total steps: ${steps.length + 1}.`,
  });

  return steps;
}
