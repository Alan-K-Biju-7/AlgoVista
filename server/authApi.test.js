'use strict';

process.env.AI_TUTOR_OFFLINE = 'true';
process.env.FRONTEND_ORIGINS = 'https://app.algovista.test';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { getPasswordHashQueueState, runBoundedHashJob } = require('./passwords');

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'algovista-auth-api-'));
const databasePath = path.join(testDirectory, 'db.json');
process.env.LOCAL_DATABASE_PATH = databasePath;

const { server } = require('./index');

const ORIGIN = 'https://app.algovista.test';

async function start(t) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(testDirectory, { recursive: true, force: true });
  });
  return `http://127.0.0.1:${server.address().port}`;
}

function getWithHost(baseUrl, requestPath, hostHeader) {
  const target = new URL(requestPath, baseUrl);
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: target.hostname,
      port: target.port,
      path: target.pathname,
      method: 'GET',
      headers: { Host: hostHeader },
    }, (response) => {
      response.resume();
      response.once('end', () => resolve(response.statusCode));
    });
    request.once('error', reject);
    request.end();
  });
}

test('cookie sessions, stable cross-tab CSRF, account isolation, and AI auth are enforced', async (t) => {
  const baseUrl = await start(t);
  const jsonHeaders = { 'Content-Type': 'application/json', Origin: ORIGIN };

  assert.equal(await getWithHost(baseUrl, '/api/health', '['), 200);

  const anonymousTutor = await fetch(`${baseUrl}/api/tutor/v1/turn`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({}),
  });
  assert.equal(anonymousTutor.status, 401);
  assert.equal((await anonymousTutor.json()).code, 'auth_required');

  const invalidLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email: 'missing@example.test', password: 'not the right password' }),
  });
  assert.equal(invalidLogin.status, 401);
  assert.deepEqual(await invalidLogin.json(), { error: 'Email or password is incorrect.' });

  const password = 'correct horse battery staple';
  const registration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ name: 'Ada Learner', email: 'ADA@example.test', password }),
  });
  assert.equal(registration.status, 201);
  const registered = await registration.json();
  const setCookie = registration.headers.get('set-cookie');
  const cookie = setCookie.split(';')[0];
  const rawSession = cookie.split('=')[1];
  const firstCsrf = registered.csrfToken;

  const greeting = await fetch(`${baseUrl}/api/coach`, {
    method: 'POST',
    headers: { ...jsonHeaders, Cookie: cookie, 'X-CSRF-Token': firstCsrf },
    body: JSON.stringify({ message: 'hi' }),
  });
  assert.equal(greeting.status, 200);
  assert.deepEqual(await greeting.json(), {
    provider: 'coach-guidance',
    model: null,
    reply: 'Hi! Pick a DSA concept or ask me a specific question. I can explain the intuition, trace an example, review complexity, or quiz you.',
    coachRevision: 'direct-history-v2',
    usage: null,
  });

  assert.deepEqual(Object.keys(registered).sort(), ['csrfToken', 'progress', 'session', 'tutorProfile', 'user']);
  assert.equal('token' in registered, false);
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Lax/);
  assert.match(setCookie, /Path=\//);
  assert.doesNotMatch(setCookie, /Domain=/i);

  const persisted = fs.readFileSync(databasePath, 'utf8');
  assert.doesNotMatch(persisted, new RegExp(rawSession));
  assert.doesNotMatch(persisted, new RegExp(firstCsrf));
  assert.doesNotMatch(persisted, new RegExp(password));
  assert.match(persisted, /\$argon2id\$/);

  const validLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email: 'ada@example.test', password }),
  });
  assert.equal(validLogin.status, 200);
  const loggedIn = await validLogin.json();
  assert.equal(loggedIn.user.email, 'ada@example.test');
  assert.equal('passwordHash' in loggedIn.user, false);

  const sessionResponses = await Promise.all([
    fetch(`${baseUrl}/api/auth/session`, { headers: { Cookie: cookie, Origin: ORIGIN } }),
    fetch(`${baseUrl}/api/auth/session`, { headers: { Cookie: cookie, Origin: ORIGIN } }),
  ]);
  assert.ok(sessionResponses.every((response) => response.status === 200));
  const [restored, secondTab] = await Promise.all(sessionResponses.map((response) => response.json()));
  assert.equal(restored.csrfToken, firstCsrf);
  assert.equal(secondTab.csrfToken, firstCsrf);
  assert.equal(restored.user.email, 'ada@example.test');

  const firstTabProgress = await fetch(`${baseUrl}/api/progress`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, Cookie: cookie, 'X-CSRF-Token': firstCsrf },
    body: JSON.stringify({ conceptId: 'binary-search', status: 'learning', confidence: 40 }),
  });
  assert.equal(firstTabProgress.status, 200);

  const tamperedCsrf = `${firstCsrf.slice(0, -1)}${firstCsrf.endsWith('a') ? 'b' : 'a'}`;
  const invalidCsrf = await fetch(`${baseUrl}/api/progress`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, Cookie: cookie, 'X-CSRF-Token': tamperedCsrf },
    body: JSON.stringify({ conceptId: 'binary-search', status: 'learning', confidence: 41 }),
  });
  assert.equal(invalidCsrf.status, 403);
  assert.equal((await invalidCsrf.json()).code, 'csrf_invalid');

  const progressResponse = await fetch(`${baseUrl}/api/progress`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, Cookie: cookie, 'X-CSRF-Token': restored.csrfToken },
    body: JSON.stringify({ conceptId: 'binary-search', status: 'confident', confidence: 82 }),
  });
  assert.equal(progressResponse.status, 200);
  assert.equal((await progressResponse.json()).progress['binary-search'].confidence, 82);

  const malformedConcept = await fetch(`${baseUrl}/api/progress`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, Cookie: cookie, 'X-CSRF-Token': restored.csrfToken },
    body: JSON.stringify({ conceptId: '../forged-concept', status: 'learning', confidence: 1 }),
  });
  assert.equal(malformedConcept.status, 400);

  const unknownProblem = await fetch(`${baseUrl}/api/practice-progress`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, Cookie: cookie, 'X-CSRF-Token': restored.csrfToken },
    body: JSON.stringify({ problemId: 'invented-problem', language: 'javascript', status: 'attempted' }),
  });
  assert.equal(unknownProblem.status, 422);
  assert.equal((await unknownProblem.json()).code, 'unknown_problem');

  const practiceResponse = await fetch(`${baseUrl}/api/practice-progress`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, Cookie: cookie, 'X-CSRF-Token': restored.csrfToken },
    body: JSON.stringify({
      problemId: 'two-sum',
      language: 'javascript',
      status: 'solved',
      bookmarked: true,
      record: {
        attempts: 3,
        passes: 1,
        hintsUsed: 1,
        hintDepth: 1,
        solutionViewed: false,
        evidenceLevel: 'independent',
        lastVerdict: 'accepted',
        reviewCount: 2,
        explanation: 'Track complements already seen in a hash map.',
        confidence: 'confident',
        lastAttemptAt: '2026-07-21T10:00:00.000Z',
        solvedAt: '2026-07-21T10:00:00.000Z',
        nextReviewAt: '2026-07-28T10:00:00.000Z',
        lastDurationSeconds: 418,
      },
    }),
  });
  assert.equal(practiceResponse.status, 200);
  const savedPracticePayload = await practiceResponse.json();
  assert.equal(savedPracticePayload.problemId, 'two-sum');
  assert.equal(savedPracticePayload.language, 'javascript');
  const savedPractice = savedPracticePayload.record;
  assert.equal(savedPractice.bookmarked, true);
  assert.equal(savedPractice.reviewCount, 2);
  assert.equal(savedPractice.explanation, 'Track complements already seen in a hash map.');
  assert.equal(savedPractice.confidence, 'confident');
  assert.equal(savedPractice.lastDurationSeconds, 418);

  const secondRegistration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      name: 'Grace Learner',
      email: 'grace@example.test',
      password: 'another memorable practice passphrase',
    }),
  });
  assert.equal(secondRegistration.status, 201);
  const secondAccount = await secondRegistration.json();
  const secondCookie = secondRegistration.headers.get('set-cookie').split(';')[0];
  const isolatedPractice = await fetch(`${baseUrl}/api/practice-progress`, {
    headers: { Cookie: secondCookie, Origin: ORIGIN },
  });
  assert.equal(isolatedPractice.status, 200);
  assert.deepEqual((await isolatedPractice.json()).progress, {});
  assert.notEqual(secondAccount.user.id, registered.user.id);

  const hashLimits = getPasswordHashQueueState();
  let releaseHashJobs;
  const hashGate = new Promise((resolve) => { releaseHashJobs = resolve; });
  const admittedHashJobs = Array.from(
    { length: hashLimits.concurrency + hashLimits.queueLimit },
    () => runBoundedHashJob(() => hashGate)
  );
  let overloadedRegistration;
  try {
    overloadedRegistration = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        name: 'Busy Learner',
        email: 'busy@example.test',
        password: 'another correct horse battery staple',
      }),
    });
  } finally {
    releaseHashJobs();
    await Promise.all(admittedHashJobs);
  }
  assert.equal(overloadedRegistration.status, 503);
  assert.equal(overloadedRegistration.headers.get('retry-after'), '2');
  assert.equal((await overloadedRegistration.json()).code, 'password_service_busy');

  const missingOrigin = await fetch(`${baseUrl}/api/coach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      'X-CSRF-Token': restored.csrfToken,
    },
    body: JSON.stringify({ message: 'Explain binary search.' }),
  });
  assert.equal(missingOrigin.status, 403);
  assert.equal((await missingOrigin.json()).code, 'untrusted_request_origin');

  const logout = await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { Origin: ORIGIN, Cookie: cookie, 'X-CSRF-Token': restored.csrfToken, 'Content-Type': 'application/json' },
    body: '{}',
  });
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);

  const afterLogout = await fetch(`${baseUrl}/api/auth/session`, {
    headers: { Cookie: cookie, Origin: ORIGIN },
  });
  assert.equal(afterLogout.status, 401);
});
