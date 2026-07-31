'use strict';

function boundedEnvironmentInteger(name, fallback, minimum, maximum, env = process.env) {
  const raw = env?.[name];
  if (raw === undefined || raw === null || String(raw).trim() === '') return fallback;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : fallback;
}

module.exports = {
  boundedEnvironmentInteger,
};
