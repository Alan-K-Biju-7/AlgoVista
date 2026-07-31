'use strict';

const {
  StorageConfigurationError,
  StorageConflictError,
  StorageError,
  StorageNotFoundError,
} = require('./errors');
const { runPostgresMigrations } = require('./migrations');

function asIso(value) {
  if (value === null || value === undefined) return null;
  return new Date(value).toISOString();
}

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
  };
}

function mapSession(row) {
  if (!row) return null;
  return {
    tokenDigest: row.token_digest,
    csrfDigest: row.csrf_digest,
    userId: row.user_id,
    createdAt: asIso(row.created_at),
    expiresAt: asIso(row.expires_at),
    revokedAt: asIso(row.revoked_at),
  };
}

function mapProgress(row) {
  if (!row) return null;
  return {
    userId: row.user_id,
    conceptId: row.concept_id,
    status: row.status,
    confidence: Number(row.confidence),
    notes: row.notes,
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
  };
}

function mapPractice(row) {
  if (!row) return null;
  return {
    userId: row.user_id,
    problemId: row.problem_id,
    language: row.language,
    status: row.status,
    attempts: Number(row.attempts),
    passes: Number(row.passes),
    hintsUsed: Number(row.hints_used),
    hintDepth: Number(row.hint_depth),
    solutionViewed: row.solution_viewed === true,
    bookmarked: row.bookmarked === true,
    evidenceLevel: row.evidence_level,
    lastVerdict: row.last_verdict,
    reviewCount: Number(row.review_count),
    explanation: row.explanation,
    confidence: row.confidence ?? null,
    lastAttemptAt: asIso(row.last_attempt_at),
    solvedAt: asIso(row.solved_at),
    nextReviewAt: asIso(row.next_review_at),
    lastDurationSeconds: Number(row.last_duration_seconds),
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
  };
}

function mapTutorProfile(row) {
  if (!row) return null;
  return {
    userId: row.user_id,
    stage: row.stage,
    mastery: Number(row.mastery),
    confidence: row.confidence,
    preferredLanguage: row.preferred_language,
    preferredMode: row.preferred_mode,
    explanationDepth: row.explanation_depth,
    visualLearning: row.visual_learning === true,
    reducedMotion: row.reduced_motion === true,
    strengths: Array.isArray(row.strengths) ? [...row.strengths] : [],
    focusAreas: Array.isArray(row.focus_areas) ? [...row.focus_areas] : [],
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
  };
}

function translatePostgresError(error, entity) {
  if (error?.code === '23505') {
    return new StorageConflictError(`${entity} already exists.`, `${entity}_conflict`, { cause: error });
  }
  if (error?.code === '23503') {
    return new StorageNotFoundError(`${entity} references a record that does not exist.`, `${entity}_reference_missing`, { cause: error });
  }
  return new StorageError(`PostgreSQL could not persist ${entity}.`, 'postgres_query_failed', { cause: error });
}

class PostgresStorageAdapter {
  constructor({
    databaseUrl,
    pool = null,
    ssl,
    maxConnections = 10,
    idleTimeoutMillis = 30_000,
    connectionTimeoutMillis = 5_000,
  } = {}) {
    if (!pool && (typeof databaseUrl !== 'string' || !databaseUrl.trim())) {
      throw new StorageConfigurationError('DATABASE_URL is required for PostgreSQL storage.');
    }
    this.kind = 'postgres';
    this.databaseUrl = databaseUrl;
    this.pool = pool;
    this.ownsPool = !pool;
    this.poolOptions = {
      connectionString: databaseUrl,
      max: maxConnections,
      idleTimeoutMillis,
      connectionTimeoutMillis,
      application_name: 'algovista',
      ...(ssl === undefined ? {} : { ssl }),
    };
    this.initializePromise = null;
  }

  getPool() {
    if (this.pool) return this.pool;
    let pg;
    try {
      // Deliberately lazy: local JSON development never needs `pg` installed.
      pg = require('pg');
    } catch (error) {
      throw new StorageConfigurationError(
        'PostgreSQL storage requires the optional `pg` package.',
        'postgres_driver_missing',
        { cause: error }
      );
    }
    this.pool = new pg.Pool(this.poolOptions);
    return this.pool;
  }

  async initialize() {
    if (!this.initializePromise) {
      this.initializePromise = (async () => {
        const client = await this.getPool().connect();
        try {
          await runPostgresMigrations(client);
        } finally {
          client.release();
        }
      })();
    }
    await this.initializePromise;
    return this;
  }

  async ready() {
    await this.initialize();
  }

  async insertUser(user) {
    await this.ready();
    try {
      const result = await this.getPool().query(
        `INSERT INTO algovista_users
          (id, name, email, password_hash, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user.id, user.name, user.email, user.passwordHash, user.createdAt, user.updatedAt]
      );
      return mapUser(result.rows[0]);
    } catch (error) {
      throw translatePostgresError(error, 'user');
    }
  }

  async findUserByEmail(email) {
    await this.ready();
    const result = await this.getPool().query(
      'SELECT * FROM algovista_users WHERE email = $1 LIMIT 1',
      [email]
    );
    return mapUser(result.rows[0]);
  }

  async findUserById(userId) {
    await this.ready();
    const result = await this.getPool().query(
      'SELECT * FROM algovista_users WHERE id = $1 LIMIT 1',
      [userId]
    );
    return mapUser(result.rows[0]);
  }

  async updateUserPasswordHash(userId, passwordHash, updatedAt) {
    await this.ready();
    const result = await this.getPool().query(
      `UPDATE algovista_users
       SET password_hash = $2, updated_at = $3
       WHERE id = $1
       RETURNING *`,
      [userId, passwordHash, updatedAt]
    );
    return mapUser(result.rows[0]);
  }

  async insertSession(session) {
    await this.ready();
    try {
      const result = await this.getPool().query(
        `INSERT INTO algovista_sessions
          (token_digest, csrf_digest, user_id, created_at, expires_at, revoked_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          session.tokenDigest,
          session.csrfDigest,
          session.userId,
          session.createdAt,
          session.expiresAt,
          session.revokedAt,
        ]
      );
      return mapSession(result.rows[0]);
    } catch (error) {
      throw translatePostgresError(error, 'session');
    }
  }

  async findSessionByTokenDigest(tokenDigest) {
    await this.ready();
    const result = await this.getPool().query(
      'SELECT * FROM algovista_sessions WHERE token_digest = $1 LIMIT 1',
      [tokenDigest]
    );
    return mapSession(result.rows[0]);
  }

  async revokeSession(tokenDigest, revokedAt) {
    await this.ready();
    const result = await this.getPool().query(
      `UPDATE algovista_sessions
       SET revoked_at = $2
       WHERE token_digest = $1 AND revoked_at IS NULL`,
      [tokenDigest, revokedAt]
    );
    return result.rowCount > 0;
  }

  async updateSessionCsrfDigest(tokenDigest, expectedCsrfDigest, csrfDigest, now) {
    await this.ready();
    const result = await this.getPool().query(
      `UPDATE algovista_sessions
       SET csrf_digest = $2
       WHERE token_digest = $1
         AND revoked_at IS NULL
         AND csrf_digest = $3
         AND expires_at > $4`,
      [tokenDigest, csrfDigest, expectedCsrfDigest, now]
    );
    return result.rowCount > 0;
  }

  async revokeUserSessions(userId, exceptDigest, revokedAt) {
    await this.ready();
    const result = await this.getPool().query(
      `UPDATE algovista_sessions
       SET revoked_at = $3
       WHERE user_id = $1
         AND revoked_at IS NULL
         AND ($2::TEXT IS NULL OR token_digest <> $2)`,
      [userId, exceptDigest, revokedAt]
    );
    return result.rowCount;
  }

  async deleteExpiredSessions(now) {
    await this.ready();
    const result = await this.getPool().query(
      'DELETE FROM algovista_sessions WHERE expires_at <= $1',
      [now]
    );
    return result.rowCount;
  }

  async listConceptProgress(userId) {
    await this.ready();
    const result = await this.getPool().query(
      `SELECT * FROM algovista_concept_progress
       WHERE user_id = $1
       ORDER BY concept_id ASC`,
      [userId]
    );
    return result.rows.map(mapProgress);
  }

  async findConceptProgress(userId, conceptId) {
    await this.ready();
    const result = await this.getPool().query(
      `SELECT * FROM algovista_concept_progress
       WHERE user_id = $1 AND concept_id = $2
       LIMIT 1`,
      [userId, conceptId]
    );
    return mapProgress(result.rows[0]);
  }

  async upsertConceptProgress(progress) {
    await this.ready();
    try {
      const result = await this.getPool().query(
        `INSERT INTO algovista_concept_progress
          (user_id, concept_id, status, confidence, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, concept_id) DO UPDATE SET
           status = EXCLUDED.status,
           confidence = EXCLUDED.confidence,
           notes = EXCLUDED.notes,
           updated_at = EXCLUDED.updated_at
         RETURNING *`,
        [
          progress.userId,
          progress.conceptId,
          progress.status,
          progress.confidence,
          progress.notes,
          progress.createdAt,
          progress.updatedAt,
        ]
      );
      return mapProgress(result.rows[0]);
    } catch (error) {
      throw translatePostgresError(error, 'progress');
    }
  }

  async listPracticeProgress(userId) {
    await this.ready();
    const result = await this.getPool().query(
      `SELECT * FROM algovista_practice_progress
       WHERE user_id = $1
       ORDER BY problem_id ASC, language ASC`,
      [userId]
    );
    return result.rows.map(mapPractice);
  }

  async findPracticeProgress(userId, problemId, language) {
    await this.ready();
    const result = await this.getPool().query(
      `SELECT * FROM algovista_practice_progress
       WHERE user_id = $1 AND problem_id = $2 AND language = $3
       LIMIT 1`,
      [userId, problemId, language]
    );
    return mapPractice(result.rows[0]);
  }

  async upsertPracticeProgress(progress) {
    await this.ready();
    try {
      const result = await this.getPool().query(
        `INSERT INTO algovista_practice_progress
          (user_id, problem_id, language, status, attempts, passes, hints_used,
           hint_depth, solution_viewed, bookmarked, evidence_level, last_verdict,
           review_count, explanation, confidence, last_attempt_at, solved_at,
           next_review_at, last_duration_seconds, created_at, updated_at)
         VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
           $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
         )
         ON CONFLICT (user_id, problem_id, language) DO UPDATE SET
           status = EXCLUDED.status,
           attempts = EXCLUDED.attempts,
           passes = EXCLUDED.passes,
           hints_used = EXCLUDED.hints_used,
           hint_depth = EXCLUDED.hint_depth,
           solution_viewed = EXCLUDED.solution_viewed,
           bookmarked = EXCLUDED.bookmarked,
           evidence_level = EXCLUDED.evidence_level,
           last_verdict = EXCLUDED.last_verdict,
           review_count = EXCLUDED.review_count,
           explanation = EXCLUDED.explanation,
           confidence = EXCLUDED.confidence,
           last_attempt_at = EXCLUDED.last_attempt_at,
           solved_at = EXCLUDED.solved_at,
           next_review_at = EXCLUDED.next_review_at,
           last_duration_seconds = EXCLUDED.last_duration_seconds,
           updated_at = EXCLUDED.updated_at
         RETURNING *`,
        [
          progress.userId,
          progress.problemId,
          progress.language,
          progress.status,
          progress.attempts,
          progress.passes,
          progress.hintsUsed,
          progress.hintDepth,
          progress.solutionViewed,
          progress.bookmarked,
          progress.evidenceLevel,
          progress.lastVerdict,
          progress.reviewCount,
          progress.explanation,
          progress.confidence,
          progress.lastAttemptAt,
          progress.solvedAt,
          progress.nextReviewAt,
          progress.lastDurationSeconds,
          progress.createdAt,
          progress.updatedAt,
        ]
      );
      return mapPractice(result.rows[0]);
    } catch (error) {
      throw translatePostgresError(error, 'practice');
    }
  }

  async findTutorProfile(userId) {
    await this.ready();
    const result = await this.getPool().query(
      'SELECT * FROM algovista_tutor_profiles WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    return mapTutorProfile(result.rows[0]);
  }

  async upsertTutorProfile(profile) {
    await this.ready();
    try {
      const result = await this.getPool().query(
        `INSERT INTO algovista_tutor_profiles
          (user_id, stage, mastery, confidence, preferred_language, preferred_mode,
           explanation_depth, visual_learning, reduced_motion, strengths, focus_areas,
           created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::JSONB, $11::JSONB, $12, $13)
         ON CONFLICT (user_id) DO UPDATE SET
           stage = EXCLUDED.stage,
           mastery = EXCLUDED.mastery,
           confidence = EXCLUDED.confidence,
           preferred_language = EXCLUDED.preferred_language,
           preferred_mode = EXCLUDED.preferred_mode,
           explanation_depth = EXCLUDED.explanation_depth,
           visual_learning = EXCLUDED.visual_learning,
           reduced_motion = EXCLUDED.reduced_motion,
           strengths = EXCLUDED.strengths,
           focus_areas = EXCLUDED.focus_areas,
           updated_at = EXCLUDED.updated_at
         RETURNING *`,
        [
          profile.userId,
          profile.stage,
          profile.mastery,
          profile.confidence,
          profile.preferredLanguage,
          profile.preferredMode,
          profile.explanationDepth,
          profile.visualLearning,
          profile.reducedMotion,
          JSON.stringify(profile.strengths),
          JSON.stringify(profile.focusAreas),
          profile.createdAt,
          profile.updatedAt,
        ]
      );
      return mapTutorProfile(result.rows[0]);
    } catch (error) {
      throw translatePostgresError(error, 'tutor_profile');
    }
  }

  async healthCheck() {
    await this.ready();
    await this.getPool().query('SELECT 1');
    return { ok: true, kind: this.kind };
  }

  async close() {
    if (this.ownsPool && this.pool) await this.pool.end();
  }
}

module.exports = {
  PostgresStorageAdapter,
  mapPractice,
  mapProgress,
  mapSession,
  mapTutorProfile,
  mapUser,
  translatePostgresError,
};
