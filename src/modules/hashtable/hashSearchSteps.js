import { djb2 } from './hashUtils';

export function generateSearchSteps(table, key) {
  const steps = [];
  const idx   = djb2(key, table.size);
  const bucket = table.buckets[idx];

  steps.push({
    table, activeIdx: idx, highlightKeys: [], phase: 'hash',
    message: `Search "${key}". Hash("${key}") = ${idx}. Go to bucket ${idx}.`,
  });

  if (bucket.length === 0) {
    steps.push({
      table, activeIdx: idx, highlightKeys: [], phase: 'notfound',
      message: `Bucket ${idx} is empty. "${key}" is not in the table — O(1) miss.`,
    });
    return steps;
  }

  for (let i = 0; i < bucket.length; i++) {
    const entry = bucket[i];
    steps.push({
      table, activeIdx: idx, highlightKeys: [entry.key], phase: 'probe',
      message: `Check chain[${i}]: key = "${entry.key}". ${entry.key === key ? `Match found!` : `"${entry.key}" ≠ "${key}" — continue.`}`,
    });
    if (entry.key === key) {
      steps.push({
        table, activeIdx: idx, highlightKeys: [key], phase: 'found',
        message: `Found "${key}" → "${entry.value}" at bucket ${idx}, chain index ${i}. O(1) average lookup.`,
      });
      return steps;
    }
  }

  steps.push({
    table, activeIdx: idx, highlightKeys: [], phase: 'notfound',
    message: `Traversed all ${bucket.length} chain entries. "${key}" not found in bucket ${idx}.`,
  });

  return steps;
}
