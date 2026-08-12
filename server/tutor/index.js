'use strict';

const {
  LIMITS,
  MODE_POLICIES,
  PEDAGOGY_MODES,
  TUTOR_RESPONSE_SCHEMA,
  MISCONCEPTION_TYPES,
} = require('./constants');
const { diagnoseMisconception, teachingPolicy } = require('./adaptive');
const {
  buildGroundingCandidates,
  formatGrounding,
  selectGrounding,
} = require('./grounding');
const {
  buildProviderMessages,
  createOfflineTutorResponse,
  normalizeProviderResponse,
  prepareTutorTurn,
} = require('./engine');
const {
  TutorInputError,
  normalizeTutorRequest,
} = require('./sanitize');
const {
  loadCanonicalProblemCatalog,
  resolveCanonicalProblem,
} = require('./problemCatalog');

module.exports = {
  LIMITS,
  MODE_POLICIES,
  MISCONCEPTION_TYPES,
  PEDAGOGY_MODES,
  TUTOR_RESPONSE_SCHEMA,
  TutorInputError,
  buildGroundingCandidates,
  diagnoseMisconception,
  buildProviderMessages,
  createOfflineTutorResponse,
  formatGrounding,
  loadCanonicalProblemCatalog,
  normalizeProviderResponse,
  normalizeTutorRequest,
  prepareTutorTurn,
  resolveCanonicalProblem,
  selectGrounding,
  teachingPolicy,
};
