export const DEFAULT_SIZE = 11;

export function djb2(key, size) {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash) + key.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % size;
}

export function computeLoadFactor(count, size) {
  return (count / size).toFixed(2);
}

export function loadFactorColor(lf) {
  if (lf < 0.5)  return '#34d399';
  if (lf < 0.75) return '#ffd166';
  return '#f87171';
}

export function probeSequence(key, size) {
  return [djb2(key, size)];
}
