const test = require('node:test');
const assert = require('node:assert/strict');
const {
  FixedWindowRateLimiter,
  clearSessionCookies,
  corsHeaders,
  createSessionCookie,
  getSessionTokenFromRequest,
  hashSessionToken,
  isOriginAllowed,
  parseAllowedOrigins,
  practiceRunnerSecurityHeaders,
  productionSecurityHeaders,
} = require('./security');

test('origin allowlist accepts configured and local origins but rejects lookalikes', () => {
  const origins = parseAllowedOrigins('https://algovista.example, https://learn.example');
  assert.equal(isOriginAllowed('https://algovista.example', origins), true);
  assert.equal(isOriginAllowed('http://localhost:3001', origins), true);
  assert.equal(isOriginAllowed('https://algovista.example.attacker.test', origins), false);
  assert.equal(corsHeaders('https://attacker.test', origins)['Access-Control-Allow-Origin'], undefined);
  assert.equal(corsHeaders('https://algovista.example', origins)['Access-Control-Allow-Origin'], 'https://algovista.example');
  assert.equal(corsHeaders('https://algovista.example', origins)['Access-Control-Allow-Credentials'], 'true');
  assert.doesNotMatch(corsHeaders('https://algovista.example', origins)['Access-Control-Allow-Methods'], /DELETE/);
});

test('session cookies are httpOnly, secure in production, and readable server-side', () => {
  const token = 'a'.repeat(64);
  const cookie = createSessionCookie(token, {
    isProduction: true,
    sameSite: 'None',
    maxAgeSeconds: 300,
  });
  assert.match(cookie, /^__Host-algovista_session=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=None/);
  assert.match(cookie, /Max-Age=300/);
  assert.equal(
    getSessionTokenFromRequest({ headers: { cookie: '__Host-algovista_session=' + token } }),
    token
  );
  assert.equal(clearSessionCookies({ isProduction: true }).length, 2);
});

test('development cookies stay localhost-compatible and invalid tokens are rejected', () => {
  const cookie = createSessionCookie('b'.repeat(64), { isProduction: false });
  assert.match(cookie, /^algovista_session=/);
  assert.doesNotMatch(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.throws(() => createSessionCookie('not-a-token'), /encoded cryptographic secret/);
});

test('production authentication ignores the legacy non-Host cookie name', () => {
  const legacyToken = 'c'.repeat(64);
  const hostToken = 'd'.repeat(64);
  assert.equal(
    getSessionTokenFromRequest({ headers: { cookie: `algovista_session=${legacyToken}` } }, { isProduction: true }),
    null
  );
  assert.equal(
    getSessionTokenFromRequest({ headers: { cookie: `algovista_session=${legacyToken}; __Host-algovista_session=${hostToken}` } }, { isProduction: true }),
    hostToken
  );
});

test('session tokens are represented by a one-way stable digest', () => {
  const token = 'raw-session-token';
  const digest = hashSessionToken(token);
  assert.equal(digest, hashSessionToken(token));
  assert.notEqual(digest, token);
  assert.match(digest, /^[a-f0-9]{64}$/);
});

test('fixed-window limiter blocks excess requests and resets cleanly', () => {
  const limiter = new FixedWindowRateLimiter({ windowMs: 1_000 });
  assert.equal(limiter.consume('guest:1', 2, 0).allowed, true);
  assert.equal(limiter.consume('guest:1', 2, 1).allowed, true);
  const blocked = limiter.consume('guest:1', 2, 2);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 1);
  assert.equal(limiter.consume('guest:1', 2, 1_001).allowed, true);
});

test('production security headers include transport and browser protections', () => {
  const headers = productionSecurityHeaders(true);
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['X-Frame-Options'], 'DENY');
  assert.match(headers['Strict-Transport-Security'], /max-age=/);
});

test('practice runner policy permits evaluation but denies scripts and network access', () => {
  const headers = practiceRunnerSecurityHeaders(true);
  assert.match(headers['Content-Security-Policy'], /script-src 'unsafe-eval'/);
  assert.match(headers['Content-Security-Policy'], /connect-src 'none'/);
  assert.doesNotMatch(headers['Content-Security-Policy'], /script-src[^;]*'self'/);
  assert.equal(headers['Cross-Origin-Resource-Policy'], 'same-origin');
  assert.deepEqual(practiceRunnerSecurityHeaders(false), {});
});
