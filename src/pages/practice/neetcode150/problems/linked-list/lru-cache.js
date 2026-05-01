export default {
  id: 'lru-cache',
  title: 'LRU Cache',
  difficulty: 'Medium',
  pattern: 'Linked List',
  timeO: 'O(1) per operation',
  spaceO: 'O(capacity)',
  viz: 'linked-list',
  concept: 'linked-list',
  description:
    'Design an LRU cache with O(1) get and put operations.',
  examples: [
    { input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)', output: '1, -1' },
    { input: 'put(4,4), get(1), get(3), get(4)', output: '-1, 3, 4' },
  ],
  testCases: [
    {
      input: [2, ['put',1,1], ['put',2,2], ['get',1], ['put',3,3], ['get',2], ['put',4,4], ['get',1], ['get',3], ['get',4]],
      expected: [1, -1, -1, 3, 4]
    }
  ],
  hints: [
    'A hash map gives direct access to nodes by key.',
    'A doubly linked list can move nodes to the most-recently-used side in O(1).',
    'When capacity is full, evict the least-recently-used node.',
  ],
  pattern_explanation:
    'The doubly linked list maintains recency order, while the hash map preserves constant-time lookup by key.',
  solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);

    if (this.map.size > this.capacity) {
      const lruKey = this.map.keys().next().value;
      this.map.delete(lruKey);
    }
  }
}

function solve(capacity, ...ops) {
  const cache = new LRUCache(capacity);
  const out = [];

  for (const op of ops) {
    if (op[0] === 'put') cache.put(op[1], op[2]);
    else if (op[0] === 'get') out.push(cache.get(op[1]));
  }

  return out;
}`,
};
