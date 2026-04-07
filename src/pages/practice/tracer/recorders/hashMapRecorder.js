export function snapHashMap(map, highlights = {}, label = 'Hash Map') {
  const entries = [];
  if (map instanceof Map) {
    for (const [k, v] of map) {
      entries.push({ key: String(k), val: String(v), role: highlights[k] || null });
    }
  } else {
    for (const k of Object.keys(map)) {
      entries.push({ key: String(k), val: String(map[k]), role: highlights[k] || null });
    }
  }
  return { type: 'hashmap', label, entries };
}

export function snapStack(stack, highlights = {}, label = 'Stack') {
  return {
    type: 'stack',
    label,
    items: [...stack].reverse().map((val, i) => ({
      val: String(val),
      role: highlights[i] || null,
      isTop: i === 0,
    })),
  };
}

export function snapPointers(arr, pointers, label = '') {
  return {
    type: 'pointers',
    label,
    items: arr.map((val, idx) => ({
      idx,
      val,
      pointers: Object.entries(pointers)
        .filter(([, v]) => v === idx)
        .map(([name]) => name),
    })),
  };
}
