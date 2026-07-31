'use strict';

const fs = require('node:fs');
const path = require('node:path');

const JSON_CATALOG_PATH = path.resolve(
  __dirname,
  '../../src/pages/practice/neetcode150/neetcode150.json'
);
const PROBLEM_SOURCE_ROOT = path.resolve(
  __dirname,
  '../../src/pages/practice/neetcode150/problems'
);
const ALLOWED_DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard']);
const METADATA_FIELDS = Object.freeze(['id', 'title', 'difficulty', 'pattern']);
const MAX_SOURCE_BYTES = 1024 * 1024;

let cachedCatalog;
let cachedById;

function failCatalog(reason) {
  throw new Error(`Invalid canonical problem catalog: ${reason}`);
}

function isSafeId(value) {
  return typeof value === 'string' &&
    value.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function validateMetadata(value, origin) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    failCatalog(`${origin} is not a metadata object`);
  }

  const metadata = {
    id: value.id,
    title: value.title,
    difficulty: value.difficulty,
    pattern: value.pattern,
  };

  if (!isSafeId(metadata.id)) failCatalog(`${origin} has an invalid id`);
  if (typeof metadata.title !== 'string' || !metadata.title.trim() || metadata.title.length > 160) {
    failCatalog(`${origin} has an invalid title`);
  }
  if (!ALLOWED_DIFFICULTIES.has(metadata.difficulty)) {
    failCatalog(`${origin} has an invalid difficulty`);
  }
  if (typeof metadata.pattern !== 'string' || !metadata.pattern.trim() || metadata.pattern.length > 160) {
    failCatalog(`${origin} has an invalid pattern`);
  }
  if ([metadata.title, metadata.pattern].some((text) => /[\u0000-\u001f\u007f]/.test(text))) {
    failCatalog(`${origin} contains control characters`);
  }

  return Object.freeze({
    id: metadata.id,
    title: metadata.title.trim(),
    difficulty: metadata.difficulty,
    pattern: metadata.pattern.trim(),
  });
}

function parseQuotedScalar(line, field) {
  const prefix = `${field}:`;
  const trimmed = line.trim();
  if (!trimmed.startsWith(prefix)) return undefined;

  const literal = trimmed.slice(prefix.length).trim().replace(/,$/, '');
  const quote = literal[0];
  if (!['\'', '"'].includes(quote) || literal.at(-1) !== quote) return null;

  const value = literal.slice(1, -1);
  // Catalog metadata is intentionally limited to plain scalar literals. Do
  // not evaluate JavaScript or accept interpolation/escape ambiguity.
  if (value.includes(quote) || value.includes('\\') || value.includes('`')) return null;
  return value;
}

function parseProblemSource(source, origin) {
  const found = {};
  for (const line of source.split(/\r?\n/)) {
    for (const field of METADATA_FIELDS) {
      if (Object.hasOwn(found, field)) continue;
      const value = parseQuotedScalar(line, field);
      if (value === null) failCatalog(`${origin} has a non-scalar ${field}`);
      if (value !== undefined) found[field] = value;
    }
  }

  if (METADATA_FIELDS.some((field) => !Object.hasOwn(found, field))) {
    failCatalog(`${origin} is missing required metadata`);
  }
  return validateMetadata(found, origin);
}

function listProblemSourceFiles(root) {
  const files = [];
  const visit = (directory) => {
    const entries = fs.readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile() && entry.name.endsWith('.js') && entry.name !== 'index.js') files.push(target);
    }
  };
  visit(root);
  return files;
}

function readJsonCatalog() {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(JSON_CATALOG_PATH, 'utf8'));
  } catch {
    failCatalog('NeetCode JSON could not be loaded');
  }
  if (!Array.isArray(parsed)) failCatalog('NeetCode JSON must be an array');
  return parsed.map((entry, index) => validateMetadata(entry, `JSON entry ${index + 1}`));
}

function readSourceCatalog() {
  const files = listProblemSourceFiles(PROBLEM_SOURCE_ROOT);
  if (!files.length) failCatalog('no practice problem sources were found');

  return files.map((file) => {
    const stat = fs.statSync(file);
    if (stat.size > MAX_SOURCE_BYTES) failCatalog('a practice source exceeds the size limit');
    const relativePath = path.relative(PROBLEM_SOURCE_ROOT, file);
    const metadata = parseProblemSource(fs.readFileSync(file, 'utf8'), relativePath);
    if (metadata.id !== path.basename(file, '.js')) {
      failCatalog(`${relativePath} id does not match its filename`);
    }
    return metadata;
  });
}

function ensureCatalog() {
  if (cachedCatalog && cachedById) return;

  const records = new Map();
  const jsonIds = new Set();
  const sourceIds = new Set();
  for (const metadata of readJsonCatalog()) {
    if (jsonIds.has(metadata.id)) failCatalog(`duplicate JSON problem id ${metadata.id}`);
    jsonIds.add(metadata.id);
    records.set(metadata.id, metadata);
  }

  for (const metadata of readSourceCatalog()) {
    if (sourceIds.has(metadata.id)) failCatalog(`duplicate problem id ${metadata.id}`);
    sourceIds.add(metadata.id);

    const existing = records.get(metadata.id);
    if (existing && METADATA_FIELDS.some((field) => existing[field] !== metadata[field])) {
      failCatalog(`JSON and source metadata disagree for ${metadata.id}`);
    }
    records.set(metadata.id, metadata);
  }

  // Every JSON entry must map to an actual, server-owned practice source.
  for (const id of records.keys()) {
    if (!sourceIds.has(id)) failCatalog(`JSON problem ${id} has no practice source`);
  }

  cachedCatalog = Object.freeze(
    [...records.values()].sort((left, right) => left.id.localeCompare(right.id))
  );
  cachedById = new Map(cachedCatalog.map((metadata) => [metadata.id, metadata]));
}

function copyMetadata(metadata) {
  return metadata ? {
    id: metadata.id,
    title: metadata.title,
    difficulty: metadata.difficulty,
    pattern: metadata.pattern,
  } : null;
}

function loadCanonicalProblemCatalog() {
  ensureCatalog();
  return cachedCatalog.map(copyMetadata);
}

function resolveCanonicalProblem(reference) {
  const id = typeof reference === 'string'
    ? reference.trim()
    : reference && typeof reference === 'object' && !Array.isArray(reference)
      && typeof reference.id === 'string'
      ? reference.id.trim()
      : '';

  if (!isSafeId(id)) return null;
  ensureCatalog();
  return copyMetadata(cachedById.get(id));
}

module.exports = {
  loadCanonicalProblemCatalog,
  resolveCanonicalProblem,
};
