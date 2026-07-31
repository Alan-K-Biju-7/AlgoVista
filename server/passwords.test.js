'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');
const {
  PasswordHashCapacityError,
  getDummyPasswordHash,
  getPasswordHashQueueState,
  hashPassword,
  parseArgonHash,
  passwordHashNeedsUpgrade,
  runBoundedHashJob,
  verifyPassword,
} = require('./passwords');

test('hashes new passwords with bounded Argon2id parameters', async () => {
  const hash = await hashPassword('correct horse battery staple');
  const parsed = parseArgonHash(hash);

  assert.ok(parsed);
  assert.equal(parsed.version, 19);
  assert.equal(parsed.memory, 19_456);
  assert.equal(parsed.passes, 2);
  assert.equal(await verifyPassword('correct horse battery staple', hash), true);
  assert.equal(await verifyPassword('wrong password', hash), false);
  assert.equal(passwordHashNeedsUpgrade(hash), false);
});

test('verifies bounded legacy PBKDF2 hashes for upgrade-on-login', async () => {
  const password = 'legacy password';
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 120_000, 64, 'sha512', (error, value) => {
      if (error) reject(error);
      else resolve(value);
    });
  });
  const legacy = `120000:${salt}:${key.toString('hex')}`;

  assert.equal(await verifyPassword(password, legacy), true);
  assert.equal(await verifyPassword('wrong', legacy), false);
  assert.equal(passwordHashNeedsUpgrade(legacy), true);
});

test('rejects malformed or attacker-controlled password hash parameters', async () => {
  const oversized = '$argon2id$v=19$m=999999999,t=2,p=1$c2FsdHNhbHRzYWx0c2FsdA$a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2U';
  assert.equal(parseArgonHash(oversized), null);
  assert.equal(await verifyPassword('password', oversized), false);
  assert.equal(await verifyPassword('password', '999999999:salt:abcd'), false);
});

test('password hashing queue rejects excess work with a retryable 503 error', async () => {
  const limits = getPasswordHashQueueState();
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const admitted = Array.from(
    { length: limits.concurrency + limits.queueLimit },
    () => runBoundedHashJob(() => gate)
  );

  await assert.rejects(
    runBoundedHashJob(() => Promise.resolve()),
    (error) => (
      error instanceof PasswordHashCapacityError
      && error.status === 503
      && error.code === 'password_service_busy'
    )
  );

  release();
  await Promise.all(admitted);
  assert.deepEqual(getPasswordHashQueueState(), {
    active: 0,
    pending: 0,
    concurrency: limits.concurrency,
    queueLimit: limits.queueLimit,
  });
});

test('prepares a reusable dummy hash for equivalent unknown-account work', async () => {
  const first = await getDummyPasswordHash();
  const second = await getDummyPasswordHash();
  assert.equal(first, second);
  assert.ok(parseArgonHash(first));
});
