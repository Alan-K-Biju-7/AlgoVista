'use strict';

const crypto = require('node:crypto');
const { promisify } = require('node:util');

const pbkdf2Async = promisify(crypto.pbkdf2);
const ARGON_MEMORY_KIB = 19_456;
const ARGON_PASSES = 2;
const ARGON_PARALLELISM = 1;
const ARGON_TAG_BYTES = 32;
const MAX_PASSWORD_BYTES = 512;

function boundedEnvironmentInteger(name, fallback, minimum, maximum) {
  const parsed = Number(process.env[name]);
  return Number.isSafeInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : fallback;
}

const MAX_HASH_JOBS = boundedEnvironmentInteger('PASSWORD_HASH_CONCURRENCY', 2, 1, 4);
const MAX_PENDING_HASH_JOBS = boundedEnvironmentInteger('PASSWORD_HASH_QUEUE_LIMIT', 32, 1, 256);

let activeHashJobs = 0;
const pendingHashJobs = [];
let dummyHashPromise;

class PasswordHashCapacityError extends Error {
  constructor() {
    super('Authentication is busy. Try again shortly.');
    this.name = 'PasswordHashCapacityError';
    this.status = 503;
    this.code = 'password_service_busy';
  }
}

function base64Url(buffer) {
  return Buffer.from(buffer).toString('base64url');
}

function fromBase64Url(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    return Buffer.from(value, 'base64url');
  } catch {
    return null;
  }
}

function normalizePassword(password) {
  if (typeof password !== 'string') throw new TypeError('Password must be a string.');
  const bytes = Buffer.byteLength(password, 'utf8');
  if (bytes < 1 || bytes > MAX_PASSWORD_BYTES) throw new TypeError('Password length is not valid.');
  return password;
}

function runBoundedHashJob(task) {
  return new Promise((resolve, reject) => {
    const run = () => {
      activeHashJobs += 1;
      Promise.resolve()
        .then(task)
        .then(resolve, reject)
        .finally(() => {
          activeHashJobs -= 1;
          pendingHashJobs.shift()?.();
        });
    };
    if (activeHashJobs < MAX_HASH_JOBS) {
      run();
      return;
    }
    if (pendingHashJobs.length >= MAX_PENDING_HASH_JOBS) {
      reject(new PasswordHashCapacityError());
      return;
    }
    pendingHashJobs.push(run);
  });
}

function getPasswordHashQueueState() {
  return {
    active: activeHashJobs,
    pending: pendingHashJobs.length,
    concurrency: MAX_HASH_JOBS,
    queueLimit: MAX_PENDING_HASH_JOBS,
  };
}

function deriveArgon2id(password, salt, parameters) {
  if (typeof crypto.argon2 !== 'function') {
    throw new Error('AlgoVista requires Node.js 24.7 or newer for Argon2id password hashing.');
  }
  return new Promise((resolve, reject) => {
    crypto.argon2('argon2id', {
      message: password,
      nonce: salt,
      parallelism: parameters.parallelism,
      tagLength: parameters.tagLength,
      memory: parameters.memory,
      passes: parameters.passes,
    }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

function parseArgonHash(passwordHash) {
  const match = String(passwordHash || '').match(
    /^\$argon2id\$v=(\d+)\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9_-]+)\$([A-Za-z0-9_-]+)$/
  );
  if (!match) return null;
  const [, versionRaw, memoryRaw, passesRaw, parallelismRaw, saltRaw, keyRaw] = match;
  const version = Number(versionRaw);
  const memory = Number(memoryRaw);
  const passes = Number(passesRaw);
  const parallelism = Number(parallelismRaw);
  const salt = fromBase64Url(saltRaw);
  const key = fromBase64Url(keyRaw);
  if (
    version !== 19
    || !Number.isInteger(memory) || memory < 8_192 || memory > 262_144
    || !Number.isInteger(passes) || passes < 1 || passes > 10
    || !Number.isInteger(parallelism) || parallelism < 1 || parallelism > 8
    || !salt || salt.length < 16 || salt.length > 64
    || !key || key.length < 16 || key.length > 128
  ) return null;
  return { version, memory, passes, parallelism, salt, key };
}

function parseLegacyPbkdf2(passwordHash) {
  const match = String(passwordHash || '').match(/^(\d+):([a-f0-9]+):([a-f0-9]+)$/i);
  if (!match) return null;
  const iterations = Number(match[1]);
  const salt = match[2];
  const key = Buffer.from(match[3], 'hex');
  if (
    !Number.isInteger(iterations) || iterations < 10_000 || iterations > 1_000_000
    || salt.length < 16 || salt.length > 256 || salt.length % 2 !== 0
    || key.length < 16 || key.length > 128
  ) return null;
  return { iterations, salt, key };
}

function safeEqual(left, right) {
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function hashPassword(password) {
  const cleanPassword = normalizePassword(password);
  const salt = crypto.randomBytes(16);
  const parameters = {
    memory: ARGON_MEMORY_KIB,
    passes: ARGON_PASSES,
    parallelism: ARGON_PARALLELISM,
    tagLength: ARGON_TAG_BYTES,
  };
  const key = await runBoundedHashJob(() => deriveArgon2id(cleanPassword, salt, parameters));
  return `$argon2id$v=19$m=${parameters.memory},t=${parameters.passes},p=${parameters.parallelism}$${base64Url(salt)}$${base64Url(key)}`;
}

async function verifyPassword(password, passwordHash) {
  let cleanPassword;
  try {
    cleanPassword = normalizePassword(password);
  } catch {
    return false;
  }

  const argon = parseArgonHash(passwordHash);
  if (argon) {
    const attempted = await runBoundedHashJob(() => deriveArgon2id(cleanPassword, argon.salt, {
      memory: argon.memory,
      passes: argon.passes,
      parallelism: argon.parallelism,
      tagLength: argon.key.length,
    }));
    return safeEqual(attempted, argon.key);
  }

  const legacy = parseLegacyPbkdf2(passwordHash);
  if (legacy) {
    const attempted = await runBoundedHashJob(() => pbkdf2Async(
      cleanPassword,
      legacy.salt,
      legacy.iterations,
      legacy.key.length,
      'sha512'
    ));
    return safeEqual(attempted, legacy.key);
  }

  return false;
}

function passwordHashNeedsUpgrade(passwordHash) {
  const parsed = parseArgonHash(passwordHash);
  return !parsed
    || parsed.memory !== ARGON_MEMORY_KIB
    || parsed.passes !== ARGON_PASSES
    || parsed.parallelism !== ARGON_PARALLELISM
    || parsed.key.length !== ARGON_TAG_BYTES;
}

async function getDummyPasswordHash() {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword('AlgoVista timing equalizer — this is not an account password.');
  }
  return dummyHashPromise;
}

module.exports = {
  PasswordHashCapacityError,
  getDummyPasswordHash,
  getPasswordHashQueueState,
  hashPassword,
  parseArgonHash,
  passwordHashNeedsUpgrade,
  runBoundedHashJob,
  verifyPassword,
};
