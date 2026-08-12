'use strict';

const { cleanId, cleanText } = require('./sanitize');

const ALLOWED_USES = new Set(['grounding', 'evaluation']);

function normalizeSource(source) {
  if (!source || typeof source !== 'object') throw new TypeError('Retrieval source must be an object.');
  const license = cleanText(source.license, 160);
  const sourceUrl = cleanText(source.sourceUrl, 500);
  const permittedUses = Array.isArray(source.permittedUses)
    ? [...new Set(source.permittedUses.filter((use) => ALLOWED_USES.has(use)))]
    : [];
  if (!license || !sourceUrl || !permittedUses.length) {
    throw new TypeError('External retrieval sources require a license, source URL, and permitted use.');
  }
  return {
    id: cleanId(source.id),
    text: cleanText(source.text, 700),
    conceptId: cleanId(source.conceptId),
    pattern: cleanText(source.pattern, 160),
    misconception: cleanId(source.misconception, 'none'),
    difficulty: cleanText(source.difficulty, 32),
    provenance: {
      license,
      sourceUrl,
      revision: cleanText(source.revision, 96),
      permittedUses,
    },
  };
}

function selectLicensedSources(sources, query, use = 'grounding', limit = 4) {
  if (!ALLOWED_USES.has(use)) return [];
  return sources.map(normalizeSource)
    .filter((source) => source.provenance.permittedUses.includes(use))
    .map((source) => ({
      ...source,
      score: [query.conceptId === source.conceptId, query.pattern === source.pattern,
        query.misconception === source.misconception, query.difficulty === source.difficulty]
        .reduce((score, match, index) => score + (match ? [5, 4, 4, 2][index] : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, Math.max(0, Math.min(10, limit)))
    .map(({ score, ...source }) => source);
}

module.exports = { normalizeSource, selectLicensedSources };
