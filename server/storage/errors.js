'use strict';

class StorageError extends Error {
  constructor(message, code = 'storage_error', options = {}) {
    super(message, options);
    this.name = 'StorageError';
    this.code = code;
  }
}

class StorageValidationError extends StorageError {
  constructor(message, code = 'storage_validation_error', options = {}) {
    super(message, code, options);
    this.name = 'StorageValidationError';
  }
}

class StorageConflictError extends StorageError {
  constructor(message, code = 'storage_conflict', options = {}) {
    super(message, code, options);
    this.name = 'StorageConflictError';
  }
}

class StorageNotFoundError extends StorageError {
  constructor(message, code = 'storage_not_found', options = {}) {
    super(message, code, options);
    this.name = 'StorageNotFoundError';
  }
}

class StorageConfigurationError extends StorageError {
  constructor(message, code = 'storage_configuration_error', options = {}) {
    super(message, code, options);
    this.name = 'StorageConfigurationError';
  }
}

class StorageCorruptionError extends StorageError {
  constructor(message, code = 'storage_corruption', options = {}) {
    super(message, code, options);
    this.name = 'StorageCorruptionError';
  }
}

module.exports = {
  StorageConfigurationError,
  StorageConflictError,
  StorageCorruptionError,
  StorageError,
  StorageNotFoundError,
  StorageValidationError,
};
