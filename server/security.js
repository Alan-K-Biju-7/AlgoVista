const crypto = require('crypto');

const LOCAL_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
];

function normalizeOrigin(value) {
  try {
    return new URL(String(value || '').trim()).origin.toLowerCase();
  } catch {
    return '';
  }
}

function parseAllowedOrigins(raw = '', { includeLocal = true } = {}) {
  const configured = String(raw || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);
  const origins = includeLocal ? [...LOCAL_ORIGINS, ...configured] : configured;
  return new Set(origins.map((origin) => origin.toLowerCase()));
}

function isOriginAllowed(origin, allowedOrigins) {
  if (!origin) return true;
  const normalized = normalizeOrigin(origin);
  return Boolean(normalized && allowedOrigins.has(normalized));
}

function corsHeaders(origin, allowedOrigins) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
  if (origin && isOriginAllowed(origin, allowedOrigins)) {
    headers['Access-Control-Allow-Origin'] = normalizeOrigin(origin);
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  return headers;
}

function productionSecurityHeaders(isProduction = false) {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-DNS-Prefetch-Control': 'off',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    ...(isProduction ? {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        'upgrade-insecure-requests',
      ].join('; '),
    } : {}),
  };
}

function practiceRunnerSecurityHeaders(isProduction = false) {
  if (!isProduction) return {};
  return {
    // The worker needs string compilation to evaluate a learner's function,
    // but it must not load scripts, open network connections, create nested
    // workers, or inherit access to the application document.
    'Content-Security-Policy': [
      "default-src 'none'",
      "script-src 'unsafe-eval'",
      "connect-src 'none'",
      "worker-src 'none'",
      "object-src 'none'",
      "base-uri 'none'",
    ].join('; '),
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cache-Control': 'no-cache',
  };
}

function parseCookies(header = '') {
  return String(header || '')
    .split(';')
    .reduce((cookies, pair) => {
      const separator = pair.indexOf('=');
      if (separator < 1) return cookies;
      const key = pair.slice(0, separator).trim();
      const value = pair.slice(separator + 1).trim();
      if (!key) return cookies;
      try {
        cookies[key] = decodeURIComponent(value);
      } catch {
        // Ignore malformed cookie values rather than failing the whole request.
      }
      return cookies;
    }, {});
}

function sessionCookieName(isProduction = false) {
  return isProduction ? '__Host-algovista_session' : 'algovista_session';
}

function normalizeSameSite(value, isProduction = false) {
  const requested = String(value || '').trim().toLowerCase();
  if (requested === 'strict') return 'Strict';
  if (requested === 'none' && isProduction) return 'None';
  return 'Lax';
}

function createSessionCookie(token, {
  isProduction = false,
  maxAgeSeconds = 60 * 60 * 24 * 7,
  sameSite,
} = {}) {
  const safeToken = String(token || '');
  if (!/^[A-Za-z0-9_-]{32,512}$/.test(safeToken)) {
    throw new TypeError('Session token must be an encoded cryptographic secret.');
  }

  const parts = [
    `${sessionCookieName(isProduction)}=${encodeURIComponent(safeToken)}`,
    'Path=/',
    'HttpOnly',
    `SameSite=${normalizeSameSite(sameSite, isProduction)}`,
    `Max-Age=${Math.max(0, Math.floor(Number(maxAgeSeconds) || 0))}`,
  ];
  if (isProduction) parts.push('Secure');
  return parts.join('; ');
}

function clearSessionCookies({ isProduction = false, sameSite } = {}) {
  const attributes = [
    'Path=/',
    'HttpOnly',
    `SameSite=${normalizeSameSite(sameSite, isProduction)}`,
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];
  if (isProduction) attributes.push('Secure');

  // Clear both names so a deployment-mode change cannot strand a live cookie.
  return ['algovista_session', '__Host-algovista_session']
    .map((name) => `${name}=; ${attributes.join('; ')}`);
}

function getSessionTokenFromRequest(req, {
  isProduction = process.env.NODE_ENV === 'production',
} = {}) {
  const cookies = parseCookies(req?.headers?.cookie || '');
  if (isProduction) return cookies['__Host-algovista_session'] || null;
  return cookies['__Host-algovista_session'] || cookies.algovista_session || null;
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(String(token || '')).digest('hex');
}

function getClientAddress(req, { trustProxy = process.env.TRUST_PROXY === 'true' } = {}) {
  const direct = req.socket?.remoteAddress || 'unknown';
  if (!trustProxy) return direct;
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || direct;
}

class FixedWindowRateLimiter {
  constructor({ windowMs = 60_000, maxEntries = 10_000 } = {}) {
    this.windowMs = windowMs;
    this.maxEntries = maxEntries;
    this.entries = new Map();
  }

  consume(key, limit, now = Date.now()) {
    if (!this.entries.has(key) && this.entries.size >= this.maxEntries) {
      this.prune(now);
      if (this.entries.size >= this.maxEntries) {
        const oldestKey = this.entries.keys().next().value;
        if (oldestKey !== undefined) this.entries.delete(oldestKey);
      }
    }
    const current = this.entries.get(key);
    const entry = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + this.windowMs }
      : current;
    entry.count += 1;
    this.entries.set(key, entry);
    return {
      allowed: entry.count <= limit,
      remaining: Math.max(0, limit - entry.count),
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      resetAt: entry.resetAt,
    };
  }

  prune(now = Date.now()) {
    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) this.entries.delete(key);
    }
  }
}

module.exports = {
  FixedWindowRateLimiter,
  corsHeaders,
  clearSessionCookies,
  createSessionCookie,
  getClientAddress,
  getSessionTokenFromRequest,
  hashSessionToken,
  isOriginAllowed,
  normalizeOrigin,
  parseCookies,
  parseAllowedOrigins,
  practiceRunnerSecurityHeaders,
  productionSecurityHeaders,
  sessionCookieName,
};
