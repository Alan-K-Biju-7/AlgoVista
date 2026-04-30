export default {
  id: 'time-based-key-value-store',
  title: 'Time Based Key Value Store',
  difficulty: 'Medium',
  pattern: 'Binary Search',
  timeO: 'O(1) set, O(log n) get',
  spaceO: 'O(n)',
  viz: 'hashmap',
  concept: 'binary-search',
  description:
    'Design a time-based key-value store that can set values with timestamps and retrieve the latest value at or before a timestamp.',
  examples: [
    { input: 'set("foo","bar",1), get("foo",1)', output: '"bar"' },
    { input: 'set("foo","bar2",4), get("foo",4), get("foo",5)', output: '"bar2", "bar2"' },
  ],
  testCases: [
    {
      input: [
        ['set', 'foo', 'bar', 1],
        ['get', 'foo', 1],
        ['get', 'foo', 3],
        ['set', 'foo', 'bar2', 4],
        ['get', 'foo', 4],
        ['get', 'foo', 5]
      ],
      expected: ['bar', 'bar', 'bar2', 'bar2']
    }
  ],
  hints: [
    'Store all values for a key in timestamp order.',
    'The get operation needs the latest timestamp not greater than the query time.',
    'That is exactly a binary search on the timestamp list.',
  ],
  pattern_explanation:
    'Each key has a sorted history by timestamp, so binary search can find the right version efficiently.',
  solution: `class TimeMap {
  constructor() {
    this.store = new Map();
  }

  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key).push([timestamp, value]);
  }

  get(key, timestamp) {
    if (!this.store.has(key)) return '';

    const arr = this.store.get(key);
    let l = 0;
    let r = arr.length - 1;
    let ans = '';

    while (l <= r) {
      const m = Math.floor((l + r) / 2);

      if (arr[m][0] <= timestamp) {
        ans = arr[m][1];
        l = m + 1;
      } else {
        r = m - 1;
      }
    }

    return ans;
  }
}

function solve(ops) {
  const tm = new TimeMap();
  const out = [];

  for (const op of ops) {
    if (op[0] === 'set') tm.set(op[1], op[2], op[3]);
    else if (op[0] === 'get') out.push(tm.get(op[1], op[2]));
  }

  return out;
}`,
};
