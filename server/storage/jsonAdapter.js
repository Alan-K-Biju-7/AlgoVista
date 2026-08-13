'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const {
  StorageConflictError,
  StorageCorruptionError,
  StorageError,
  StorageNotFoundError,
} = require('./errors');
const { isDigest } = require('./secrets');

const JSON_SCHEMA_VERSION = 4;
const PROGRESS_STATUSES = new Set(['not-started', 'learning', 'confident', 'mastered']);
const PRACTICE_STATUSES = new Set(['unsolved', 'attempted', 'solved']);
const PRACTICE_EVIDENCE = new Set(['unknown', 'seen', 'guided', 'independent', 'durable', 'transfer']);
const PRACTICE_CONFIDENCE = new Set(['shaky', 'developing', 'confident']);
const PRACTICE_VERDICTS = new Set([
  'not-run',
  'accepted',
  'wrong-answer',
  'compile',
  'runtime',
  'timeout',
  'memory-limit',
  'unknown',
]);
const TUTOR_STAGES = new Set(['beginner', 'intermediate', 'advanced', 'unknown']);
const TUTOR_CONFIDENCE = new Set(['shaky', 'developing', 'confident', 'unknown']);
const TUTOR_MODES = new Set(['socratic', 'debug', 'dry-run', 'quiz', 'complexity', 'review']);
const EXPLANATION_DEPTHS = new Set(['concise', 'balanced', 'detailed']);
const FILE_MODE = 0o600;
const LOCK_STALE_MS = 30_000;
const LOCK_ATTEMPTS = 160;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

function clone(value) {
  return value === null || value === undefined
    ? value
    : JSON.parse(JSON.stringify(value));
}

function isoDate(value, label) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new StorageCorruptionError(`The local database contains an invalid ${label}.`);
  }
  return date.toISOString();
}

function requiredStoredString(value, label, maximum = 2048) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum) {
    throw new StorageCorruptionError(`The local database contains an invalid ${label}.`);
  }
  return value.trim();
}

function normalizeStoredUser(user) {
  if (!user || typeof user !== 'object' || Array.isArray(user)) {
    throw new StorageCorruptionError('The local database contains an invalid user.');
  }
  const createdAt = isoDate(user.createdAt, 'user createdAt');
  return {
    id: requiredStoredString(user.id, 'user id', 128),
    name: requiredStoredString(user.name, 'user name', 160),
    email: requiredStoredString(user.email, 'user email', 320).toLowerCase(),
    passwordHash: requiredStoredString(user.passwordHash, 'password hash'),
    createdAt,
    updatedAt: isoDate(user.updatedAt || createdAt, 'user updatedAt'),
  };
}

function normalizeStoredSession(session) {
  if (!session || typeof session !== 'object' || Array.isArray(session)) return null;
  const tokenDigest = session.tokenDigest || session.tokenHash;
  const csrfDigest = session.csrfDigest || session.csrfHash;
  // Legacy sessions did not contain a CSRF digest. They are intentionally
  // invalidated during migration instead of weakening the new contract.
  if (!isDigest(tokenDigest) || !isDigest(csrfDigest)) return null;

  const createdAt = isoDate(session.createdAt, 'session createdAt');
  const expiresAt = isoDate(session.expiresAt, 'session expiresAt');
  if (new Date(expiresAt).getTime() <= new Date(createdAt).getTime()) return null;
  return {
    tokenDigest,
    csrfDigest,
    userId: requiredStoredString(session.userId, 'session user id', 128),
    createdAt,
    expiresAt,
    revokedAt: session.revokedAt ? isoDate(session.revokedAt, 'session revokedAt') : null,
  };
}

function normalizeStoredProgress(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new StorageCorruptionError('The local database contains invalid concept progress.');
  }
  const status = requiredStoredString(entry.status, 'progress status', 32);
  if (!PROGRESS_STATUSES.has(status)) {
    throw new StorageCorruptionError('The local database contains an invalid progress status.');
  }
  const confidence = Number(entry.confidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) {
    throw new StorageCorruptionError('The local database contains invalid progress confidence.');
  }
  const updatedAt = isoDate(entry.updatedAt, 'progress updatedAt');
  return {
    userId: requiredStoredString(entry.userId, 'progress user id', 128),
    conceptId: requiredStoredString(entry.conceptId, 'concept id', 160),
    status,
    confidence: Math.round(confidence),
    notes: typeof entry.notes === 'string' ? entry.notes.slice(0, 1000) : '',
    createdAt: isoDate(entry.createdAt || updatedAt, 'progress createdAt'),
    updatedAt,
  };
}

function optionalIsoDate(value, label) {
  return value === null || value === undefined || value === '' ? null : isoDate(value, label);
}

function storedInteger(value, label, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new StorageCorruptionError(`The local database contains invalid ${label}.`);
  }
  return parsed;
}

function storedBoolean(value, label, fallback = false) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'boolean') {
    throw new StorageCorruptionError(`The local database contains invalid ${label}.`);
  }
  return value;
}

function storedPracticeExplanation(value) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') {
    throw new StorageCorruptionError('The local database contains an invalid practice explanation.');
  }
  const normalized = value.trim();
  if (normalized.length > 2_000 || CONTROL_CHARACTERS.test(normalized)) {
    throw new StorageCorruptionError('The local database contains an invalid practice explanation.');
  }
  return normalized;
}

function storedPracticeConfidence(value) {
  if (value === undefined || value === null || value === '') return null;
  const normalized = requiredStoredString(value, 'practice confidence', 32);
  if (!PRACTICE_CONFIDENCE.has(normalized)) {
    throw new StorageCorruptionError('The local database contains invalid practice confidence.');
  }
  return normalized;
}

function normalizeStoredPractice(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new StorageCorruptionError('The local database contains invalid practice progress.');
  }
  const status = requiredStoredString(entry.status, 'practice status', 32);
  const evidenceLevel = requiredStoredString(entry.evidenceLevel, 'practice evidence', 32);
  const lastVerdict = requiredStoredString(entry.lastVerdict, 'practice verdict', 32);
  if (!PRACTICE_STATUSES.has(status) || !PRACTICE_EVIDENCE.has(evidenceLevel) || !PRACTICE_VERDICTS.has(lastVerdict)) {
    throw new StorageCorruptionError('The local database contains unsupported practice progress values.');
  }
  const attempts = storedInteger(entry.attempts, 'practice attempts', 0, 1_000_000);
  const passes = storedInteger(entry.passes, 'practice passes', 0, attempts);
  const updatedAt = isoDate(entry.updatedAt, 'practice updatedAt');
  return {
    userId: requiredStoredString(entry.userId, 'practice user id', 128),
    problemId: requiredStoredString(entry.problemId, 'practice problem id', 160),
    language: requiredStoredString(entry.language, 'practice language', 48),
    status,
    attempts,
    passes,
    hintsUsed: storedInteger(entry.hintsUsed, 'practice hints used', 0, 1_000_000),
    hintDepth: storedInteger(entry.hintDepth, 'practice hint depth', 0, 3),
    solutionViewed: entry.solutionViewed === true,
    bookmarked: storedBoolean(entry.bookmarked, 'practice bookmark'),
    evidenceLevel,
    lastVerdict,
    reviewCount: storedInteger(entry.reviewCount ?? 0, 'practice review count', 0, 1_000_000),
    explanation: storedPracticeExplanation(entry.explanation),
    confidence: storedPracticeConfidence(entry.confidence),
    lastAttemptAt: optionalIsoDate(entry.lastAttemptAt, 'practice lastAttemptAt'),
    solvedAt: optionalIsoDate(entry.solvedAt, 'practice solvedAt'),
    nextReviewAt: optionalIsoDate(entry.nextReviewAt, 'practice nextReviewAt'),
    lastDurationSeconds: storedInteger(
      entry.lastDurationSeconds ?? 0,
      'practice last duration seconds',
      0,
      86_400
    ),
    createdAt: isoDate(entry.createdAt || updatedAt, 'practice createdAt'),
    updatedAt,
  };
}

function normalizeStoredStringArray(value, label) {
  if (!Array.isArray(value) || value.length > 12) {
    throw new StorageCorruptionError(`The local database contains invalid ${label}.`);
  }
  return [...new Set(value.map((item) => requiredStoredString(item, label, 160)))];
}

function normalizeStoredTutorProfile(profile) {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    throw new StorageCorruptionError('The local database contains an invalid tutor profile.');
  }
  const stage = requiredStoredString(profile.stage, 'tutor stage', 32);
  const confidence = requiredStoredString(profile.confidence, 'tutor confidence', 32);
  const preferredMode = requiredStoredString(profile.preferredMode, 'preferred tutor mode', 32);
  const explanationDepth = requiredStoredString(profile.explanationDepth, 'explanation depth', 32);
  if (
    !TUTOR_STAGES.has(stage) ||
    !TUTOR_CONFIDENCE.has(confidence) ||
    !TUTOR_MODES.has(preferredMode) ||
    !EXPLANATION_DEPTHS.has(explanationDepth)
  ) {
    throw new StorageCorruptionError('The local database contains unsupported tutor profile values.');
  }
  const updatedAt = isoDate(profile.updatedAt, 'tutor profile updatedAt');
  if (
    typeof profile.preferredLanguage !== 'string' ||
    profile.preferredLanguage.length > 48 ||
    /[\u0000-\u001f\u007f]/.test(profile.preferredLanguage)
  ) {
    throw new StorageCorruptionError('The local database contains an invalid preferred language.');
  }
  return {
    userId: requiredStoredString(profile.userId, 'tutor profile user id', 128),
    stage,
    mastery: storedInteger(profile.mastery, 'tutor mastery', 0, 100),
    confidence,
    preferredLanguage: profile.preferredLanguage.trim(),
    preferredMode,
    explanationDepth,
    visualLearning: profile.visualLearning !== false,
    reducedMotion: profile.reducedMotion === true,
    strengths: normalizeStoredStringArray(profile.strengths, 'tutor strengths'),
    focusAreas: normalizeStoredStringArray(profile.focusAreas, 'tutor focus areas'),
    createdAt: isoDate(profile.createdAt || updatedAt, 'tutor profile createdAt'),
    updatedAt,
  };
}

function legacyProgressEntries(progress) {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return [];
  const entries = [];
  for (const [userId, concepts] of Object.entries(progress)) {
    if (!concepts || typeof concepts !== 'object' || Array.isArray(concepts)) continue;
    for (const [conceptId, value] of Object.entries(concepts)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
      entries.push({ userId, conceptId, ...value });
    }
  }
  return entries;
}

function normalizeJsonState(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new StorageCorruptionError('The local database root must be an object.');
  }
  const schemaVersion = input.schemaVersion === undefined ? 0 : Number(input.schemaVersion);
  if (!Number.isSafeInteger(schemaVersion) || schemaVersion < 0) {
    throw new StorageCorruptionError('The local database schema version is invalid.');
  }
  if (schemaVersion > JSON_SCHEMA_VERSION) {
    throw new StorageCorruptionError('The local database was written by a newer server version.');
  }

  const users = (Array.isArray(input.users) ? input.users : []).map(normalizeStoredUser);
  const userIds = new Set();
  const emails = new Set();
  for (const user of users) {
    if (userIds.has(user.id) || emails.has(user.email)) {
      throw new StorageCorruptionError('The local database contains duplicate users.');
    }
    userIds.add(user.id);
    emails.add(user.email);
  }

  const sessions = [];
  const sessionDigests = new Set();
  for (const candidate of Array.isArray(input.sessions) ? input.sessions : []) {
    const session = normalizeStoredSession(candidate);
    if (!session || !userIds.has(session.userId)) continue;
    if (sessionDigests.has(session.tokenDigest)) {
      throw new StorageCorruptionError('The local database contains duplicate sessions.');
    }
    sessionDigests.add(session.tokenDigest);
    sessions.push(session);
  }

  const rawProgress = Array.isArray(input.conceptProgress)
    ? input.conceptProgress
    : legacyProgressEntries(input.progress);
  const conceptProgress = [];
  const progressKeys = new Set();
  for (const candidate of rawProgress) {
    const entry = normalizeStoredProgress(candidate);
    if (!userIds.has(entry.userId)) continue;
    const key = `${entry.userId}\u0000${entry.conceptId}`;
    if (progressKeys.has(key)) {
      throw new StorageCorruptionError('The local database contains duplicate concept progress.');
    }
    progressKeys.add(key);
    conceptProgress.push(entry);
  }

  const practiceProgress = [];
  const practiceKeys = new Set();
  for (const candidate of Array.isArray(input.practiceProgress) ? input.practiceProgress : []) {
    const entry = normalizeStoredPractice(candidate);
    if (!userIds.has(entry.userId)) continue;
    const key = `${entry.userId}\u0000${entry.problemId}\u0000${entry.language}`;
    if (practiceKeys.has(key)) {
      throw new StorageCorruptionError('The local database contains duplicate practice progress.');
    }
    practiceKeys.add(key);
    practiceProgress.push(entry);
  }

  const tutorProfiles = [];
  const tutorUserIds = new Set();
  for (const candidate of Array.isArray(input.tutorProfiles) ? input.tutorProfiles : []) {
    const profile = normalizeStoredTutorProfile(candidate);
    if (!userIds.has(profile.userId)) continue;
    if (tutorUserIds.has(profile.userId)) {
      throw new StorageCorruptionError('The local database contains duplicate tutor profiles.');
    }
    tutorUserIds.add(profile.userId);
    tutorProfiles.push(profile);
  }

  return {
    schemaVersion: JSON_SCHEMA_VERSION,
    users: users.sort((left, right) => left.id.localeCompare(right.id)),
    sessions: sessions.sort((left, right) => left.tokenDigest.localeCompare(right.tokenDigest)),
    conceptProgress: conceptProgress.sort((left, right) => (
      left.userId.localeCompare(right.userId) || left.conceptId.localeCompare(right.conceptId)
    )),
    practiceProgress: practiceProgress.sort((left, right) => (
      left.userId.localeCompare(right.userId) ||
      left.problemId.localeCompare(right.problemId) ||
      left.language.localeCompare(right.language)
    )),
    tutorProfiles: tutorProfiles.sort((left, right) => left.userId.localeCompare(right.userId)),
    coachingEvents: Array.isArray(input.coachingEvents) ? clone(input.coachingEvents) : [],
  };
}

function emptyJsonState() {
  return normalizeJsonState({
    schemaVersion: JSON_SCHEMA_VERSION,
    users: [],
    sessions: [],
    conceptProgress: [],
    practiceProgress: [],
    tutorProfiles: [],
    coachingEvents: [],
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

class JsonStorageAdapter {
  constructor({ filePath, maxFileBytes = 32 * 1024 * 1024 } = {}) {
    if (!filePath || typeof filePath !== 'string') {
      throw new StorageError('A local database file path is required.', 'invalid_json_storage_path');
    }
    this.kind = 'json';
    if (!Number.isSafeInteger(maxFileBytes) || maxFileBytes < 1024 || maxFileBytes > 512 * 1024 * 1024) {
      throw new StorageError('maxFileBytes is not valid.', 'invalid_json_storage_limit');
    }
    this.filePath = path.resolve(filePath);
    this.directory = path.dirname(this.filePath);
    this.lockPath = `${this.filePath}.lock`;
    this.maxFileBytes = maxFileBytes;
    this.queue = Promise.resolve();
    this.initializePromise = null;
  }

  enqueue(operation) {
    const current = this.queue.then(operation, operation);
    this.queue = current.catch(() => {});
    return current;
  }

  async acquireLock() {
    for (let attempt = 0; attempt < LOCK_ATTEMPTS; attempt += 1) {
      try {
        const handle = await fs.promises.open(this.lockPath, 'wx', FILE_MODE);
        await handle.writeFile(`${process.pid}\n`, 'utf8');
        return handle;
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
        try {
          const stat = await fs.promises.stat(this.lockPath);
          if (Date.now() - stat.mtimeMs > LOCK_STALE_MS) {
            await fs.promises.unlink(this.lockPath);
            continue;
          }
        } catch (statError) {
          if (statError.code === 'ENOENT') continue;
          throw statError;
        }
        await delay(Math.min(40, 4 + attempt));
      }
    }
    throw new StorageError('The local database is busy.', 'json_storage_busy');
  }

  async releaseLock(handle) {
    try {
      await handle.close();
    } finally {
      await fs.promises.unlink(this.lockPath).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
    }
  }

  async readState() {
    let raw;
    try {
      const stat = await fs.promises.stat(this.filePath);
      if (!stat.isFile() || stat.size > this.maxFileBytes) {
        throw new StorageCorruptionError('The local database file is not safe to read.');
      }
      raw = await fs.promises.readFile(this.filePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') return emptyJsonState();
      throw error;
    }
    try {
      return normalizeJsonState(JSON.parse(raw));
    } catch (error) {
      if (error instanceof StorageCorruptionError) throw error;
      throw new StorageCorruptionError('The local database is not valid JSON.', 'storage_corruption', { cause: error });
    }
  }

  async atomicWrite(state) {
    const serialized = `${JSON.stringify(normalizeJsonState(state), null, 2)}\n`;
    const temporaryPath = path.join(
      this.directory,
      `.${path.basename(this.filePath)}.${process.pid}.${crypto.randomUUID()}.tmp`
    );
    let handle;
    try {
      handle = await fs.promises.open(temporaryPath, 'wx', FILE_MODE);
      await handle.writeFile(serialized, 'utf8');
      await handle.sync();
      await handle.close();
      handle = null;
      await fs.promises.rename(temporaryPath, this.filePath);
      await fs.promises.chmod(this.filePath, FILE_MODE);

      // Persist the directory entry where the platform supports it.
      let directoryHandle;
      try {
        directoryHandle = await fs.promises.open(this.directory, 'r');
        await directoryHandle.sync();
      } catch (error) {
        if (!['EINVAL', 'ENOTSUP', 'EPERM', 'EISDIR'].includes(error.code)) throw error;
      } finally {
        if (directoryHandle) await directoryHandle.close();
      }
    } finally {
      if (handle) await handle.close().catch(() => {});
      await fs.promises.unlink(temporaryPath).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
    }
  }

  async initialize() {
    if (!this.initializePromise) {
      this.initializePromise = this.enqueue(async () => {
        await fs.promises.mkdir(this.directory, { recursive: true, mode: 0o700 });
        const lock = await this.acquireLock();
        try {
          const state = await this.readState();
          await this.atomicWrite(state);
        } finally {
          await this.releaseLock(lock);
        }
      });
    }
    await this.initializePromise;
    return this;
  }

  async ready() {
    await this.initialize();
  }

  async read(operation) {
    await this.ready();
    await this.queue;
    return operation(await this.readState());
  }

  async update(operation) {
    await this.ready();
    return this.enqueue(async () => {
      const lock = await this.acquireLock();
      try {
        const state = await this.readState();
        const result = await operation(state);
        await this.atomicWrite(state);
        return clone(result);
      } finally {
        await this.releaseLock(lock);
      }
    });
  }

  async insertUser(user) {
    return this.update((state) => {
      if (state.users.some((item) => item.id === user.id || item.email === user.email)) {
        throw new StorageConflictError('A user with this id or email already exists.', 'user_conflict');
      }
      state.users.push(clone(user));
      return user;
    });
  }

  async findUserByEmail(email) {
    return this.read((state) => clone(state.users.find((user) => user.email === email) || null));
  }

  async findUserById(userId) {
    return this.read((state) => clone(state.users.find((user) => user.id === userId) || null));
  }

  async updateUserPasswordHash(userId, passwordHash, updatedAt) {
    return this.update((state) => {
      const user = state.users.find((item) => item.id === userId);
      if (!user) return null;
      user.passwordHash = passwordHash;
      user.updatedAt = updatedAt;
      return user;
    });
  }

  async insertSession(session) {
    return this.update((state) => {
      if (!state.users.some((user) => user.id === session.userId)) {
        throw new StorageNotFoundError('The session user does not exist.', 'user_not_found');
      }
      if (state.sessions.some((item) => item.tokenDigest === session.tokenDigest)) {
        throw new StorageConflictError('The session already exists.', 'session_conflict');
      }
      state.sessions.push(clone(session));
      return session;
    });
  }

  async findSessionByTokenDigest(tokenDigest) {
    return this.read((state) => clone(
      state.sessions.find((session) => session.tokenDigest === tokenDigest) || null
    ));
  }

  async revokeSession(tokenDigest, revokedAt) {
    return this.update((state) => {
      const session = state.sessions.find((item) => item.tokenDigest === tokenDigest);
      if (!session || session.revokedAt) return false;
      session.revokedAt = revokedAt;
      return true;
    });
  }

  async updateSessionCsrfDigest(tokenDigest, expectedCsrfDigest, csrfDigest, now) {
    return this.update((state) => {
      const session = state.sessions.find((item) => item.tokenDigest === tokenDigest);
      if (
        !session ||
        session.revokedAt ||
        session.csrfDigest !== expectedCsrfDigest ||
        new Date(session.expiresAt).getTime() <= new Date(now).getTime()
      ) return false;
      session.csrfDigest = csrfDigest;
      return true;
    });
  }

  async revokeUserSessions(userId, exceptDigest, revokedAt) {
    return this.update((state) => {
      let count = 0;
      for (const session of state.sessions) {
        if (session.userId !== userId || session.revokedAt || session.tokenDigest === exceptDigest) continue;
        session.revokedAt = revokedAt;
        count += 1;
      }
      return count;
    });
  }

  async deleteExpiredSessions(now) {
    return this.update((state) => {
      const before = state.sessions.length;
      const timestamp = new Date(now).getTime();
      state.sessions = state.sessions.filter((session) => new Date(session.expiresAt).getTime() > timestamp);
      return before - state.sessions.length;
    });
  }

  async listConceptProgress(userId) {
    return this.read((state) => clone(
      state.conceptProgress
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => left.conceptId.localeCompare(right.conceptId))
    ));
  }

  async findConceptProgress(userId, conceptId) {
    return this.read((state) => clone(
      state.conceptProgress.find((entry) => (
        entry.userId === userId && entry.conceptId === conceptId
      )) || null
    ));
  }

  async upsertConceptProgress(progress) {
    return this.update((state) => {
      if (!state.users.some((user) => user.id === progress.userId)) {
        throw new StorageNotFoundError('The progress user does not exist.', 'user_not_found');
      }
      const existing = state.conceptProgress.find((entry) => (
        entry.userId === progress.userId && entry.conceptId === progress.conceptId
      ));
      if (existing) {
        existing.status = progress.status;
        existing.confidence = progress.confidence;
        existing.notes = progress.notes;
        existing.updatedAt = progress.updatedAt;
        return existing;
      }
      state.conceptProgress.push(clone(progress));
      return progress;
    });
  }

  async listPracticeProgress(userId) {
    return this.read((state) => clone(
      state.practiceProgress
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => (
          left.problemId.localeCompare(right.problemId) || left.language.localeCompare(right.language)
        ))
    ));
  }

  async findPracticeProgress(userId, problemId, language) {
    return this.read((state) => clone(
      state.practiceProgress.find((entry) => (
        entry.userId === userId &&
        entry.problemId === problemId &&
        entry.language === language
      )) || null
    ));
  }

  async upsertPracticeProgress(progress) {
    return this.update((state) => {
      if (!state.users.some((user) => user.id === progress.userId)) {
        throw new StorageNotFoundError('The practice user does not exist.', 'user_not_found');
      }
      const existing = state.practiceProgress.find((entry) => (
        entry.userId === progress.userId &&
        entry.problemId === progress.problemId &&
        entry.language === progress.language
      ));
      if (existing) {
        const createdAt = existing.createdAt;
        Object.assign(existing, clone(progress), { createdAt });
        return existing;
      }
      state.practiceProgress.push(clone(progress));
      return progress;
    });
  }

  async findTutorProfile(userId) {
    return this.read((state) => clone(
      state.tutorProfiles.find((profile) => profile.userId === userId) || null
    ));
  }

  async upsertTutorProfile(profile) {
    return this.update((state) => {
      if (!state.users.some((user) => user.id === profile.userId)) {
        throw new StorageNotFoundError('The tutor profile user does not exist.', 'user_not_found');
      }
      const existing = state.tutorProfiles.find((item) => item.userId === profile.userId);
      if (existing) {
        const createdAt = existing.createdAt;
        Object.assign(existing, clone(profile), { createdAt });
        return existing;
      }
      state.tutorProfiles.push(clone(profile));
      return profile;
    });
  }

  async insertCoachingEvent(event) {
    return this.update((state) => {
      state.coachingEvents.push(clone(event));
      return event;
    });
  }

  async listCoachingEvents(userId) {
    return this.read((state) => clone(state.coachingEvents.filter((event) => event.userId === userId)));
  }

  async healthCheck() {
    return this.read((state) => ({
      ok: true,
      kind: this.kind,
      schemaVersion: state.schemaVersion,
    }));
  }

  async close() {
    await this.queue;
  }
}

module.exports = {
  JSON_SCHEMA_VERSION,
  JsonStorageAdapter,
  emptyJsonState,
  normalizeJsonState,
};
