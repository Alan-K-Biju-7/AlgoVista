const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const BUILD_DIR = path.join(ROOT_DIR, 'build');

loadEnv(path.join(ROOT_DIR, '.env'));
loadEnv(path.join(__dirname, '.env'));

const PORT = Number(process.env.PORT || 8787);
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = 'sha512';
const PROGRESS_STATUSES = new Set(['not-started', 'learning', 'confident', 'mastered']);

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (!key || process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, '');
  }
}

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(
      DB_PATH,
      JSON.stringify({ users: [], sessions: [], progress: {} }, null, 2)
    );
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function sendJson(res, status, payload, origin) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    ...corsHeaders(origin),
  });
  res.end(body);
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        req.destroy();
        reject(new Error('Request body is too large.'));
      }
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    req.on('error', reject);
  });
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('hex');
  return `${PASSWORD_ITERATIONS}:${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [iterationsRaw, salt, storedHash] = String(passwordHash || '').split(':');
  const iterations = Number(iterationsRaw);
  if (!iterations || !salt || !storedHash) return false;
  const attemptedHash = crypto
    .pbkdf2Sync(password, salt, iterations, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');
  const attemptedBuffer = Buffer.from(attemptedHash, 'hex');
  if (storedBuffer.length !== attemptedBuffer.length) return false;
  return crypto.timingSafeEqual(storedBuffer, attemptedBuffer);
}

function createSession(db, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date().toISOString();
  db.sessions = (db.sessions || []).filter((session) => {
    return new Date(session.expiresAt).getTime() > Date.now();
  });
  db.sessions.push({
    token,
    userId,
    createdAt: now,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
  });
  return token;
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function getAuthenticatedUser(req, db) {
  const token = getBearerToken(req);
  if (!token) return null;
  const session = (db.sessions || []).find((item) => item.token === token);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return null;
  return (db.users || []).find((user) => user.id === session.userId) || null;
}

function requireUser(req, res, db, origin) {
  const user = getAuthenticatedUser(req, db);
  if (!user) {
    sendJson(res, 401, { error: 'Please log in first.' }, origin);
    return null;
  }
  return user;
}

function validateAuthInput(body, isRegister) {
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const name = String(body.name || '').trim();

  if (isRegister && name.length < 2) return 'Name must be at least 2 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function progressSummary(progress) {
  const values = Object.values(progress || {});
  const counts = values.reduce(
    (acc, item) => {
      const status = item.status || 'not-started';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { 'not-started': 0, learning: 0, confident: 0, mastered: 0 }
  );
  return counts;
}

function fallbackCoachReply({ message, concept, progress }) {
  const conceptTitle = concept && concept.title ? concept.title : 'this DSA topic';
  const summary = progressSummary(progress);
  const needsPractice = summary.learning + summary['not-started'];

  return [
    `Let's make ${conceptTitle} feel concrete.`,
    '',
    `Your question: ${message}`,
    '',
    'A strong way to learn it:',
    `1. State the invariant in one sentence for ${conceptTitle}.`,
    '2. Run a tiny example by hand and name every variable or pointer.',
    '3. Write the simplest correct version before optimizing.',
    '4. Finish with the time and space complexity, including the worst case.',
    '',
    needsPractice > 0
      ? `Progress signal: you still have ${needsPractice} beginner concepts that need repetition, so keep this answer practical and example-driven.`
      : 'Progress signal: your map is looking strong, so push toward edge cases and proof quality.',
    '',
    'Offline tutor mode is active right now; the lesson still works while live coaching is unavailable.',
  ].join('\n');
}

function buildCoachMessages({ message, concept, progress }) {
  const conceptTitle = concept && concept.title ? concept.title : 'general DSA';
  const conceptSection = concept && concept.sectionTitle ? concept.sectionTitle : 'DSA for Beginners';

  return [
    {
      role: 'system',
      content: [
        'You are AlgoVista Coach, an expert DSA tutor for beginners.',
        'Teach with short examples, visual mental models, invariants, edge cases, and complexity.',
        'Do not solve everything immediately if the learner asks for help. Guide first, then provide code only when useful.',
        'Keep answers structured and encouraging, but avoid fluff.',
      ].join(' '),
    },
    {
      role: 'user',
      content: JSON.stringify({
        learnerQuestion: message,
        activeConcept: conceptTitle,
        section: conceptSection,
        progressSummary: progressSummary(progress),
      }),
    },
  ];
}

async function callAiProvider({ message, concept, progress }) {
  const apiKey = process.env.GROQ_API_KEY || process.env.AI_PROVIDER_API_KEY;
  const baseUrl = String(process.env.AI_PROVIDER_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
  const model = process.env.AI_PROVIDER_MODEL || 'llama-3.1-8b-instant';

  if (!apiKey || !baseUrl || !model) {
    return {
      provider: 'local-fallback',
      reply: fallbackCoachReply({ message, concept, progress }),
    };
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: buildCoachMessages({ message, concept, progress }),
      temperature: 0.35,
      max_tokens: 700,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI provider request failed (${response.status}): ${errorText.slice(0, 500)}`);
  }

  const data = await response.json();
  return {
    provider: 'ai-provider',
    model,
    reply: data.choices?.[0]?.message?.content || 'I could not generate a response.',
    usage: data.usage || null,
  };
}

async function handleApi(req, res, url, origin) {
  const db = readDb();

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, service: 'algovista-backend' }, origin);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await parseBody(req);
    const validationError = validateAuthInput(body, true);
    if (validationError) {
      sendJson(res, 400, { error: validationError }, origin);
      return;
    }

    const email = normalizeEmail(body.email);
    if ((db.users || []).some((user) => user.email === email)) {
      sendJson(res, 409, { error: 'An account already exists for this email.' }, origin);
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      name: String(body.name).trim(),
      email,
      passwordHash: hashPassword(String(body.password)),
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    db.progress[user.id] = {};
    const token = createSession(db, user.id);
    writeDb(db);
    sendJson(res, 201, { token, user: publicUser(user), progress: {} }, origin);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await parseBody(req);
    const validationError = validateAuthInput(body, false);
    if (validationError) {
      sendJson(res, 400, { error: validationError }, origin);
      return;
    }

    const email = normalizeEmail(body.email);
    const user = (db.users || []).find((item) => item.email === email);
    if (!user || !verifyPassword(String(body.password), user.passwordHash)) {
      sendJson(res, 401, { error: 'Email or password is incorrect.' }, origin);
      return;
    }

    const token = createSession(db, user.id);
    writeDb(db);
    sendJson(res, 200, {
      token,
      user: publicUser(user),
      progress: db.progress[user.id] || {},
    }, origin);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/me') {
    const user = requireUser(req, res, db, origin);
    if (!user) return;
    sendJson(res, 200, {
      user: publicUser(user),
      progress: db.progress[user.id] || {},
    }, origin);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/progress') {
    const user = requireUser(req, res, db, origin);
    if (!user) return;
    sendJson(res, 200, { progress: db.progress[user.id] || {} }, origin);
    return;
  }

  if (req.method === 'PATCH' && url.pathname === '/api/progress') {
    const user = requireUser(req, res, db, origin);
    if (!user) return;

    const body = await parseBody(req);
    const conceptId = String(body.conceptId || '').trim();
    const status = String(body.status || '').trim();
    const confidence = Number(body.confidence || 0);
    const notes = String(body.notes || '').trim().slice(0, 1000);

    if (!conceptId) {
      sendJson(res, 400, { error: 'conceptId is required.' }, origin);
      return;
    }
    if (!PROGRESS_STATUSES.has(status)) {
      sendJson(res, 400, { error: 'Progress status is not valid.' }, origin);
      return;
    }

    db.progress[user.id] = db.progress[user.id] || {};
    db.progress[user.id][conceptId] = {
      status,
      confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(100, confidence)) : 0,
      notes,
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);
    sendJson(res, 200, { progress: db.progress[user.id] }, origin);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/coach') {
    const body = await parseBody(req);
    const message = String(body.message || '').trim();
    if (message.length < 2) {
      sendJson(res, 400, { error: 'Ask the coach a real question.' }, origin);
      return;
    }

    const user = getAuthenticatedUser(req, db);
    const progress = user ? db.progress[user.id] || {} : body.progress || {};
    const concept = body.concept || null;

    try {
      const coach = await callAiProvider({ message, concept, progress });
      sendJson(res, 200, coach, origin);
    } catch (error) {
      sendJson(res, 200, {
        provider: 'local-fallback',
        warning: 'Live AI coaching is unavailable.',
        reply: fallbackCoachReply({ message, concept, progress }),
      }, origin);
    }
    return;
  }

  sendJson(res, 404, { error: 'API route not found.' }, origin);
}

function serveStatic(req, res, url, origin) {
  if (req.method !== 'GET' || !fs.existsSync(BUILD_DIR)) {
    sendJson(res, 404, { error: 'Not found.' }, origin);
    return;
  }

  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const safePath = path.normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(BUILD_DIR, safePath);

  if (!filePath.startsWith(BUILD_DIR) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(BUILD_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const type = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
  }[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': type,
    ...corsHeaders(origin),
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(origin));
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  try {
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url, origin);
      return;
    }
    serveStatic(req, res, url, origin);
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Server error.' }, origin);
  }
});

server.listen(PORT, () => {
  console.log(`AlgoVista backend running on http://localhost:${PORT}`);
});
