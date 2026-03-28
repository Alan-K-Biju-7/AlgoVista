import { djb2 } from './hashUtils';
import { htInsert } from './hashTable';

export function generateInsertSteps(table, key, value) {
  const steps = [];
  const idx   = djb2(key, table.size);
  const bucket = table.buckets[idx];
  const isUpdate = bucket.some((e) => e.key === key);
  const chainLen = bucket.length;

  steps.push({
    table, activeIdx: idx, highlightKeys: [], phase: 'hash',
    message: `Insert "${key}". Hash("${key}") = djb2 % ${table.size} = ${idx}. Navigate to bucket ${idx}.`,
  });

  steps.push({
    table, activeIdx: idx, highlightKeys: bucket.map((e) => e.key), phase: 'inspect',
    message: chainLen === 0
      ? `Bucket ${idx} is empty — no collision. Insert "${key}" directly.`
      : `Bucket ${idx} has ${chainLen} item(s): [${bucket.map((e) => e.key).join(', ')}]. ${isUpdate ? `Key "${key}" exists — update value.` : `No match — append to chain (collision).`}`,
  });

  const newTable = htInsert(table, key, value);

  steps.push({
    table: newTable, activeIdx: idx, highlightKeys: [key], phase: 'done',
    message: isUpdate
      ? `Updated "${key}" → "${value}" in bucket ${idx}. Count unchanged: ${newTable.count}.`
      : `Inserted "${key}" → "${value}" in bucket ${idx}. ${chainLen > 0 ? `Chain length now ${chainLen + 1} — collision handled by chaining.` : ''} Total entries: ${newTable.count}.`,
  });

  return steps;
}
