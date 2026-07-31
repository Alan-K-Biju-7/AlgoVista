'use strict';

const path = require('node:path');
const {
  StorageConfigurationError,
  StorageConflictError,
  StorageCorruptionError,
  StorageError,
  StorageNotFoundError,
  StorageValidationError,
} = require('./errors');
const {
  JSON_SCHEMA_VERSION,
  JsonStorageAdapter,
  normalizeJsonState,
} = require('./jsonAdapter');
const { POSTGRES_MIGRATIONS, runPostgresMigrations } = require('./migrations');
const { PostgresStorageAdapter } = require('./postgresAdapter');
const {
  DEFAULT_SESSION_TTL_MS,
  PRACTICE_CONFIDENCE,
  PRACTICE_EVIDENCE,
  PRACTICE_STATUSES,
  PRACTICE_VERDICTS,
  PROGRESS_STATUSES,
  StorageRepository,
} = require('./repository');
const { deriveSessionCsrfToken, digestSecret } = require('./secrets');

const DEFAULT_JSON_PATH = path.resolve(__dirname, '../data/db.json');

function explicitOption(options, key, fallback) {
  return Object.prototype.hasOwnProperty.call(options, key) ? options[key] : fallback;
}

function createStorage(options = {}) {
  const databaseUrl = explicitOption(options, 'databaseUrl', process.env.DATABASE_URL || '');
  const jsonPath = explicitOption(
    options,
    'jsonPath',
    process.env.LOCAL_DATABASE_PATH || DEFAULT_JSON_PATH
  );
  const adapter = options.adapter || (
    databaseUrl || options.pool
      ? new PostgresStorageAdapter({
        databaseUrl,
        pool: options.pool,
        ...(options.postgres || {}),
      })
      : new JsonStorageAdapter({ filePath: jsonPath, ...(options.json || {}) })
  );

  return new StorageRepository(adapter, {
    tokenPepper: explicitOption(
      options,
      'tokenPepper',
      process.env.SESSION_DIGEST_PEPPER || ''
    ),
    csrfPepper: explicitOption(
      options,
      'csrfPepper',
      process.env.CSRF_DIGEST_PEPPER || process.env.SESSION_DIGEST_PEPPER || ''
    ),
    sessionTtlMs: explicitOption(options, 'sessionTtlMs', DEFAULT_SESSION_TTL_MS),
    ...(options.clock ? { clock: options.clock } : {}),
    ...(options.secretGenerator ? { secretGenerator: options.secretGenerator } : {}),
  });
}

module.exports = {
  DEFAULT_JSON_PATH,
  DEFAULT_SESSION_TTL_MS,
  JSON_SCHEMA_VERSION,
  JsonStorageAdapter,
  POSTGRES_MIGRATIONS,
  PRACTICE_CONFIDENCE,
  PRACTICE_EVIDENCE,
  PRACTICE_STATUSES,
  PRACTICE_VERDICTS,
  PROGRESS_STATUSES,
  PostgresStorageAdapter,
  StorageConfigurationError,
  StorageConflictError,
  StorageCorruptionError,
  StorageError,
  StorageNotFoundError,
  StorageRepository,
  StorageValidationError,
  createStorage,
  deriveSessionCsrfToken,
  digestSecret,
  normalizeJsonState,
  runPostgresMigrations,
};
