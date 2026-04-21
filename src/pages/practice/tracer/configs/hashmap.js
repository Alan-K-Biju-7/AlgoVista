const hashmap = {
  key: 'hashmap',
  label: 'Hash Map',
  defaultInput: [],
  render(step = {}) {
    return {
      kind: 'kv',
      op: step.op || 'read',
      key: step.key ?? null,
      value: step.value ?? null,
      note: step.note || '',
    };
  },
};

export default hashmap;
