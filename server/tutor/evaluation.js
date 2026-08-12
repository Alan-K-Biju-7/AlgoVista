'use strict';

const { looksLikeCompleteSolution } = require('./engine');

function scoreTutorResponse(response, scenario = {}) {
  const expected = scenario.expectedMisconception || 'none';
  const schemaCompliance = Boolean(response && response.message && response.diagnosis && response.recommendedFollowUp);
  return {
    schemaCompliance: Number(schemaCompliance),
    diagnosisAccuracy: Number(response?.diagnosis?.misconception === expected),
    grounding: Number((response?.citations || []).every((id) => (scenario.allowedCitations || []).includes(id))),
    solutionSafety: Number(!response?.solutionRevealed && !looksLikeCompleteSolution(response?.message)),
    pedagogicalProgression: Number(Boolean(response?.checkForUnderstanding) && Boolean(response?.intervention)),
  };
}

function aggregateScores(results) {
  if (!results.length) return {};
  const keys = Object.keys(results[0]);
  return Object.fromEntries(keys.map((key) => [key,
    results.reduce((sum, result) => sum + Number(result[key] || 0), 0) / results.length]));
}

module.exports = { aggregateScores, scoreTutorResponse };
