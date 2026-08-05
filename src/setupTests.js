import '@testing-library/jest-dom/vitest';

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(String(key)) ? values.get(String(key)) : null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: (key) => values.delete(String(key)),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() { return values.size; },
  };
}

// Node 24 can expose a disabled localStorage getter to jsdom when no
// --localstorage-file is provided. Install a deterministic browser-compatible
// store so CI tests do not fail before the Pages build can run.
if (!window.localStorage) {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: createMemoryStorage(),
  });
}
