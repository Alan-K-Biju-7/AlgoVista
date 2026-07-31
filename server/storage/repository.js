'use strict';

const crypto = require('node:crypto');
const {
  StorageConflictError,
  StorageNotFoundError,
  StorageValidationError,
} = require('./errors');
const {
  deriveSessionCsrfToken,
  digestSecret,
  generateSecret,
  isPlausibleSecret,
  safeDigestEqual,
} = require('./secrets');

const DEFAULT_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000;
const PROGRESS_STATUSES = new Set(['not-started', 'learning', 'confident', 'mastered']);
const PRACTICE_STATUSES = new Set(['unsolved', 'attempted', 'solved']);
const PRACTICE_EVIDENCE = new Set(['unknown', 'seen', 'guided', 'independent', 'durable', 'transfer']);
const PRACTICE_CONFIDENCE = new Set(['shaky', 'developing', 'confident']);
const PRACTICE_VERDICTS = new Set([
  'not-run', 'accepted', 'wrong-answer', 'compile', 'runtime', 'timeout', 'memory-limit', 'unknown',
]);
const TUTOR_STAGES = new Set(['beginner', 'intermediate', 'advanced', 'unknown']);
const TUTOR_CONFIDENCE = new Set(['shaky', 'developing', 'confident', 'unknown']);
const TUTOR_MODES = new Set(['socratic', 'debug', 'dry-run', 'quiz', 'complexity', 'review']);
const EXPLANATION_DEPTHS = new Set(['concise', 'balanced', 'detailed']);
const RESERVED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

function requiredText(value, field, maximum, minimum = 1) {
  if (typeof value !== 'string') {
    throw new StorageValidationError(`${field} must be a string.`, `invalid_${field}`);
  }
  const normalized = value.trim();
  if (
    normalized.length < minimum ||
    normalized.length > maximum ||
    CONTROL_CHARACTERS.test(normalized) ||
    (field.endsWith('Id') && RESERVED_KEYS.has(normalized.toLowerCase()))
  ) {
    throw new StorageValidationError(`${field} is not valid.`, `invalid_${field}`);
  }
  return normalized;
}

function integerInRange(value, field, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new StorageValidationError(`${field} is not valid.`, `invalid_${field}`);
  }
  return parsed;
}

function enumInSet(value, field, allowed) {
  const normalized = requiredText(value, field, 48);
  if (!allowed.has(normalized)) {
    throw new StorageValidationError(`${field} is not valid.`, `invalid_${field}`);
  }
  return normalized;
}

function optionalIsoDate(value, field) {
  return value === null || value === undefined || value === ''
    ? null
    : toDate(value, field).toISOString();
}

function optionalText(value, field, maximum) {
  if (value === null || value === undefined || value === '') return '';
  return requiredText(value, field, maximum);
}

function optionalPracticeConfidence(value) {
  if (value === null || value === undefined || value === '') return null;
  return enumInSet(value, 'practiceConfidence', PRACTICE_CONFIDENCE);
}

function practiceExplanation(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') {
    throw new StorageValidationError('explanation must be a string.', 'invalid_explanation');
  }
  const normalized = value.trim();
  if (normalized.length > 2_000 || CONTROL_CHARACTERS.test(normalized)) {
    throw new StorageValidationError('explanation is not valid.', 'invalid_explanation');
  }
  return normalized;
}

function stringList(value, field) {
  if (!Array.isArray(value) || value.length > 12) {
    throw new StorageValidationError(`${field} is not valid.`, `invalid_${field}`);
  }
  return [...new Set(value.map((item) => requiredText(item, field, 160)))];
}

function own(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function normalizeEmail(value) {
  const email = requiredText(value, 'email', 320).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new StorageValidationError('email is not valid.', 'invalid_email');
  }
  return email;
}

function normalizePasswordHash(value) {
  const passwordHash = requiredText(value, 'passwordHash', 2048, 20);
  const isArgon2id = /^\$argon2id\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/.test(passwordHash);
  const isPbkdf2 = /^\d+:[a-f0-9]{16,}:[a-f0-9]{32,}$/i.test(passwordHash);
  const isScrypt = /^scrypt\$\d+\$\d+\$\d+\$\d+\$[a-f0-9]{16,}\$[a-f0-9]{32,}$/i.test(passwordHash);
  if (!isArgon2id && !isPbkdf2 && !isScrypt) {
    throw new StorageValidationError('passwordHash must be an encoded password hash.', 'invalid_passwordHash');
  }
  return passwordHash;
}

function toDate(value, field = 'date') {
  const date = value === undefined ? new Date() : new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new StorageValidationError(`${field} is not valid.`, `invalid_${field}`);
  }
  return date;
}

function publicSession(session) {
  if (!session) return null;
  return {
    userId: session.userId,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  };
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function passwordCredential(user) {
  if (!user) return null;
  return {
    id: user.id,
    passwordHash: user.passwordHash,
  };
}

function publicProgress(entry) {
  if (!entry) return null;
  return {
    status: entry.status,
    confidence: entry.confidence,
    notes: entry.notes,
    updatedAt: entry.updatedAt,
  };
}

function publicPractice(entry) {
  if (!entry) return null;
  return {
    status: entry.status,
    attempts: entry.attempts,
    passes: entry.passes,
    hintsUsed: entry.hintsUsed,
    hintDepth: entry.hintDepth,
    solutionViewed: entry.solutionViewed,
    bookmarked: entry.bookmarked,
    evidenceLevel: entry.evidenceLevel,
    lastVerdict: entry.lastVerdict,
    reviewCount: entry.reviewCount,
    explanation: entry.explanation,
    confidence: entry.confidence,
    lastAttemptAt: entry.lastAttemptAt,
    solvedAt: entry.solvedAt,
    nextReviewAt: entry.nextReviewAt,
    lastDurationSeconds: entry.lastDurationSeconds,
    updatedAt: entry.updatedAt,
  };
}

function publicTutorProfile(profile) {
  if (!profile) return null;
  return {
    stage: profile.stage,
    mastery: profile.mastery,
    confidence: profile.confidence,
    preferredLanguage: profile.preferredLanguage,
    preferredMode: profile.preferredMode,
    explanationDepth: profile.explanationDepth,
    visualLearning: profile.visualLearning,
    reducedMotion: profile.reducedMotion,
    strengths: [...profile.strengths],
    focusAreas: [...profile.focusAreas],
    updatedAt: profile.updatedAt,
  };
}

class StorageRepository {
  constructor(adapter, {
    tokenPepper = '',
    csrfPepper = tokenPepper,
    sessionTtlMs = DEFAULT_SESSION_TTL_MS,
    clock = () => Date.now(),
    secretGenerator = generateSecret,
  } = {}) {
    if (!adapter || typeof adapter.initialize !== 'function') {
      throw new StorageValidationError('A storage adapter is required.', 'invalid_storage_adapter');
    }
    if (!Number.isFinite(sessionTtlMs) || sessionTtlMs < 1000 || sessionTtlMs > MAX_SESSION_TTL_MS) {
      throw new StorageValidationError('sessionTtlMs is not valid.', 'invalid_session_ttl');
    }
    this.adapter = adapter;
    this.kind = adapter.kind || 'custom';
    this.tokenPepper = String(tokenPepper || '');
    this.csrfPepper = String(csrfPepper || '');
    this.sessionTtlMs = Math.round(sessionTtlMs);
    this.clock = clock;
    this.secretGenerator = secretGenerator;
    this.initializePromise = null;
  }

  async initialize() {
    if (!this.initializePromise) {
      this.initializePromise = Promise.resolve().then(() => this.adapter.initialize());
    }
    await this.initializePromise;
    return this;
  }

  async ready() {
    await this.initialize();
  }

  currentDate(value, field = 'now') {
    return toDate(value === undefined ? this.clock() : value, field);
  }

  async createUser({ id, name, email, passwordHash, createdAt } = {}) {
    await this.ready();
    const created = this.currentDate(createdAt, 'createdAt').toISOString();
    const user = {
      id: id === undefined ? crypto.randomUUID() : requiredText(id, 'userId', 128),
      name: requiredText(name, 'name', 160, 2),
      email: normalizeEmail(email),
      passwordHash: normalizePasswordHash(passwordHash),
      createdAt: created,
      updatedAt: created,
    };
    return publicUser(await this.adapter.insertUser(user));
  }

  async findUserByEmail(email) {
    await this.ready();
    return publicUser(await this.adapter.findUserByEmail(normalizeEmail(email)));
  }

  // Authentication is the only caller that should receive a password hash.
  // Keeping that access behind an explicit credential method makes accidental
  // serialization through normal user lookups much harder.
  async findUserCredentialByEmail(email) {
    await this.ready();
    return passwordCredential(await this.adapter.findUserByEmail(normalizeEmail(email)));
  }

  async findUserById(userId) {
    await this.ready();
    return publicUser(await this.adapter.findUserById(requiredText(userId, 'userId', 128)));
  }

  async updateUserPasswordHash(userId, passwordHash, { updatedAt } = {}) {
    await this.ready();
    const updated = await this.adapter.updateUserPasswordHash(
      requiredText(userId, 'userId', 128),
      normalizePasswordHash(passwordHash),
      this.currentDate(updatedAt, 'updatedAt').toISOString()
    );
    if (!updated) throw new StorageNotFoundError('The user does not exist.', 'user_not_found');
    return publicUser(updated);
  }

  async createSession({ userId, ttlMs = this.sessionTtlMs, now } = {}) {
    await this.ready();
    const normalizedUserId = requiredText(userId, 'userId', 128);
    if (!Number.isFinite(ttlMs) || ttlMs < 1000 || ttlMs > MAX_SESSION_TTL_MS) {
      throw new StorageValidationError('ttlMs is not valid.', 'invalid_session_ttl');
    }
    if (!await this.adapter.findUserById(normalizedUserId)) {
      throw new StorageNotFoundError('The session user does not exist.', 'user_not_found');
    }

    const createdDate = this.currentDate(now);
    const createdAt = createdDate.toISOString();
    const expiresAt = new Date(createdDate.getTime() + Math.round(ttlMs)).toISOString();

    // Digest collisions are extraordinarily unlikely, but retrying means the
    // repository never has to return a secret it failed to persist.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const token = this.secretGenerator(32);
      const csrfToken = deriveSessionCsrfToken(token, this.csrfPepper);
      if (!isPlausibleSecret(token) || !isPlausibleSecret(csrfToken)) {
        throw new StorageValidationError('The secret generator returned an invalid value.', 'invalid_session_secret');
      }
      const record = {
        tokenDigest: digestSecret(token, this.tokenPepper),
        csrfDigest: digestSecret(csrfToken, this.csrfPepper),
        userId: normalizedUserId,
        createdAt,
        expiresAt,
        revokedAt: null,
      };

      try {
        await this.adapter.insertSession(record);
        return { token, csrfToken, session: publicSession(record) };
      } catch (error) {
        if (!(error instanceof StorageConflictError) || attempt === 2) throw error;
      }
    }
    throw new StorageConflictError('A unique session could not be created.', 'session_collision');
  }

  async getActiveSessionByToken(token, {
    now,
    csrfToken,
    requireCsrf = false,
  } = {}) {
    await this.ready();
    if (!isPlausibleSecret(token)) return null;
    const tokenDigest = digestSecret(token, this.tokenPepper);
    const session = await this.adapter.findSessionByTokenDigest(tokenDigest);
    if (!session || session.revokedAt) return null;

    const current = this.currentDate(now);
    if (new Date(session.expiresAt).getTime() <= current.getTime()) {
      await this.adapter.revokeSession(tokenDigest, current.toISOString());
      return null;
    }

    if (requireCsrf) {
      if (!isPlausibleSecret(csrfToken)) return null;
      const expectedCsrf = deriveSessionCsrfToken(token, this.csrfPepper);
      const attemptedCsrf = digestSecret(csrfToken, this.csrfPepper);
      const expectedDigest = digestSecret(expectedCsrf, this.csrfPepper);
      if (!safeDigestEqual(attemptedCsrf, expectedDigest)) return null;
    }
    return publicSession(session);
  }

  async revokeSession(token, { now } = {}) {
    await this.ready();
    if (!isPlausibleSecret(token)) return false;
    return this.adapter.revokeSession(
      digestSecret(token, this.tokenPepper),
      this.currentDate(now).toISOString()
    );
  }

  async getSessionCsrfToken(token, { now } = {}) {
    await this.ready();
    if (!isPlausibleSecret(token)) return null;
    const tokenDigest = digestSecret(token, this.tokenPepper);
    const current = this.currentDate(now);
    const session = await this.adapter.findSessionByTokenDigest(tokenDigest);
    if (!session || session.revokedAt) return null;
    if (new Date(session.expiresAt).getTime() <= current.getTime()) {
      await this.adapter.revokeSession(tokenDigest, current.toISOString());
      return null;
    }

    return deriveSessionCsrfToken(token, this.csrfPepper);
  }

  // Backward-compatible alias. CSRF tokens are now deterministic per session,
  // so restoring one in another tab cannot invalidate an active form.
  async rotateSessionCsrf(token, options = {}) {
    return this.getSessionCsrfToken(token, options);
  }

  async revokeUserSessions(userId, { exceptToken, now } = {}) {
    await this.ready();
    const normalizedUserId = requiredText(userId, 'userId', 128);
    const exceptDigest = isPlausibleSecret(exceptToken)
      ? digestSecret(exceptToken, this.tokenPepper)
      : null;
    return this.adapter.revokeUserSessions(
      normalizedUserId,
      exceptDigest,
      this.currentDate(now).toISOString()
    );
  }

  async pruneExpiredSessions({ now } = {}) {
    await this.ready();
    return this.adapter.deleteExpiredSessions(this.currentDate(now).toISOString());
  }

  async getConceptProgress(userId) {
    await this.ready();
    const entries = await this.adapter.listConceptProgress(requiredText(userId, 'userId', 128));
    const progress = entries.reduce((result, entry) => {
      result[entry.conceptId] = publicProgress(entry);
      return result;
    }, Object.create(null));
    return JSON.parse(JSON.stringify(progress));
  }

  async getConceptProgressItem(userId, conceptId) {
    await this.ready();
    const entry = await this.adapter.findConceptProgress(
      requiredText(userId, 'userId', 128),
      requiredText(conceptId, 'conceptId', 160)
    );
    return publicProgress(entry);
  }

  async upsertConceptProgress({
    userId,
    conceptId,
    status,
    confidence = 0,
    notes = '',
    updatedAt,
  } = {}) {
    await this.ready();
    const normalizedUserId = requiredText(userId, 'userId', 128);
    if (!await this.adapter.findUserById(normalizedUserId)) {
      throw new StorageNotFoundError('The progress user does not exist.', 'user_not_found');
    }
    const normalizedStatus = requiredText(status, 'status', 32);
    if (!PROGRESS_STATUSES.has(normalizedStatus)) {
      throw new StorageValidationError('status is not valid.', 'invalid_progress_status');
    }
    const parsedConfidence = Number(confidence);
    if (!Number.isFinite(parsedConfidence) || parsedConfidence < 0 || parsedConfidence > 100) {
      throw new StorageValidationError('confidence is not valid.', 'invalid_confidence');
    }
    if (typeof notes !== 'string' || notes.length > 1000 || CONTROL_CHARACTERS.test(notes)) {
      throw new StorageValidationError('notes is not valid.', 'invalid_notes');
    }
    const timestamp = this.currentDate(updatedAt, 'updatedAt').toISOString();
    const record = await this.adapter.upsertConceptProgress({
      userId: normalizedUserId,
      conceptId: requiredText(conceptId, 'conceptId', 160),
      status: normalizedStatus,
      confidence: Math.round(parsedConfidence),
      notes: notes.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    return publicProgress(record);
  }

  async listPracticeProgress(userId) {
    await this.ready();
    const entries = await this.adapter.listPracticeProgress(requiredText(userId, 'userId', 128));
    return entries.map((entry) => ({
      problemId: entry.problemId,
      language: entry.language,
      ...publicPractice(entry),
    }));
  }

  async getPracticeProgress(userId) {
    const entries = await this.listPracticeProgress(userId);
    const progress = entries.reduce((result, entry) => {
      if (!result[entry.problemId]) result[entry.problemId] = Object.create(null);
      const { problemId, language, ...value } = entry;
      result[problemId][language] = value;
      return result;
    }, Object.create(null));
    return JSON.parse(JSON.stringify(progress));
  }

  async getPracticeProgressItem(userId, problemId, language) {
    await this.ready();
    const entry = await this.adapter.findPracticeProgress(
      requiredText(userId, 'userId', 128),
      requiredText(problemId, 'problemId', 160),
      requiredText(language, 'language', 48).toLowerCase()
    );
    return publicPractice(entry);
  }

  async upsertPracticeProgress(input = {}) {
    await this.ready();
    const userId = requiredText(input.userId, 'userId', 128);
    const problemId = requiredText(input.problemId, 'problemId', 160);
    const language = requiredText(input.language, 'language', 48).toLowerCase();
    if (!await this.adapter.findUserById(userId)) {
      throw new StorageNotFoundError('The practice user does not exist.', 'user_not_found');
    }
    const current = await this.adapter.findPracticeProgress(userId, problemId, language);
    const status = enumInSet(
      own(input, 'status') ? input.status : current?.status || 'unsolved',
      'practiceStatus',
      PRACTICE_STATUSES
    );
    const attempts = integerInRange(
      own(input, 'attempts') ? input.attempts : current?.attempts || 0,
      'attempts',
      0,
      1_000_000
    );
    const passes = integerInRange(
      own(input, 'passes') ? input.passes : current?.passes || 0,
      'passes',
      0,
      attempts
    );
    if (status === 'solved' && passes < 1) {
      throw new StorageValidationError('Solved practice requires at least one pass.', 'invalid_practice_passes');
    }
    for (const field of ['solutionViewed', 'bookmarked']) {
      if (own(input, field) && typeof input[field] !== 'boolean') {
        throw new StorageValidationError(`${field} is not valid.`, `invalid_${field}`);
      }
    }
    const timestamp = this.currentDate(input.updatedAt, 'updatedAt').toISOString();
    const record = await this.adapter.upsertPracticeProgress({
      userId,
      problemId,
      language,
      status,
      attempts,
      passes,
      hintsUsed: integerInRange(
        own(input, 'hintsUsed') ? input.hintsUsed : current?.hintsUsed || 0,
        'hintsUsed',
        0,
        1_000_000
      ),
      hintDepth: integerInRange(
        own(input, 'hintDepth') ? input.hintDepth : current?.hintDepth || 0,
        'hintDepth',
        0,
        3
      ),
      solutionViewed: own(input, 'solutionViewed')
        ? input.solutionViewed === true
        : current?.solutionViewed === true,
      bookmarked: own(input, 'bookmarked')
        ? input.bookmarked === true
        : current?.bookmarked === true,
      evidenceLevel: enumInSet(
        own(input, 'evidenceLevel') ? input.evidenceLevel : current?.evidenceLevel || 'unknown',
        'evidenceLevel',
        PRACTICE_EVIDENCE
      ),
      lastVerdict: enumInSet(
        own(input, 'lastVerdict') ? input.lastVerdict : current?.lastVerdict || 'not-run',
        'lastVerdict',
        PRACTICE_VERDICTS
      ),
      reviewCount: integerInRange(
        own(input, 'reviewCount') ? input.reviewCount : current?.reviewCount || 0,
        'reviewCount',
        0,
        1_000_000
      ),
      explanation: own(input, 'explanation')
        ? practiceExplanation(input.explanation)
        : current?.explanation || '',
      confidence: own(input, 'confidence')
        ? optionalPracticeConfidence(input.confidence)
        : current?.confidence || null,
      lastAttemptAt: own(input, 'lastAttemptAt')
        ? optionalIsoDate(input.lastAttemptAt, 'lastAttemptAt')
        : current?.lastAttemptAt || null,
      solvedAt: own(input, 'solvedAt')
        ? optionalIsoDate(input.solvedAt, 'solvedAt')
        : current?.solvedAt || null,
      nextReviewAt: own(input, 'nextReviewAt')
        ? optionalIsoDate(input.nextReviewAt, 'nextReviewAt')
        : current?.nextReviewAt || null,
      lastDurationSeconds: integerInRange(
        own(input, 'lastDurationSeconds')
          ? input.lastDurationSeconds
          : current?.lastDurationSeconds || 0,
        'lastDurationSeconds',
        0,
        86_400
      ),
      createdAt: current?.createdAt || timestamp,
      updatedAt: timestamp,
    });
    return publicPractice(record);
  }

  async getTutorProfile(userId) {
    await this.ready();
    return publicTutorProfile(
      await this.adapter.findTutorProfile(requiredText(userId, 'userId', 128))
    );
  }

  async upsertTutorProfile(input = {}) {
    await this.ready();
    const userId = requiredText(input.userId, 'userId', 128);
    if (!await this.adapter.findUserById(userId)) {
      throw new StorageNotFoundError('The tutor profile user does not exist.', 'user_not_found');
    }
    const current = await this.adapter.findTutorProfile(userId);
    const timestamp = this.currentDate(input.updatedAt, 'updatedAt').toISOString();
    const booleanValue = (field, fallback) => {
      if (!own(input, field)) return fallback;
      if (typeof input[field] !== 'boolean') {
        throw new StorageValidationError(`${field} is not valid.`, `invalid_${field}`);
      }
      return input[field];
    };
    const record = await this.adapter.upsertTutorProfile({
      userId,
      stage: enumInSet(
        own(input, 'stage') ? input.stage : current?.stage || 'beginner',
        'stage',
        TUTOR_STAGES
      ),
      mastery: integerInRange(
        own(input, 'mastery') ? input.mastery : current?.mastery || 0,
        'mastery',
        0,
        100
      ),
      confidence: enumInSet(
        own(input, 'confidence') ? input.confidence : current?.confidence || 'unknown',
        'confidence',
        TUTOR_CONFIDENCE
      ),
      preferredLanguage: own(input, 'preferredLanguage')
        ? optionalText(input.preferredLanguage, 'preferredLanguage', 48).toLowerCase()
        : current?.preferredLanguage || '',
      preferredMode: enumInSet(
        own(input, 'preferredMode') ? input.preferredMode : current?.preferredMode || 'socratic',
        'preferredMode',
        TUTOR_MODES
      ),
      explanationDepth: enumInSet(
        own(input, 'explanationDepth')
          ? input.explanationDepth
          : current?.explanationDepth || 'balanced',
        'explanationDepth',
        EXPLANATION_DEPTHS
      ),
      visualLearning: booleanValue('visualLearning', current?.visualLearning !== false),
      reducedMotion: booleanValue('reducedMotion', current?.reducedMotion === true),
      strengths: own(input, 'strengths')
        ? stringList(input.strengths, 'strengths')
        : current?.strengths || [],
      focusAreas: own(input, 'focusAreas')
        ? stringList(input.focusAreas, 'focusAreas')
        : current?.focusAreas || [],
      createdAt: current?.createdAt || timestamp,
      updatedAt: timestamp,
    });
    return publicTutorProfile(record);
  }

  async healthCheck() {
    await this.ready();
    return typeof this.adapter.healthCheck === 'function'
      ? this.adapter.healthCheck()
      : { ok: true, kind: this.kind };
  }

  async close() {
    if (this.initializePromise) await this.initializePromise.catch(() => {});
    if (typeof this.adapter.close === 'function') await this.adapter.close();
  }
}

module.exports = {
  DEFAULT_SESSION_TTL_MS,
  PRACTICE_EVIDENCE,
  PRACTICE_CONFIDENCE,
  PRACTICE_STATUSES,
  PRACTICE_VERDICTS,
  PROGRESS_STATUSES,
  StorageRepository,
  publicProgress,
  publicPractice,
  publicSession,
  publicTutorProfile,
};
