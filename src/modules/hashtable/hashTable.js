import { djb2, DEFAULT_SIZE } from './hashUtils';

export function createTable(size = DEFAULT_SIZE) {
  return { buckets: Array.from({ length: size }, () => []), size, count: 0 };
}

export function htInsert(table, key, value) {
  const idx = djb2(key, table.size);
  const bucket = table.buckets[idx];
  const existing = bucket.findIndex((e) => e.key === key);
  const newBuckets = table.buckets.map((b, i) => {
    if (i !== idx) return b;
    if (existing !== -1) {
      const updated = [...b];
      updated[existing] = { key, value };
      return updated;
    }
    return [...b, { key, value }];
  });
  const newCount = existing === -1 ? table.count + 1 : table.count;
  return { ...table, buckets: newBuckets, count: newCount };
}

export function htSearch(table, key) {
  const idx = djb2(key, table.size);
  const bucket = table.buckets[idx];
  const found = bucket.find((e) => e.key === key);
  return { idx, found: !!found, value: found ? found.value : null, chain: bucket };
}

export function htDelete(table, key) {
  const idx = djb2(key, table.size);
  const bucket = table.buckets[idx];
  const exists = bucket.some((e) => e.key === key);
  if (!exists) return { table, deleted: false };
  const newBuckets = table.buckets.map((b, i) =>
    i !== idx ? b : b.filter((e) => e.key !== key)
  );
  return { table: { ...table, buckets: newBuckets, count: table.count - 1 }, deleted: true };
}

export function getDefaultTable() {
  let t = createTable(DEFAULT_SIZE);
  [['apple','fruit'],['banana','fruit'],['cat','animal'],['dog','animal'],
   ['moon','space'],['star','space'],['code','tech']].forEach(([k,v]) => {
    t = htInsert(t, k, v);
  });
  return t;
}
