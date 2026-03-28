import { djb2 } from './hashUtils';
import { htDelete } from './hashTable';

export function generateDeleteSteps(table, key) {
  const steps = [];
  const idx   = djb2(key, table.size);
  const bucket = table.buckets[idx];

  steps.push({
    table, activeIdx: idx, highlightKeys: [], phase: 'hash',
    message: `Delete "${key}". Hash = ${idx}. Navigate to bucket ${idx}.`,
  });

  const entryIdx = bucket.findIndex((e) => e.key === key);

  if (entryIdx === -1) {
    steps.push({
      table, activeIdx: idx, highlightKeys: [], phase: 'notfound',
      message: `"${key}" not found in bucket ${idx}. Nothing to delete.`,
    });
    return steps;
  }

  for (let i = 0; i <= entryIdx; i++) {
    steps.push({
      table, activeIdx: idx, highlightKeys: [bucket[i].key], phase: 'probe',
      message: `Scanning chain[${i}]: "${bucket[i].key}". ${bucket[i].key === key ? `Match — remove this entry.` : `Not a match — continue.`}`,
    });
  }

  const { table: newTable } = htDelete(table, key);

  steps.push({
    table: newTable, activeIdx: idx, highlightKeys: [], phase: 'done',
    message: `Deleted "${key}" from bucket ${idx}. Chain length reduced. Total entries: ${newTable.count}.`,
  });

  return steps;
}
