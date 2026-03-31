export function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
  return arr;
}

export function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}

export const DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90, 47];
export const PRESET_ARRAYS = {
  default:  [64, 34, 25, 12, 22, 11, 90, 47],
  sorted:   [1, 2, 3, 4, 5, 6, 7, 8],
  reversed: [8, 7, 6, 5, 4, 3, 2, 1],
  random:   () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 5),
};
