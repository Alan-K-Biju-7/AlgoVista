// Snapshot helpers used inside tracer runner bodies
export function snapArray(arr, highlights = {}, label = '') {
  return {
    type: 'array',
    label,
    items: arr.map((val, idx) => ({
      idx,
      val,
      role: highlights[idx] || null,
      // role can be: 'current' | 'compare' | 'min' | 'found' | 'eliminated' | 'result'
    })),
  };
}

export function snapTwoArrays(arr1, arr2, h1 = {}, h2 = {}, labels = ['A', 'B']) {
  return {
    type: 'two_arrays',
    arrays: [
      snapArray(arr1, h1, labels[0]),
      snapArray(arr2, h2, labels[1]),
    ],
  };
}

export function snapWindow(arr, lo, hi, highlights = {}) {
  const h = { ...highlights };
  for (let i = lo; i <= hi; i++) {
    if (!h[i]) h[i] = 'window';
  }
  h[lo] = 'lo';
  h[hi] = 'hi';
  return snapArray(arr, h, 'Window');
}
