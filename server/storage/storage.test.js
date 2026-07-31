'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  JSON_SCHEMA_VERSION,
  POSTGRES_MIGRATIONS,
  PostgresStorageAdapter,
  StorageConflictError,
  StorageRepository,
  createStorage,
  digestSecret,
  runPostgresMigrations,
} = require('./index');

const PASSWORD_HASH = '120000:0123456789abcdef:0123456789abcdef0123456789abcdef';
const BASE_TIME = Date.parse('2026-01-02T03:04:05.000Z');

async function localFixture(t, options = {}) {
  const directory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'algovista-storage-'));
  const filePath = path.join(directory, 'db.json');
  t.after(async () => {
    await fs.promises.rm(directory, { recursive: true, force: true });
  });
  const storage = createStorage({
    databaseUrl: '',
    jsonPath: filePath,
    tokenPepper: 'test-token-pepper',
    csrfPepper: 'test-csrf-pepper',
    clock: () => BASE_TIME,
    ...options,
  });
  await storage.initialize();
  t.after(() => storage.close());
  return { directory, filePath, storage };
}

async function createTestUser(storage, suffix) {
  return storage.createUser({
    id: `user-${suffix}`,
    name: `Learner ${suffix}`,
    email: `${suffix}@example.test`,
    passwordHash: PASSWORD_HASH,
    createdAt: BASE_TIME,
  });
}

test('local adapter atomically migrates the legacy JSON shape without retaining raw sessions', async (t) => {
  const directory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'algovista-migration-'));
  const filePath = path.join(directory, 'legacy.json');
  t.after(async () => fs.promises.rm(directory, { recursive: true, force: true }));

  const rawLegacyToken = 'RAW_LEGACY_SESSION_TOKEN_SHOULD_DISAPPEAR';
  await fs.promises.writeFile(filePath, JSON.stringify({
    users: [{
      id: 'legacy-user',
      name: 'Legacy Learner',
      email: 'LEGACY@EXAMPLE.TEST',
      passwordHash: PASSWORD_HASH,
      createdAt: '2025-01-01T00:00:00.000Z',
    }],
    sessions: [{
      token: rawLegacyToken,
      tokenHash: digestSecret(rawLegacyToken),
      userId: 'legacy-user',
      createdAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2030-01-01T00:00:00.000Z',
    }],
    progress: {
      'legacy-user': {
        arrays: {
          status: 'learning',
          confidence: 45,
          notes: 'Needs another pass',
          updatedAt: '2025-01-02T00:00:00.000Z',
        },
      },
    },
    practiceProgress: [{
      userId: 'legacy-user',
      problemId: 'two-sum',
      language: 'javascript',
      status: 'attempted',
      attempts: 1,
      passes: 0,
      hintsUsed: 0,
      hintDepth: 0,
      solutionViewed: false,
      evidenceLevel: 'seen',
      lastVerdict: 'wrong-answer',
      lastAttemptAt: '2025-01-02T00:00:00.000Z',
      nextReviewAt: null,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    }],
  }, null, 2));

  const storage = createStorage({ databaseUrl: '', jsonPath: filePath });
  await storage.initialize();
  t.after(() => storage.close());

  const persistedText = await fs.promises.readFile(filePath, 'utf8');
  const persisted = JSON.parse(persistedText);
  assert.equal((await fs.promises.stat(filePath)).mode & 0o777, 0o600);
  assert.equal(persisted.schemaVersion, JSON_SCHEMA_VERSION);
  assert.equal(Object.hasOwn(persisted, 'progress'), false);
  assert.equal(persisted.sessions.length, 0);
  assert.doesNotMatch(persistedText, new RegExp(rawLegacyToken));
  assert.equal((await storage.findUserByEmail('legacy@example.test')).id, 'legacy-user');
  assert.deepEqual(await storage.getConceptProgress('legacy-user'), {
    arrays: {
      status: 'learning',
      confidence: 45,
      notes: 'Needs another pass',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  });
  assert.deepEqual(await storage.getPracticeProgressItem(
    'legacy-user',
    'two-sum',
    'javascript'
  ), {
    status: 'attempted',
    attempts: 1,
    passes: 0,
    hintsUsed: 0,
    hintDepth: 0,
    solutionViewed: false,
    bookmarked: false,
    evidenceLevel: 'seen',
    lastVerdict: 'wrong-answer',
    reviewCount: 0,
    explanation: '',
    confidence: null,
    lastAttemptAt: '2025-01-02T00:00:00.000Z',
    solvedAt: null,
    nextReviewAt: null,
    lastDurationSeconds: 0,
    updatedAt: '2025-01-02T00:00:00.000Z',
  });
});

test('local initialization never overwrites a corrupt database snapshot', async (t) => {
  const directory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'algovista-corrupt-'));
  const filePath = path.join(directory, 'corrupt.json');
  const corruptSnapshot = '{"users": [';
  await fs.promises.writeFile(filePath, corruptSnapshot);
  t.after(async () => fs.promises.rm(directory, { recursive: true, force: true }));

  const storage = createStorage({ databaseUrl: '', jsonPath: filePath });
  await assert.rejects(() => storage.initialize(), /not valid JSON/i);
  assert.equal(await fs.promises.readFile(filePath, 'utf8'), corruptSnapshot);
});

test('repository behavior is adapter-driven and does not depend on a migration implementation', async () => {
  const users = new Map();
  let initializeCalls = 0;
  const adapter = {
    kind: 'contract-fixture',
    async initialize() { initializeCalls += 1; },
    async insertUser(user) { users.set(user.id, { ...user }); return { ...user }; },
    async findUserByEmail(email) {
      return [...users.values()].find((user) => user.email === email) || null;
    },
    async findUserById(id) { return users.get(id) || null; },
  };
  const repository = new StorageRepository(adapter, { clock: () => BASE_TIME });

  const created = await repository.createUser({
    id: 'adapter-user',
    name: 'Adapter Learner',
    email: 'ADAPTER@EXAMPLE.TEST',
    passwordHash: PASSWORD_HASH,
  });
  const found = await repository.findUserByEmail('adapter@example.test');
  const credential = await repository.findUserCredentialByEmail('adapter@example.test');

  assert.equal(created.email, 'adapter@example.test');
  assert.equal(found.id, 'adapter-user');
  assert.equal(created.passwordHash, undefined);
  assert.equal(found.passwordHash, undefined);
  assert.deepEqual(credential, { id: 'adapter-user', passwordHash: PASSWORD_HASH });
  assert.equal(initializeCalls, 1);
  assert.equal(Object.hasOwn(adapter, 'migrate'), false);
});

test('users and concept progress remain isolated through the shared repository contract', async (t) => {
  const { storage } = await localFixture(t);
  const userA = await createTestUser(storage, 'a');
  const userB = await createTestUser(storage, 'b');

  await assert.rejects(
    () => storage.createUser({
      id: 'another-id',
      name: 'Duplicate Learner',
      email: 'A@EXAMPLE.TEST',
      passwordHash: PASSWORD_HASH,
    }),
    (error) => error instanceof StorageConflictError && error.code === 'user_conflict'
  );
  await assert.rejects(
    () => storage.createUser({
      id: 'plaintext-user',
      name: 'Unsafe Learner',
      email: 'unsafe@example.test',
      passwordHash: 'this is a plaintext password',
    }),
    /encoded password hash/i
  );

  await storage.upsertConceptProgress({
    userId: userA.id,
    conceptId: 'two-sum',
    status: 'learning',
    confidence: 35,
    notes: 'Check complement first',
    updatedAt: BASE_TIME,
  });
  await storage.upsertConceptProgress({
    userId: userB.id,
    conceptId: 'two-sum',
    status: 'mastered',
    confidence: 96,
    notes: '',
    updatedAt: BASE_TIME + 1000,
  });

  assert.deepEqual(await storage.getConceptProgress(userA.id), {
    'two-sum': {
      status: 'learning',
      confidence: 35,
      notes: 'Check complement first',
      updatedAt: '2026-01-02T03:04:05.000Z',
    },
  });
  assert.equal((await storage.getConceptProgressItem(userB.id, 'two-sum')).status, 'mastered');
  assert.equal((await storage.getConceptProgressItem(userA.id, 'two-sum')).status, 'learning');

  const replacementHash = '$argon2id$v=19$m=65536,t=3,p=1$cmVwbGFjZW1lbnQtc2FsdA$cmVwbGFjZW1lbnQtaGFzaA';
  await storage.updateUserPasswordHash(userA.id, replacementHash, { updatedAt: BASE_TIME + 2000 });
  assert.equal((await storage.findUserById(userA.id)).passwordHash, undefined);
  assert.equal((await storage.findUserById(userB.id)).passwordHash, undefined);
  assert.equal((await storage.findUserCredentialByEmail(userA.email)).passwordHash, replacementHash);
  assert.equal((await storage.findUserCredentialByEmail(userB.email)).passwordHash, PASSWORD_HASH);
});

test('practice history and tutor profiles are language-aware, merge safely, and remain user-isolated', async (t) => {
  const { filePath, storage } = await localFixture(t);
  const userA = await createTestUser(storage, 'personal-a');
  const userB = await createTestUser(storage, 'personal-b');

  await storage.upsertPracticeProgress({
    userId: userA.id,
    problemId: 'two-sum',
    language: 'JavaScript',
    status: 'attempted',
    attempts: 2,
    passes: 0,
    hintsUsed: 1,
    hintDepth: 1,
    bookmarked: true,
    evidenceLevel: 'guided',
    lastVerdict: 'wrong-answer',
    reviewCount: 2,
    explanation: 'I can explain why the complement must be checked first.',
    confidence: 'developing',
    lastAttemptAt: BASE_TIME,
    nextReviewAt: BASE_TIME + 86_400_000,
    lastDurationSeconds: 612,
    updatedAt: BASE_TIME,
  });
  await storage.upsertPracticeProgress({
    userId: userA.id,
    problemId: 'two-sum',
    language: 'python',
    status: 'solved',
    attempts: 1,
    passes: 1,
    evidenceLevel: 'independent',
    lastVerdict: 'accepted',
    updatedAt: BASE_TIME + 1,
  });
  await storage.upsertPracticeProgress({
    userId: userB.id,
    problemId: 'two-sum',
    language: 'javascript',
    status: 'solved',
    attempts: 1,
    passes: 1,
    evidenceLevel: 'independent',
    lastVerdict: 'accepted',
    updatedAt: BASE_TIME + 2,
  });

  const merged = await storage.upsertPracticeProgress({
    userId: userA.id,
    problemId: 'two-sum',
    language: 'javascript',
    status: 'solved',
    attempts: 3,
    passes: 1,
    lastVerdict: 'accepted',
    solvedAt: BASE_TIME + 3,
    updatedAt: BASE_TIME + 3,
  });
  assert.equal(merged.hintsUsed, 1);
  assert.equal(merged.evidenceLevel, 'guided');
  assert.equal(merged.bookmarked, true);
  assert.equal(merged.reviewCount, 2);
  assert.equal(merged.explanation, 'I can explain why the complement must be checked first.');
  assert.equal(merged.confidence, 'developing');
  assert.equal(merged.solvedAt, '2026-01-02T03:04:05.003Z');
  assert.equal(merged.lastDurationSeconds, 612);

  const practiceA = await storage.getPracticeProgress(userA.id);
  const practiceB = await storage.getPracticeProgress(userB.id);
  assert.deepEqual(Object.keys(practiceA['two-sum']).sort(), ['javascript', 'python']);
  assert.equal(practiceA['two-sum'].javascript.attempts, 3);
  assert.equal(practiceA['two-sum'].javascript.bookmarked, true);
  assert.equal(practiceB['two-sum'].javascript.attempts, 1);

  await assert.rejects(
    () => storage.upsertPracticeProgress({
      userId: userA.id,
      problemId: 'two-sum',
      language: 'javascript',
      confidence: 'overconfident',
    }),
    /practiceConfidence is not valid/i
  );
  await assert.rejects(
    () => storage.upsertPracticeProgress({
      userId: userA.id,
      problemId: 'two-sum',
      language: 'javascript',
      explanation: 'x'.repeat(2_001),
    }),
    /explanation is not valid/i
  );
  await assert.rejects(
    () => storage.upsertPracticeProgress({
      userId: userA.id,
      problemId: 'two-sum',
      language: 'javascript',
      lastDurationSeconds: 86_401,
    }),
    /lastDurationSeconds is not valid/i
  );

  const firstProfile = await storage.upsertTutorProfile({
    userId: userA.id,
    stage: 'intermediate',
    mastery: 58,
    confidence: 'developing',
    preferredLanguage: 'JavaScript',
    preferredMode: 'socratic',
    explanationDepth: 'balanced',
    visualLearning: true,
    reducedMotion: false,
    strengths: ['arrays'],
    focusAreas: ['dynamic programming'],
    updatedAt: BASE_TIME,
  });
  firstProfile.strengths.push('forged-client-mutation');
  const mergedProfile = await storage.upsertTutorProfile({
    userId: userA.id,
    mastery: 63,
    updatedAt: BASE_TIME + 10,
  });

  assert.equal(mergedProfile.stage, 'intermediate');
  assert.equal(mergedProfile.mastery, 63);
  assert.deepEqual(mergedProfile.strengths, ['arrays']);
  assert.equal(await storage.getTutorProfile(userB.id), null);

  const persisted = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
  assert.equal(persisted.practiceProgress.length, 3);
  const persistedJavaScript = persisted.practiceProgress.find((entry) => (
    entry.userId === userA.id && entry.language === 'javascript'
  ));
  assert.equal(persistedJavaScript.bookmarked, true);
  assert.equal(persistedJavaScript.reviewCount, 2);
  assert.equal(persistedJavaScript.confidence, 'developing');
  assert.equal(persistedJavaScript.lastDurationSeconds, 612);
  assert.equal(persisted.tutorProfiles.length, 1);
  assert.equal(JSON.stringify(persisted).includes('conversationHistory'), false);
});

test('sessions store only digests and use stable session-bound CSRF across tabs', async (t) => {
  const { filePath, storage } = await localFixture(t);
  const userA = await createTestUser(storage, 'session-a');
  const userB = await createTestUser(storage, 'session-b');
  const sessionA = await storage.createSession({ userId: userA.id, ttlMs: 60_000, now: BASE_TIME });
  const sessionB = await storage.createSession({ userId: userB.id, ttlMs: 60_000, now: BASE_TIME });

  const persistedText = await fs.promises.readFile(filePath, 'utf8');
  const persisted = JSON.parse(persistedText);
  assert.doesNotMatch(persistedText, new RegExp(sessionA.token));
  assert.doesNotMatch(persistedText, new RegExp(sessionA.csrfToken));
  assert.ok(persisted.sessions.every((session) => (
    /^[a-f0-9]{64}$/.test(session.tokenDigest) && /^[a-f0-9]{64}$/.test(session.csrfDigest)
  )));

  assert.equal(
    (await storage.getActiveSessionByToken(sessionA.token, { now: BASE_TIME })).userId,
    userA.id
  );
  assert.equal(await storage.getActiveSessionByToken(sessionA.token, {
    csrfToken: sessionB.csrfToken,
    requireCsrf: true,
    now: BASE_TIME,
  }), null);
  assert.equal(
    (await storage.getActiveSessionByToken(sessionA.token, {
      csrfToken: sessionA.csrfToken,
      requireCsrf: true,
      now: BASE_TIME,
    })).userId,
    userA.id
  );

  const restoredCsrf = await storage.getSessionCsrfToken(sessionA.token, { now: BASE_TIME + 500 });
  assert.equal(restoredCsrf, sessionA.csrfToken);
  assert.equal(await storage.rotateSessionCsrf(sessionA.token, { now: BASE_TIME + 500 }), sessionA.csrfToken);
  assert.equal((await storage.getActiveSessionByToken(sessionA.token, {
    csrfToken: sessionA.csrfToken,
    requireCsrf: true,
    now: BASE_TIME + 501,
  })).userId, userA.id);
  assert.equal(
    (await storage.getActiveSessionByToken(sessionA.token, {
      csrfToken: restoredCsrf,
      requireCsrf: true,
      now: BASE_TIME + 501,
    })).userId,
    userA.id
  );
  assert.equal(
    (await storage.getActiveSessionByToken(sessionB.token, {
      csrfToken: sessionB.csrfToken,
      requireCsrf: true,
      now: BASE_TIME + 501,
    })).userId,
    userB.id
  );
  const concurrentRestores = await Promise.all([
    storage.getSessionCsrfToken(sessionB.token, { now: BASE_TIME + 600 }),
    storage.getSessionCsrfToken(sessionB.token, { now: BASE_TIME + 600 }),
  ]);
  assert.deepEqual(concurrentRestores, [sessionB.csrfToken, sessionB.csrfToken]);
  assert.equal((await storage.getActiveSessionByToken(sessionB.token, {
    csrfToken: sessionB.csrfToken,
    requireCsrf: true,
    now: BASE_TIME + 601,
  })).userId, userB.id);
  assert.ok(await storage.getActiveSessionByToken(sessionB.token, {
    csrfToken: concurrentRestores[1],
    requireCsrf: true,
    now: BASE_TIME + 601,
  }));
  const afterRestoresText = await fs.promises.readFile(filePath, 'utf8');
  assert.doesNotMatch(afterRestoresText, new RegExp(restoredCsrf));
  assert.doesNotMatch(afterRestoresText, new RegExp(concurrentRestores[1]));

  assert.equal(await storage.revokeSession(sessionA.token, { now: BASE_TIME + 1000 }), true);
  assert.equal(await storage.getSessionCsrfToken(sessionA.token, { now: BASE_TIME + 1001 }), null);
  assert.equal(await storage.getActiveSessionByToken(sessionA.token, { now: BASE_TIME + 1001 }), null);
  assert.equal(
    (await storage.getActiveSessionByToken(sessionB.token, { now: BASE_TIME + 1001 })).userId,
    userB.id
  );

  const expiring = await storage.createSession({ userId: userA.id, ttlMs: 1000, now: BASE_TIME });
  assert.equal(await storage.getActiveSessionByToken(expiring.token, { now: BASE_TIME + 1000 }), null);
  const afterExpiry = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
  const expiringDigest = digestSecret(expiring.token, 'test-token-pepper');
  assert.ok(afterExpiry.sessions.find((session) => session.tokenDigest === expiringDigest).revokedAt);

  const userASecond = await storage.createSession({ userId: userA.id, ttlMs: 60_000, now: BASE_TIME });
  assert.equal(await storage.revokeUserSessions(userA.id, { now: BASE_TIME + 2000 }), 1);
  assert.equal(await storage.getActiveSessionByToken(userASecond.token, { now: BASE_TIME + 2001 }), null);
  assert.ok(await storage.getActiveSessionByToken(sessionB.token, { now: BASE_TIME + 2001 }));
});

test('atomic JSON persistence survives concurrent writers without torn or lost records', async (t) => {
  const { directory, filePath, storage: first } = await localFixture(t);
  const second = createStorage({
    databaseUrl: '',
    jsonPath: filePath,
    tokenPepper: 'test-token-pepper',
    csrfPepper: 'test-csrf-pepper',
    clock: () => BASE_TIME,
  });
  await second.initialize();
  t.after(() => second.close());
  const user = await createTestUser(first, 'atomic');

  let observing = true;
  const parseErrors = [];
  const observer = (async () => {
    while (observing) {
      try {
        JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
      } catch (error) {
        parseErrors.push(error);
      }
      await new Promise((resolve) => setImmediate(resolve));
    }
  })();

  const writes = Array.from({ length: 32 }, (_, index) => {
    const target = index % 2 ? first : second;
    return target.upsertConceptProgress({
      userId: user.id,
      conceptId: `concept-${String(index).padStart(2, '0')}`,
      status: index % 3 ? 'learning' : 'confident',
      confidence: index,
      notes: `write ${index}`,
      updatedAt: BASE_TIME + index,
    });
  });
  await Promise.all(writes);
  observing = false;
  await observer;

  assert.deepEqual(parseErrors, []);
  assert.equal(Object.keys(await first.getConceptProgress(user.id)).length, 32);
  const artifacts = (await fs.promises.readdir(directory))
    .filter((name) => name.endsWith('.tmp') || name.endsWith('.lock'));
  assert.deepEqual(artifacts, []);
});

test('PostgreSQL stays optional and migrations are ledgered and idempotent', async () => {
  const adapter = new PostgresStorageAdapter({ databaseUrl: 'postgres://not-connected.example/db' });
  assert.equal(adapter.pool, null);

  const applied = new Set();
  const statements = [];
  const client = {
    async query(sql, parameters = []) {
      statements.push(sql);
      if (/SELECT 1 FROM algovista_schema_migrations/.test(sql)) {
        return { rowCount: applied.has(parameters[0]) ? 1 : 0, rows: [] };
      }
      if (/INSERT INTO algovista_schema_migrations/.test(sql)) applied.add(parameters[0]);
      return { rowCount: 0, rows: [] };
    },
  };

  await runPostgresMigrations(client);
  await runPostgresMigrations(client);
  assert.deepEqual([...applied], POSTGRES_MIGRATIONS.map((migration) => migration.version));
  assert.equal(statements.filter((sql) => /CREATE TABLE IF NOT EXISTS algovista_users/.test(sql)).length, 1);
  assert.equal(statements.filter((sql) => /CREATE TABLE IF NOT EXISTS algovista_practice_progress/.test(sql)).length, 1);
  assert.equal(statements.filter((sql) => (
    /ALTER TABLE algovista_practice_progress/.test(sql) &&
    /bookmarked/.test(sql) &&
    /review_count/.test(sql) &&
    /last_duration_seconds/.test(sql)
  )).length, 1);
  assert.equal(statements.filter((sql) => sql === 'BEGIN').length, 2);
  assert.equal(statements.filter((sql) => sql === 'COMMIT').length, 2);
});

test('PostgreSQL practice upsert round-trips the complete learning record', async () => {
  let captured = null;
  const row = {
    user_id: 'postgres-user',
    problem_id: 'two-sum',
    language: 'javascript',
    status: 'solved',
    attempts: 4,
    passes: 2,
    hints_used: 1,
    hint_depth: 2,
    solution_viewed: false,
    bookmarked: true,
    evidence_level: 'durable',
    last_verdict: 'accepted',
    review_count: 3,
    explanation: 'The complement is looked up before the current value is inserted.',
    confidence: 'confident',
    last_attempt_at: '2026-01-02T03:04:05.000Z',
    solved_at: '2026-01-01T03:04:05.000Z',
    next_review_at: '2026-01-09T03:04:05.000Z',
    last_duration_seconds: 420,
    created_at: '2026-01-01T03:04:05.000Z',
    updated_at: '2026-01-02T03:04:05.000Z',
  };
  const pool = {
    async query(sql, parameters) {
      captured = { sql, parameters };
      return { rowCount: 1, rows: [row] };
    },
  };
  const adapter = new PostgresStorageAdapter({ pool });
  adapter.initializePromise = Promise.resolve();

  const progress = {
    userId: row.user_id,
    problemId: row.problem_id,
    language: row.language,
    status: row.status,
    attempts: row.attempts,
    passes: row.passes,
    hintsUsed: row.hints_used,
    hintDepth: row.hint_depth,
    solutionViewed: row.solution_viewed,
    bookmarked: row.bookmarked,
    evidenceLevel: row.evidence_level,
    lastVerdict: row.last_verdict,
    reviewCount: row.review_count,
    explanation: row.explanation,
    confidence: row.confidence,
    lastAttemptAt: row.last_attempt_at,
    solvedAt: row.solved_at,
    nextReviewAt: row.next_review_at,
    lastDurationSeconds: row.last_duration_seconds,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  const result = await adapter.upsertPracticeProgress(progress);

  assert.match(captured.sql, /bookmarked, evidence_level/);
  assert.match(captured.sql, /review_count, explanation, confidence/);
  assert.match(captured.sql, /solved_at/);
  assert.equal(captured.parameters.length, 21);
  assert.equal(result.bookmarked, true);
  assert.equal(result.reviewCount, 3);
  assert.equal(result.explanation, row.explanation);
  assert.equal(result.confidence, 'confident');
  assert.equal(result.solvedAt, row.solved_at);
  assert.equal(result.lastDurationSeconds, 420);
});
