export function generateQuickSortSteps(initialArr) {
  const steps = [];
  const arr = [...initialArr];

  steps.push({
    arr: [...arr], pivot: null, pivotIdx: null,
    lo: null, hi: null, i: null, j: null,
    sortedIndices: [], swapPair: null, phase: 'init',
    message: `Start quick sort on [${arr.join(', ')}]. Lomuto partition scheme — last element is pivot.`,
  });

  const sorted = new Set();

  function qs(lo, hi) {
    if (lo >= hi) {
      if (lo === hi) sorted.add(lo);
      return;
    }

    const pivotVal = arr[hi];
    steps.push({
      arr: [...arr], pivot: pivotVal, pivotIdx: hi,
      lo, hi, i: lo - 1, j: lo,
      sortedIndices: [...sorted], swapPair: null, phase: 'pivot',
      message: `Partition [${lo}..${hi}]. Pivot = arr[${hi}] = ${pivotVal} (last element). i starts at ${lo - 1} (boundary pointer).`,
    });

    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      steps.push({
        arr: [...arr], pivot: pivotVal, pivotIdx: hi,
        lo, hi, i, j,
        sortedIndices: [...sorted], swapPair: null, phase: 'compare',
        message: `j=${j}: arr[${j}]=${arr[j]} vs pivot ${pivotVal}. ${arr[j] <= pivotVal ? `${arr[j]} ≤ ${pivotVal} — increment i, swap arr[${i+1}] and arr[${j}].` : `${arr[j]} > ${pivotVal} — no swap, advance j.`}`,
      });
      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          steps.push({
            arr: [...arr], pivot: pivotVal, pivotIdx: hi,
            lo, hi, i, j,
            sortedIndices: [...sorted], swapPair: [i, j], phase: 'swap',
            message: `Swap arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}. i boundary advances to ${i}.`,
          });
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            arr: [...arr], pivot: pivotVal, pivotIdx: hi,
            lo, hi, i, j,
            sortedIndices: [...sorted], swapPair: null, phase: 'swapped',
            message: `Swapped. arr[${i}]=${arr[i]} is now in the ≤ pivot zone.`,
          });
        }
      }
    }

    const pIdx = i + 1;
    steps.push({
      arr: [...arr], pivot: pivotVal, pivotIdx: hi,
      lo, hi, i, j: hi,
      sortedIndices: [...sorted], swapPair: [pIdx, hi], phase: 'place_pivot',
      message: `Place pivot: swap arr[${pIdx}]=${arr[pIdx]} and arr[${hi}]=${pivotVal}. Pivot lands at its final position ${pIdx}.`,
    });
    [arr[pIdx], arr[hi]] = [arr[hi], arr[pIdx]];
    sorted.add(pIdx);

    steps.push({
      arr: [...arr], pivot: pivotVal, pivotIdx: pIdx,
      lo, hi, i: pIdx, j: null,
      sortedIndices: [...sorted], swapPair: null, phase: 'partitioned',
      message: `Pivot ${pivotVal} at index ${pIdx} is in its final sorted position ✓  Left: [${lo}..${pIdx-1}], Right: [${pIdx+1}..${hi}].`,
    });

    qs(lo, pIdx - 1);
    qs(pIdx + 1, hi);
  }

  qs(0, arr.length - 1);
  arr.forEach((_, i) => sorted.add(i));

  steps.push({
    arr: [...arr], pivot: null, pivotIdx: null,
    lo: null, hi: null, i: null, j: null,
    sortedIndices: [...sorted], swapPair: null, phase: 'done',
    message: `Quick sort complete ✓  Sorted: [${arr.join(', ')}].`,
  });

  return steps;
}
