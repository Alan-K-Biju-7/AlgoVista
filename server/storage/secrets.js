'use strict';

const crypto = require('node:crypto');

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;

function generateSecret(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

function digestSecret(secret, pepper = '') {
  const value = String(secret || '');
  if (pepper) {
    return crypto.createHmac('sha256', String(pepper)).update(value).digest('hex');
  }
  return crypto.createHash('sha256').update(value).digest('hex');
}

function deriveSessionCsrfToken(sessionToken, pepper = '') {
  if (!isPlausibleSecret(sessionToken)) return null;
  return crypto
    .createHmac('sha256', String(pepper || ''))
    .update('algovista.session-csrf.v1\0')
    .update(sessionToken)
    .digest('base64url');
}

function isDigest(value) {
  return typeof value === 'string' && DIGEST_PATTERN.test(value);
}

function safeDigestEqual(left, right) {
  if (!isDigest(left) || !isDigest(right)) return false;
  return crypto.timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'));
}

function isPlausibleSecret(value) {
  return typeof value === 'string' && value.length >= 16 && value.length <= 512;
}

module.exports = {
  deriveSessionCsrfToken,
  digestSecret,
  generateSecret,
  isDigest,
  isPlausibleSecret,
  safeDigestEqual,
};
