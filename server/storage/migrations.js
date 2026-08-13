'use strict';

const POSTGRES_MIGRATIONS = Object.freeze([
  Object.freeze({
    version: 1,
    name: 'users-sessions-concept-progress',
    statements: Object.freeze([
      `CREATE TABLE IF NOT EXISTS algovista_users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        CONSTRAINT algovista_users_email_normalized CHECK (email = LOWER(email))
      )`,
      'CREATE UNIQUE INDEX IF NOT EXISTS algovista_users_email_unique ON algovista_users (email)',
      `CREATE TABLE IF NOT EXISTS algovista_sessions (
        token_digest CHAR(64) PRIMARY KEY,
        csrf_digest CHAR(64) NOT NULL,
        user_id TEXT NOT NULL REFERENCES algovista_users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ,
        CONSTRAINT algovista_sessions_token_digest_hex CHECK (token_digest ~ '^[a-f0-9]{64}$'),
        CONSTRAINT algovista_sessions_csrf_digest_hex CHECK (csrf_digest ~ '^[a-f0-9]{64}$'),
        CONSTRAINT algovista_sessions_expiry_order CHECK (expires_at > created_at)
      )`,
      'CREATE INDEX IF NOT EXISTS algovista_sessions_user_id_idx ON algovista_sessions (user_id)',
      'CREATE INDEX IF NOT EXISTS algovista_sessions_expiry_idx ON algovista_sessions (expires_at)',
      `CREATE TABLE IF NOT EXISTS algovista_concept_progress (
        user_id TEXT NOT NULL REFERENCES algovista_users(id) ON DELETE CASCADE,
        concept_id TEXT NOT NULL,
        status TEXT NOT NULL,
        confidence SMALLINT NOT NULL DEFAULT 0,
        notes TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (user_id, concept_id),
        CONSTRAINT algovista_progress_status CHECK (
          status IN ('not-started', 'learning', 'confident', 'mastered')
        ),
        CONSTRAINT algovista_progress_confidence CHECK (confidence BETWEEN 0 AND 100)
      )`,
      'CREATE INDEX IF NOT EXISTS algovista_progress_user_updated_idx ON algovista_concept_progress (user_id, updated_at DESC)',
    ]),
  }),
  Object.freeze({
    version: 2,
    name: 'practice-progress-and-tutor-profiles',
    statements: Object.freeze([
      `CREATE TABLE IF NOT EXISTS algovista_practice_progress (
        user_id TEXT NOT NULL REFERENCES algovista_users(id) ON DELETE CASCADE,
        problem_id TEXT NOT NULL,
        language TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unsolved',
        attempts INTEGER NOT NULL DEFAULT 0,
        passes INTEGER NOT NULL DEFAULT 0,
        hints_used INTEGER NOT NULL DEFAULT 0,
        hint_depth SMALLINT NOT NULL DEFAULT 0,
        solution_viewed BOOLEAN NOT NULL DEFAULT FALSE,
        evidence_level TEXT NOT NULL DEFAULT 'unknown',
        last_verdict TEXT NOT NULL DEFAULT 'not-run',
        last_attempt_at TIMESTAMPTZ,
        next_review_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (user_id, problem_id, language),
        CONSTRAINT algovista_practice_status CHECK (status IN ('unsolved', 'attempted', 'solved')),
        CONSTRAINT algovista_practice_counts CHECK (
          attempts >= 0 AND passes >= 0 AND passes <= attempts AND hints_used >= 0
        ),
        CONSTRAINT algovista_practice_hint_depth CHECK (hint_depth BETWEEN 0 AND 3),
        CONSTRAINT algovista_practice_evidence CHECK (
          evidence_level IN ('unknown', 'seen', 'guided', 'independent', 'durable', 'transfer')
        ),
        CONSTRAINT algovista_practice_verdict CHECK (
          last_verdict IN (
            'not-run', 'accepted', 'wrong-answer', 'compile', 'runtime',
            'timeout', 'memory-limit', 'unknown'
          )
        )
      )`,
      'CREATE INDEX IF NOT EXISTS algovista_practice_user_review_idx ON algovista_practice_progress (user_id, next_review_at)',
      `CREATE TABLE IF NOT EXISTS algovista_tutor_profiles (
        user_id TEXT PRIMARY KEY REFERENCES algovista_users(id) ON DELETE CASCADE,
        stage TEXT NOT NULL DEFAULT 'beginner',
        mastery SMALLINT NOT NULL DEFAULT 0,
        confidence TEXT NOT NULL DEFAULT 'unknown',
        preferred_language TEXT NOT NULL DEFAULT '',
        preferred_mode TEXT NOT NULL DEFAULT 'socratic',
        explanation_depth TEXT NOT NULL DEFAULT 'balanced',
        visual_learning BOOLEAN NOT NULL DEFAULT TRUE,
        reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
        strengths JSONB NOT NULL DEFAULT '[]'::JSONB,
        focus_areas JSONB NOT NULL DEFAULT '[]'::JSONB,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        CONSTRAINT algovista_tutor_stage CHECK (stage IN ('beginner', 'intermediate', 'advanced', 'unknown')),
        CONSTRAINT algovista_tutor_mastery CHECK (mastery BETWEEN 0 AND 100),
        CONSTRAINT algovista_tutor_confidence CHECK (
          confidence IN ('shaky', 'developing', 'confident', 'unknown')
        ),
        CONSTRAINT algovista_tutor_mode CHECK (
          preferred_mode IN ('socratic', 'debug', 'dry-run', 'quiz', 'complexity', 'review')
        ),
        CONSTRAINT algovista_tutor_explanation_depth CHECK (
          explanation_depth IN ('concise', 'balanced', 'detailed')
        ),
        CONSTRAINT algovista_tutor_strengths_array CHECK (
          jsonb_typeof(strengths) = 'array' AND jsonb_array_length(strengths) <= 12
        ),
        CONSTRAINT algovista_tutor_focus_areas_array CHECK (
          jsonb_typeof(focus_areas) = 'array' AND jsonb_array_length(focus_areas) <= 12
        )
      )`,
    ]),
  }),
  Object.freeze({
    version: 3,
    name: 'practice-learning-records',
    statements: Object.freeze([
      `ALTER TABLE algovista_practice_progress
        ADD COLUMN IF NOT EXISTS bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS review_count INTEGER NOT NULL DEFAULT 0
          CONSTRAINT algovista_practice_review_count CHECK (review_count BETWEEN 0 AND 1000000),
        ADD COLUMN IF NOT EXISTS explanation VARCHAR(2000) NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS confidence VARCHAR(16)
          CONSTRAINT algovista_practice_confidence CHECK (
            confidence IS NULL OR confidence IN ('shaky', 'developing', 'confident')
          ),
        ADD COLUMN IF NOT EXISTS solved_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS last_duration_seconds INTEGER NOT NULL DEFAULT 0
          CONSTRAINT algovista_practice_duration CHECK (
            last_duration_seconds BETWEEN 0 AND 86400
          )`,
      `CREATE INDEX IF NOT EXISTS algovista_practice_user_bookmarked_idx
        ON algovista_practice_progress (user_id, problem_id)
        WHERE bookmarked = TRUE`,
    ]),
  }),
  Object.freeze({
    version: 4,
    name: 'adaptive-coaching-events',
    statements: Object.freeze([
      `CREATE TABLE IF NOT EXISTS algovista_coaching_events (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES algovista_users(id) ON DELETE CASCADE,
        event_type TEXT NOT NULL,
        session_id TEXT NOT NULL DEFAULT '',
        attempt_id TEXT NOT NULL DEFAULT '',
        concept_id TEXT NOT NULL DEFAULT '',
        misconception TEXT NOT NULL DEFAULT 'none',
        hint_level SMALLINT NOT NULL DEFAULT 0,
        outcome TEXT NOT NULL DEFAULT '',
        rating SMALLINT,
        created_at TIMESTAMPTZ NOT NULL,
        CONSTRAINT algovista_coaching_event_type CHECK (event_type IN ('tutor-turn', 'feedback', 'transfer-outcome')),
        CONSTRAINT algovista_coaching_hint CHECK (hint_level BETWEEN 0 AND 3),
        CONSTRAINT algovista_coaching_rating CHECK (rating IS NULL OR rating IN (-1, 1))
      )`,
      'CREATE INDEX IF NOT EXISTS algovista_coaching_user_created_idx ON algovista_coaching_events (user_id, created_at DESC)',
    ]),
  }),
]);

async function runPostgresMigrations(client) {
  await client.query('BEGIN');
  try {
    // A transaction-scoped lock prevents two application instances from
    // racing the same migration during a deploy.
    await client.query('SELECT pg_advisory_xact_lock($1, $2)', [1095521366, 1]);
    await client.query(`CREATE TABLE IF NOT EXISTS algovista_schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);

    for (const migration of POSTGRES_MIGRATIONS) {
      const applied = await client.query(
        'SELECT 1 FROM algovista_schema_migrations WHERE version = $1',
        [migration.version]
      );
      if (applied.rowCount) continue;

      for (const statement of migration.statements) await client.query(statement);
      await client.query(
        `INSERT INTO algovista_schema_migrations (version, name)
         VALUES ($1, $2)
         ON CONFLICT (version) DO NOTHING`,
        [migration.version, migration.name]
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

module.exports = {
  POSTGRES_MIGRATIONS,
  runPostgresMigrations,
};
