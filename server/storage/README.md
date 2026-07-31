# AlgoVista storage

One asynchronous repository contract backed by PostgreSQL in deployment and an atomic JSON file for local development. Requiring this directory does not load `pg`; the installed driver is loaded lazily only when PostgreSQL is selected.

## Selection and startup

```js
const { createStorage } = require('./storage');

const storage = createStorage({
  // Defaults to process.env.DATABASE_URL. Without it, server/data/db.json is used.
  databaseUrl: process.env.DATABASE_URL,
  tokenPepper: process.env.SESSION_DIGEST_PEPPER,
  csrfPepper: process.env.CSRF_DIGEST_PEPPER,
});

await storage.initialize(); // runs idempotent migrations or normalizes local JSON
```

The production deployment must install the declared `pg` dependency and provide `DATABASE_URL`. PostgreSQL initialization uses a transaction, a migration ledger, an advisory lock, and idempotent table/index statements.

## Users

```js
const user = await storage.createUser({
  name,
  email,
  passwordHash, // hash before calling storage; plaintext passwords are never accepted
});

const byEmail = await storage.findUserByEmail(email);
const byId = await storage.findUserById(userId);

// Authentication-only boundary; normal user lookups never expose a hash.
const credential = await storage.findUserCredentialByEmail(email);

// After a successful legacy-password login, persist an Argon2id rehash:
await storage.updateUserPasswordHash(userId, newPasswordHash);
```

## Sessions and CSRF

```js
const { token, csrfToken, session } = await storage.createSession({ userId });

const active = await storage.getActiveSessionByToken(token);
const mutationSession = await storage.getActiveSessionByToken(token, {
  csrfToken,
  requireCsrf: true,
});

// Restore the stable session-bound CSRF secret after a reload or in another tab.
const restoredCsrfToken = await storage.getSessionCsrfToken(token);

await storage.revokeSession(token);
await storage.revokeUserSessions(userId, { exceptToken: token });
await storage.pruneExpiredSessions();
```

Only SHA-256/HMAC digests reach either adapter. Raw session and CSRF values are never persisted. The CSRF value is deterministically derived from the raw session secret with a separate pepper, so every tab in the same session receives the same value without invalidating another tab. `getActiveSessionByToken` returns only `{ userId, createdAt, expiresAt }` or `null`. The API layer should require CSRF for cookie-authenticated state-changing browser requests and read the public user separately with `findUserById`.

`getSessionCsrfToken(token)` returns the derived value only for an active, unexpired session. `rotateSessionCsrf(token)` remains a compatibility alias but no longer rotates the token. Revoking the session invalidates both the cookie secret and its derived CSRF value.

## Concept progress

```js
await storage.upsertConceptProgress({
  userId,
  conceptId,
  status,       // not-started | learning | confident | mastered
  confidence,   // integer 0..100
  notes,
});

const progress = await storage.getConceptProgress(userId);
// { [conceptId]: { status, confidence, notes, updatedAt } }

const item = await storage.getConceptProgressItem(userId, conceptId);
```

Every progress key includes `userId`, both in JSON and in the PostgreSQL composite primary key, so one learner cannot overwrite another learner's record.

## Personalized practice and tutor profile

Practice is separated by user, canonical problem id, and language:

```js
await storage.upsertPracticeProgress({
  userId,
  problemId,
  language,
  status: 'attempted', // unsolved | attempted | solved
  attempts: 2,
  passes: 0,
  hintsUsed: 1,
  hintDepth: 1,
  solutionViewed: false,
  bookmarked: true,
  evidenceLevel: 'guided',
  lastVerdict: 'wrong-answer',
  reviewCount: 1,
  explanation: 'I can preserve the complement invariant without a hint.',
  confidence: 'developing', // shaky | developing | confident | null
  lastAttemptAt: new Date(),
  solvedAt: null,
  nextReviewAt,
  lastDurationSeconds: 540,
});

const practice = await storage.getPracticeProgress(userId);
// { [problemId]: { [language]: { status, attempts, passes, ... } } }
const rows = await storage.listPracticeProgress(userId);
const languageRecord = await storage.getPracticeProgressItem(userId, problemId, language);
```

Partial practice updates preserve omitted metrics. Bookmarks and learning records remain scoped to the same user/problem/language key. Explanations are capped at 2,000 characters, counters at 1,000,000, and a recorded practice duration at 86,400 seconds. Tutor profiles store bounded personalization, not conversations or raw code:

```js
await storage.upsertTutorProfile({
  userId,
  stage: 'intermediate',
  mastery: 58,
  confidence: 'developing',
  preferredLanguage: 'javascript',
  preferredMode: 'socratic',
  explanationDepth: 'balanced',
  visualLearning: true,
  reducedMotion: false,
  strengths: ['arrays'],
  focusAreas: ['dynamic programming'],
});

const profile = await storage.getTutorProfile(userId);
```

## Local migration and durability

The JSON adapter migrates older `{ users, sessions, progress }` and practice snapshots into schema version 3. Existing practice records receive safe defaults for the newer reflection fields. Legacy sessions without a CSRF digest are deliberately invalidated. Writes are serialized, guarded by a same-directory process lock, written to a mode-`0600` temporary file, fsynced, and atomically renamed. Malformed or oversized JSON is reported and never overwritten.

Call `await storage.close()` during graceful shutdown.
